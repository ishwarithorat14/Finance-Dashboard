from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import (
    LearningCategory, FinanceConcept, LearningResource,
    Quiz, QuizQuestion, QuizAttempt, CaseStudy
)
from backend.schemas import (
    LearningCategoryResponse, FinanceConceptResponse, FinanceConceptCreate,
    FinanceConceptUpdate, LearningResourceCreate, LearningResourceUpdate,
    LearningResourceResponse, QuizResponse, QuizSubmitRequest, QuizSubmitResponse,
    CaseStudyResponse, CaseStudyCreate, CaseStudyUpdate
)

router = APIRouter(prefix="/api/learning", tags=["Learning"])

# --- Categories ---
@router.get("/categories", response_model=List[LearningCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(LearningCategory).order_by(LearningCategory.display_order.asc()).all()
    results = []
    for cat in categories:
        concepts = cat.concepts
        total_concepts = len(concepts)
        completed = sum(1 for c in concepts if c.learning_status == "Completed")
        results.append(LearningCategoryResponse(
            id=cat.id,
            name=cat.name,
            description=cat.description,
            icon=cat.icon,
            display_order=cat.display_order,
            concept_count=total_concepts,
            completed_count=completed
        ))
    return results

# --- Concepts ---
@router.get("/concepts", response_model=List[FinanceConceptResponse])
def get_concepts(
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FinanceConcept)
    if category_id:
        query = query.filter(FinanceConcept.category_id == category_id)
    if status and status != "All":
        query = query.filter(FinanceConcept.learning_status == status)
    if search:
        query = query.filter(FinanceConcept.name.ilike(f"%{search}%") | FinanceConcept.short_description.ilike(f"%{search}%"))
    
    concepts = query.order_by(FinanceConcept.id.asc()).all()
    results = []
    for c in concepts:
        results.append(FinanceConceptResponse(
            id=c.id,
            category_id=c.category_id,
            category_name=c.category.name if c.category else "",
            name=c.name,
            short_description=c.short_description,
            content=c.content,
            learning_status=c.learning_status,
            progress_pct=c.progress_pct,
            last_stopping_point=c.last_stopping_point,
            next_action=c.next_action,
            personal_notes=c.personal_notes,
            resources=[
                LearningResourceResponse.model_validate(r) for r in c.resources
            ],
            has_quiz=c.quiz is not None,
            created_at=c.created_at,
            updated_at=c.updated_at
        ))
    return results

@router.get("/concepts/{concept_id}", response_model=FinanceConceptResponse)
def get_concept(concept_id: int, db: Session = Depends(get_db)):
    c = db.query(FinanceConcept).filter(FinanceConcept.id == concept_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concept not found")
    return FinanceConceptResponse(
        id=c.id,
        category_id=c.category_id,
        category_name=c.category.name if c.category else "",
        name=c.name,
        short_description=c.short_description,
        content=c.content,
        learning_status=c.learning_status,
        progress_pct=c.progress_pct,
        last_stopping_point=c.last_stopping_point,
        next_action=c.next_action,
        personal_notes=c.personal_notes,
        resources=[LearningResourceResponse.model_validate(r) for r in c.resources],
        has_quiz=c.quiz is not None,
        created_at=c.created_at,
        updated_at=c.updated_at
    )

@router.post("/concepts", response_model=FinanceConceptResponse)
def create_concept(concept_in: FinanceConceptCreate, db: Session = Depends(get_db)):
    cat = db.query(LearningCategory).filter(LearningCategory.id == concept_in.category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    new_c = FinanceConcept(**concept_in.model_dump())
    db.add(new_c)
    db.commit()
    db.refresh(new_c)
    return FinanceConceptResponse(
        id=new_c.id,
        category_id=new_c.category_id,
        category_name=cat.name,
        name=new_c.name,
        short_description=new_c.short_description,
        content=new_c.content,
        learning_status=new_c.learning_status,
        progress_pct=new_c.progress_pct,
        last_stopping_point=new_c.last_stopping_point,
        next_action=new_c.next_action,
        personal_notes=new_c.personal_notes,
        resources=[],
        has_quiz=False,
        created_at=new_c.created_at,
        updated_at=new_c.updated_at
    )

@router.put("/concepts/{concept_id}", response_model=FinanceConceptResponse)
def update_concept(concept_id: int, update_in: FinanceConceptUpdate, db: Session = Depends(get_db)):
    c = db.query(FinanceConcept).filter(FinanceConcept.id == concept_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    data = update_in.model_dump(exclude_unset=True)
    for key, val in data.items():
        setattr(c, key, val)
    
    # Auto-adjust status if progress is 100% or 0%
    if "progress_pct" in data:
        if c.progress_pct >= 100:
            c.learning_status = "Completed"
        elif c.progress_pct > 0 and c.learning_status == "Not Started":
            c.learning_status = "In Progress"

    db.commit()
    db.refresh(c)
    return FinanceConceptResponse(
        id=c.id,
        category_id=c.category_id,
        category_name=c.category.name if c.category else "",
        name=c.name,
        short_description=c.short_description,
        content=c.content,
        learning_status=c.learning_status,
        progress_pct=c.progress_pct,
        last_stopping_point=c.last_stopping_point,
        next_action=c.next_action,
        personal_notes=c.personal_notes,
        resources=[LearningResourceResponse.model_validate(r) for r in c.resources],
        has_quiz=c.quiz is not None,
        created_at=c.created_at,
        updated_at=c.updated_at
    )

# --- Resources ---
@router.post("/resources", response_model=LearningResourceResponse)
def add_resource(res_in: LearningResourceCreate, db: Session = Depends(get_db)):
    c = db.query(FinanceConcept).filter(FinanceConcept.id == res_in.concept_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    res = LearningResource(**res_in.model_dump())
    db.add(res)
    db.commit()
    db.refresh(res)
    return res

@router.put("/resources/{resource_id}", response_model=LearningResourceResponse)
def update_resource(resource_id: int, res_update: LearningResourceUpdate, db: Session = Depends(get_db)):
    res = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    for key, val in res_update.model_dump(exclude_unset=True).items():
        setattr(res, key, val)
    
    db.commit()
    db.refresh(res)
    return res

@router.delete("/resources/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    res = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(res)
    db.commit()
    return {"status": "success", "message": "Resource deleted"}

# --- Quizzes ---
@router.get("/concepts/{concept_id}/quiz", response_model=QuizResponse)
def get_concept_quiz(concept_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.concept_id == concept_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No quiz available for this concept yet")
    return quiz

@router.post("/concepts/{concept_id}/quiz/submit", response_model=QuizSubmitResponse)
def submit_quiz_answers(concept_id: int, req: QuizSubmitRequest, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.concept_id == concept_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = quiz.questions
    total_q = len(questions)
    if total_q == 0:
        return QuizSubmitResponse(score=0, total_questions=0, percentage=0.0, results=[])

    score = 0
    detailed_results = []
    for q in questions:
        user_choice = req.answers.get(q.id, "").upper().strip()
        is_correct = (user_choice == q.correct_option.upper())
        if is_correct:
            score += 1
        detailed_results.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "user_choice": user_choice,
            "correct_option": q.correct_option,
            "is_correct": is_correct,
            "explanation": q.explanation
        })
    
    pct = round((score / total_q) * 100, 1)
    attempt = QuizAttempt(quiz_id=quiz.id, score=score, total_questions=total_q, percentage=pct)
    db.add(attempt)

    # If score is >75%, update concept progress
    concept = quiz.concept
    if concept and pct >= 75.0 and concept.progress_pct < 100:
        concept.progress_pct = max(concept.progress_pct, 100)
        concept.learning_status = "Completed"

    db.commit()
    return QuizSubmitResponse(score=score, total_questions=total_q, percentage=pct, results=detailed_results)

# --- Case Studies ---
@router.get("/case-studies", response_model=List[CaseStudyResponse])
def get_case_studies(
    sector: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CaseStudy)
    if sector and sector != "All":
        query = query.filter(CaseStudy.sector == sector)
    if search:
        query = query.filter(CaseStudy.company_name.ilike(f"%{search}%") | CaseStudy.ticker.ilike(f"%{search}%"))
    
    return query.order_by(CaseStudy.updated_at.desc()).all()

@router.get("/case-studies/{case_id}", response_model=CaseStudyResponse)
def get_case_study(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case study not found")
    return case

@router.post("/case-studies", response_model=CaseStudyResponse)
def create_case_study(case_in: CaseStudyCreate, db: Session = Depends(get_db)):
    case = CaseStudy(**case_in.model_dump())
    db.add(case)
    db.commit()
    db.refresh(case)
    return case

@router.put("/case-studies/{case_id}", response_model=CaseStudyResponse)
def update_case_study(case_id: int, update_in: CaseStudyUpdate, db: Session = Depends(get_db)):
    case = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case study not found")
    
    for key, val in update_in.model_dump(exclude_unset=True).items():
        setattr(case, key, val)
    
    db.commit()
    db.refresh(case)
    return case

@router.delete("/case-studies/{case_id}")
def delete_case_study(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case study not found")
    db.delete(case)
    db.commit()
    return {"status": "success", "message": "Case study deleted"}
