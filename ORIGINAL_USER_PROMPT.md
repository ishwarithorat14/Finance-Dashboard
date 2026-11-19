# ORIGINAL USER PROMPT
**Project Name**: FINANCE HQ  
**Date Submitted**: November 19, 2026  
**Folder Target**: `C:\Users\Admin\Desktop\Ishwari\Personal Dashboard`  
**Reference Image Present in Folder**: `Dark Finance HQ Dashboard.png`

---

```markdown
# PROJECT: FINANCE HQ
## Personal Finance Learning & Market Intelligence Dashboard

Act as a senior full-stack developer, UI/UX designer, and software architect. Build a complete, functional web application called **FINANCE HQ**.

This application is a personal finance learning and market intelligence workspace. Its purpose is to help me learn finance, understand financial markets, practise trading through simulation, analyse businesses, track progress, and maintain a record of my observations.

I have attached a visual reference image. Use it as the primary design reference. Reproduce its visual language, layout, spacing, colour palette, and interaction behaviour as closely as possible.

Do not create a generic admin dashboard. This should feel like a sophisticated personal financial research terminal.

---

# 1. TECHNOLOGY STACK

Use the following technologies:

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React icons
- TradingView Lightweight Charts for financial charts

### Backend
- Python
- FastAPI
- REST APIs

### Database
- SQLite initially
- SQLAlchemy ORM

Keep the architecture modular so the database can eventually be migrated to PostgreSQL.

### Development
- Build and test the application locally.
- Use environment variables for API keys.
- Maintain a clean project structure.
- Handle errors and loading states properly.

Do not introduce unnecessary frameworks or dependencies.

---

# 2. DESIGN SYSTEM

Follow the attached reference image.

### Colour palette

Use ONLY the following three primary colours for the core design:

- Primary background: #243447
- Secondary/accent: #9EADB8
- Primary text: #F3F5F5

Additional rules:
- Use subtle variations of the primary background for cards, borders and panels.
- Use green sparingly for positive market movements, completed tasks and successful performance.
- Use red sparingly for negative market movements.
- Avoid excessive gradients.
- Avoid bright neon colours.
- Maintain good text contrast.

### Visual style
- Dark mode by default.
- Minimalist and professional.
- Rounded cards with subtle borders.
- Clean typography.
- Consistent spacing.
- Smooth hover and transition effects.
- Responsive design.
- Desktop-first layout, with mobile compatibility.

The design must look polished and professional, not like a basic college project.

---

# 3. APPLICATION LAYOUT

## A. Sidebar Navigation

Create a collapsible sidebar.

Navigation items:

1. Home
2. Learn
3. Practice
4. Market Intelligence
5. Monthly Review
6. Settings

Requirements:
- Expanded sidebar displays icons and labels.
- Collapsed sidebar displays icons only.
- Include a menu toggle.
- Clicking a navigation item opens its respective workspace.
- Clearly highlight the currently selected section.
- Preserve the sidebar's state during navigation.

The sidebar should not permanently occupy unnecessary screen space when collapsed.

## B. Top Navigation Bar

Include:
- Dashboard search.
- Current date.
- Market status indicator.
- User/profile settings.

The date should update automatically.

Market status must not be hardcoded. If reliable market-hours information is unavailable, show an appropriate unknown or unavailable state.

## C. Home Dashboard

This is the default landing page.

It should display ONLY:

### Welcome section
- Greeting.
- Short motivational subtitle.
- Market status.

### Progress cards

Create four compact cards:

1. Learning Progress
2. Trading Practice
3. Market Analysis
4. Monthly Goal

Each card should show:
- Progress percentage or completion status.
- Progress indicator.
- Weekly progress where data is available.
- A clickable navigation action.

All progress must be calculated from actual stored user activity, not randomly generated percentages.

### Upcoming Tasks

Display this as a collapsed navigation panel.

Initially show ONLY:
- Icon.
- Section title.
- Short description.
- Expand/collapse arrow.

When clicked, reveal:
- Pending tasks.
- Completed tasks.
- Task category.
- Due date, if available.
- Ability to add, edit and complete tasks.

Hide the task details when collapsed.

### Market Snapshot

Display this as a collapsed navigation panel.

Initially show ONLY:
- Icon.
- Section title.
- Short description.
- Expand/collapse arrow.

When clicked, reveal:
- NIFTY 50.
- SENSEX.
- BANK NIFTY.
- Current values.
- Percentage change.
- Simple market charts, where data is available.

Do not fabricate live prices. Clearly distinguish live, delayed, cached and demonstration data.

### Quick Access

Display three compact cards:

1. Learn
2. Practice
3. Market Intelligence

Clicking each card should navigate to the respective workspace.

### Important interaction rule

The home screen must remain minimal.

Do not display the complete contents of every module simultaneously.

Use progressive disclosure:
- Show summaries initially.
- Reveal details only after a user clicks.
- Use dedicated workspace pages for detailed content.
- Allow users to return to Home easily.

The Upcoming Tasks and Market Snapshot panels must remain collapsed by default.

---

# 4. LEARN WORKSPACE

Create a dedicated finance learning environment.

Divide it into two main sections.

## A. Finance Concepts

Allow me to organise concepts into categories.

Examples:
- Financial Markets
- Technical Analysis
- Fundamental Analysis
- Economics
- Corporate Finance
- Banking and Financial Institutions

Each concept should have:

1. Concept name.
2. Short description.
3. Learning resources.
4. Personal notes.
5. Learning status.
6. Progress tracker.
7. Last stopping point.
8. Next action.
9. Quiz.

### Resource management
Allow me to:
- Add resource links.
- Add resource descriptions.
- Categorise resources.
- Mark resources as completed.
- Add notes.

### Progress tracking

Use these statuses:
- Not Started
- In Progress
- Completed

Allow manual progress updates.

Record the last stopping point and next action for each concept.

### Quiz

Create a simple quiz module.

Requirements:
- Multiple-choice questions.
- Answer validation.
- Score calculation.
- Explanation of correct answers.
- Quiz history.

Allow questions to be added and edited.

## B. Case Studies

Create a workspace for analysing companies and industries.

Each case study should support:

- Company name.
- Sector.
- Business model.
- Revenue sources.
- Competitive advantage.
- Financial performance.
- Growth opportunities.
- Risks.
- Personal observations.
- Research resources.
- Analysis date.

Allow me to create, edit, save and revisit case studies.

Include search and filtering by company and sector.

---

# 5. PRACTICE WORKSPACE

Create a simulated trading environment.

This is a paper-trading system, NOT a real brokerage platform.

## A. Market Workspace

Include:
- Stock search.
- Instrument information.
- Candlestick charts.
- Timeframe selection.
- Volume.
- Technical indicators.
- Watchlist.

Initially support:
- RSI
- Moving averages
- MACD

Charts should use TradingView Lightweight Charts.

Use a reliable market-data API when configured.

Keep market-data providers modular so they can be replaced later.

## B. Paper Trading

Implement a functional paper-trading simulator.

Features:
- Configurable virtual starting capital.
- Buy and sell simulated orders.
- Quantity selection.
- Entry price.
- Exit price.
- Open positions.
- Available virtual balance.
- Portfolio value.
- Realised and unrealised P&L.
- Transaction history.

All transactions must be stored in the database.

Do not execute real orders or connect to a brokerage account.

## C. Trading Journal

For every simulated trade, allow me to record:

- Instrument.
- Entry date.
- Entry price.
- Exit date.
- Exit price.
- Strategy used.
- Reason for entering.
- Reason for exiting.
- Stop-loss.
- Target.
- Result.
- Lessons learned.

Include a trade history table and basic performance statistics.

---

# 6. MARKET INTELLIGENCE WORKSPACE

Create a financial news and market research section.

Display news as a list of headlines.

Do not display complete news explanations on the initial screen.

When I click a headline, open its detailed view.

Each news item should contain:

1. Headline.
2. Source.
3. Publication date.
4. Short explanation.
5. What happened?
6. Who was affected?
7. Which companies or sectors are involved?
8. Potential market implications.
9. What should I monitor or investigate?
10. My personal observations.

Include:
- Search.
- Category filters.
- Sector filters.
- Save/bookmark functionality.
- Personal notes.

Use an external news API when configured.

Clearly display source attribution and publication dates.

Do not generate fake headlines or present AI-generated market interpretations as verified facts.

---

# 7. MONTHLY REVIEW

Create a dedicated monthly performance review workspace.

Display:

### Learning performance
- Concepts completed.
- Learning progress.
- Resources studied.

### Trading performance
- Number of simulated trades.
- Winning and losing trades.
- Total P&L.
- Strategy performance.

### Market analysis
- News analysed.
- Companies studied.
- Observations recorded.

### Goal tracking
- Monthly goals.
- Completed goals.
- Incomplete goals.
- Reasons for incomplete goals.

Allow me to add a reason whenever a goal is missed.

Generate a monthly summary using stored application data.

Do not invent performance statistics.

---

# 8. DAILY ACCOUNTABILITY

Create a simple daily check-in mechanism.

Whenever I open the dashboard, show my daily progress and pending tasks.

Allow me to:
- Set daily tasks.
- Mark tasks complete.
- Record incomplete tasks.
- Record why a task was not completed.
- Carry unfinished tasks forward.

Possible reasons:
- Lack of time.
- Unexpected interruption.
- Difficulty understanding the topic.
- Lack of focus.
- Other.

The monthly review should use this information to identify recurring patterns.

Keep the check-in simple and quick.

---

# 9. DATABASE DESIGN

Create appropriate database models for:

- Users / Settings
- Learning Categories
- Finance Concepts
- Learning Resources
- Learning Progress
- Quizzes
- Quiz Attempts
- Case Studies
- Companies
- Watchlists
- Paper Trading Orders
- Trading Positions
- Trading Journal
- Market News
- Market Observations
- Daily Tasks
- Monthly Goals
- Monthly Reviews

Use appropriate primary keys, foreign keys, timestamps and relationships.

Persist user-created information.

Data should remain available after refreshing or restarting the application.

---

# 10. FUNCTIONAL REQUIREMENTS

This must be a functional application, not just a collection of static UI screens.

Implement:

- Working navigation.
- Expandable and collapsible panels.
- Sidebar collapse/expand.
- Search and filtering.
- Add/edit/delete functionality.
- Database persistence.
- Progress calculations.
- Charts.
- Form validation.
- Loading states.
- Error handling.
- Responsive layouts.

Every visible button must perform its intended action.

Do not create decorative buttons that do nothing.

Avoid unnecessary confirmation popups for routine actions.

---

# 11. MARKET DATA AND API INTEGRATION

Design the application so external APIs can be integrated without rewriting the entire application.

Use environment variables for credentials.

Create a separate service layer for:
- Market data.
- Historical prices.
- Financial news.

If API credentials are unavailable:
- Provide a clearly labelled demonstration mode.
- Allow manual data entry where appropriate.
- Never present demonstration data as real-time data.

Do not hardcode API keys or credentials.

Document the required environment variables.

---

# 12. DEVELOPMENT INSTRUCTIONS

Follow these instructions carefully.

1. Inspect the existing project directory before creating files.
2. Establish the frontend and backend architecture.
3. Implement the shared design system first.
4. Build the home dashboard to match the reference image.
5. Implement navigation and interactions.
6. Connect the database.
7. Implement the learning workspace.
8. Implement the practice workspace.
9. Implement market intelligence.
10. Implement monthly reviews.
11. Test the complete application.

Work in manageable stages.

Do not generate the entire application in one uncontrolled operation.

Do not replace working code unnecessarily.

Do not leave placeholder functionality where a working implementation is required.

When a feature depends on an external API, clearly identify that dependency.

After each major implementation stage:
- Run the application.
- Check for errors.
- Test the relevant interactions.
- Fix issues before proceeding.

Create a README explaining:
- Project structure.
- Installation.
- Dependencies.
- How to run the frontend.
- How to run the backend.
- Database setup.
- API configuration.

---

# 13. IMPORTANT PRODUCT PRINCIPLES

The following principles must guide every development decision:

1. Minimalism over information overload.
2. Functionality over decoration.
3. Progressive disclosure over displaying everything.
4. User-controlled learning progress.
5. Accurate market information over fabricated data.
6. Persistent records over temporary UI state.
7. Understandable code over unnecessary complexity.

I am building this application not only to use it but also to understand how it works.

Therefore:
- Keep the code readable.
- Use meaningful variable and function names.
- Add comments to important business logic.
- Explain important architectural decisions.
- Do not hide the implementation behind unnecessary abstractions.

**FINAL EXPECTATION:**

Deliver a working, locally runnable FINANCE HQ web application that follows the attached design reference, uses the specified colour palette (#243447, #9EADB8, #F3F5F5), and implements the functionality described above.

Prioritise a polished, functional home dashboard and navigation system before expanding into the individual workspaces.

Do not compromise the visual design or the progressive-disclosure interaction model.
```
