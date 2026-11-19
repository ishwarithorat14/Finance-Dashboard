import React, { useState } from "react";
import { X, CheckCircle2, XCircle, Award, AlertCircle, ArrowRight } from "lucide-react";

export default function QuizModal({
  isOpen,
  onClose,
  quiz,
  conceptName,
  onSubmitQuiz,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !quiz) return null;

  const handleOptionSelect = (questionId, optionKey) => {
    if (results) return; // locked after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await onSubmitQuiz(quiz.concept_id, selectedAnswers);
      setResults(res);
    } catch (err) {
      alert("Failed to submit quiz: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#fbbf24]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F3F5F5]">
                {quiz.title}
              </h3>
              <p className="text-xs text-[#9EADB8]">{conceptName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9EADB8] hover:text-[#F3F5F5] p-1 rounded-md hover:bg-[#243447] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Results Banner if Submitted */}
          {results && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                results.percentage >= 75
                  ? "bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]"
                  : "bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]"
              }`}
            >
              <div>
                <span className="text-sm font-bold block">
                  {results.percentage >= 75
                    ? "Concept Mastery Verified!"
                    : "Review Needed"}
                </span>
                <span className="text-xs text-[#9EADB8]">
                  Score: {results.score} / {results.total_questions} ({results.percentage}%)
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-[#243447] text-xs font-medium text-[#F3F5F5] border border-[#2D3E52] hover:bg-[#2b3e55]"
              >
                Retake Quiz
              </button>
            </div>
          )}

          {/* Questions */}
          {quiz.questions.map((q, idx) => {
            const resultForQ = results?.results?.find(
              (r) => r.question_id === q.id
            );
            const userChoice = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-4 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#F3F5F5]">
                    Q{idx + 1}. {q.question_text}
                  </span>
                  {resultForQ && (
                    <span className="shrink-0 ml-2">
                      {resultForQ.is_correct ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444]" />
                      )}
                    </span>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {["A", "B", "C", "D"].map((optKey) => {
                    const optText = q[`option_${optKey.toLowerCase()}`];
                    const isSelected = userChoice === optKey;
                    const isCorrect = q.correct_option === optKey;

                    let optStyle =
                      "border-[#2D3E52] bg-[#1B2735] hover:border-[#384E66] text-[#F3F5F5]";
                    if (results) {
                      if (isCorrect) {
                        optStyle =
                          "border-[#10B981] bg-[#10B981]/10 text-[#10B981] font-semibold";
                      } else if (isSelected && !resultForQ?.is_correct) {
                        optStyle =
                          "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]";
                      }
                    } else if (isSelected) {
                      optStyle =
                        "border-[#38bdf8] bg-[#38bdf8]/10 text-[#F3F5F5]";
                    }

                    return (
                      <button
                        key={optKey}
                        onClick={() => handleOptionSelect(q.id, optKey)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center space-x-3 transition-colors ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-[#243447] border border-[#2D3E52] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">
                          {optKey}
                        </span>
                        <span className="flex-1">{optText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Reveal */}
                {results && (
                  <div className="mt-3 p-3 rounded-lg bg-[#1B2735] border border-[#2D3E52] text-xs space-y-1">
                    <span className="font-semibold text-[#38bdf8] block text-[11px] uppercase tracking-wider">
                      Explanation:
                    </span>
                    <p className="text-[#9EADB8] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#243447]/60 border-t border-[#2D3E52] flex items-center justify-between">
          <span className="text-xs text-[#9EADB8]">
            {Object.keys(selectedAnswers).length} of {quiz.questions.length} answered
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#9EADB8] hover:text-[#F3F5F5] transition-colors"
            >
              Close
            </button>
            {!results && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-xs font-medium text-[#F3F5F5] transition-colors disabled:opacity-50"
              >
                {submitting ? "Validating..." : "Submit Answers"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
