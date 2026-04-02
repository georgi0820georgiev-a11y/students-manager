# Plan: Refactor & Enhance Quiz Feature

## TL;DR
Refactor the quiz to separate concerns (extract state machine from QuizPage into a dedicated Quiz orchestrator component), reduce CSS complexity by replacing inherited legacy styles with quiz-specific classes, extract magic numbers into constants, and add visual enhancements like showing the correct answer on wrong picks, a review-answers screen, and question shuffling.

---

## Phase 1 — Structural Refactoring (readability & modularity)

### Step 1: Extract quiz orchestrator component
- Move all state and logic from `QuizPage.jsx` into a new `src/components/Quiz/Quiz.jsx` component (mirrors the Chatbot pattern: `ChatbotPage.jsx` → `Chatbot.jsx`)
- `QuizPage.jsx` becomes a thin wrapper: `<div className="chatbot-page"><Quiz /></div>`
- **Files**: create `src/components/Quiz/Quiz.jsx`, simplify `src/pages/QuizPage.jsx`

### Step 2: Extract animation constants
- Create `src/components/Quiz/quizConstants.js` exporting: `FEEDBACK_DELAY` (600), `SLIDE_DURATION` (0.35), `SLIDE_OFFSET` (60), `SCORE_ANIM_DURATION` (1.5)
- Replace magic numbers in `Quiz.jsx` and `QuizResults.jsx` with these imports
- **Files**: create `src/components/Quiz/quizConstants.js`, update `Quiz.jsx`, `QuizResults.jsx`

### Step 3: Extract custom hook `useQuiz`
- Move state machine logic (state declarations, `handleAnswerClick`, `handleRestart`, GSAP animation effects, timer management) into `src/components/Quiz/useQuiz.js`
- `Quiz.jsx` becomes a pure rendering component that calls `useQuiz(quizQuestions)` and renders `QuizProgress`, `QuizQuestion`, `QuizResults` based on returned state
- This separates presentation from behavior
- **Files**: create `src/components/Quiz/useQuiz.js`, update `Quiz.jsx`

### Step 4: Simplify QuizQuestion class logic
- Replace the `getAnswerClass` callback with a simpler inline expression or a pure utility function in `quizConstants.js`
- The current `useCallback` with `[selectedAnswer, feedbackState]` dependencies is more complex than needed for a class-name lookup
- **Files**: update `QuizQuestion.jsx`

---

## Phase 2 — CSS Cleanup (reduce complexity & fragility)

### Step 5: Replace inherited legacy class names with quiz-specific classes (*parallel with Step 6*)
- In `QuizQuestion.jsx`, replace `question-item-onlyText` → `quiz-option`, `only-text-content` → `quiz-option__content`, `only-text-content-wrap` → `quiz-option__text`, `question-item-txt` → `quiz-option__label`, `section-test-layout-answer` → `quiz-options-grid`, `container` → `quiz-option__inner`
- This eliminates dependency on ~100 lines of legacy `.question-item-*` / `.only-text-content` styles and the 50+ lines of `.soge-young-chatbot` overrides (lines 11892–11970)
- **Files**: update `QuizQuestion.jsx`, `src/index.css`

### Step 6: Write self-contained quiz CSS block (*parallel with Step 5*)
- Add a clean `/* Quiz Feature */` section in `index.css` with quiz-namespaced classes (`quiz-option`, `quiz-option__content`, etc.)
- Use CSS Grid for the options layout (replacing flexbox + negative margins + 5 breakpoint overrides with `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`)
- Include hover, correct, incorrect, and locked states directly — no override chains
- Remove the old overrides block (lines 11892–11970) once the new classes are in place
- **Files**: update `src/index.css`

### Step 7: Consolidate results section CSS
- Replace usage of `.soge-result-card` and `.test-result-section` in `QuizResults.jsx` with quiz-specific classes (`quiz-results`, `quiz-results__card`)
- Add clean styles for the results card in the same quiz CSS block
- **Files**: update `QuizResults.jsx`, `src/index.css`

---

## Phase 3 — Visual Enhancements

### Step 8: Show correct answer on wrong pick (*depends on Step 5*)
- When user picks wrong, highlight selected in red AND highlight the correct option in green
- Pass `correctAnswerId` (from `question.correctAnswer`) to `QuizQuestion`; update `getAnswerClass` logic to also apply `quiz-option--correct-reveal` to the correct option when `feedbackState === 'incorrect'`
- **Files**: update `QuizQuestion.jsx`, `Quiz.jsx` (pass prop), `src/index.css` (add `.quiz-option--correct-reveal` style)

### Step 9: Add question shuffle option (*parallel with Step 8*)
- Add a Fisher-Yates shuffle utility in `quizConstants.js`
- In `useQuiz`, shuffle the questions array on mount (or on restart) using a stable copy
- This improves replayability — users don't memorize answer positions
- **Files**: update `quizConstants.js`, `useQuiz.js`

### Step 10: Add review-answers screen before results (*depends on Steps 3, 8*)
- Create `src/components/Quiz/QuizReview.jsx` — shows a scrollable summary of all questions with the user's answer (colored correct/incorrect) and the correct answer
- In `useQuiz`, add a `reviewMode` state between answering last question and showing final score
- User clicks "Виж резултата" to proceed to `QuizResults`
- **Files**: create `src/components/Quiz/QuizReview.jsx`, update `useQuiz.js`, `Quiz.jsx`, `src/index.css`

### Step 11: Improve progress bar visualization
- Replace the thin 6px bar with a segmented progress indicator showing dots/ticks per question, filled based on correct/incorrect (green dot = correct, red = incorrect, gray = upcoming)
- Alternatively: keep the bar but add a fraction badge showing score-so-far (e.g., "3/5 correct")
- **Files**: update `QuizProgress.jsx`, `src/index.css`

---

## Relevant Files

- `src/pages/QuizPage.jsx` — simplify to thin wrapper (like ChatbotPage)
- `src/components/Quiz/QuizProgress.jsx` — enhance progress visualization
- `src/components/Quiz/QuizQuestion.jsx` — rename CSS classes, add correct-answer reveal
- `src/components/Quiz/QuizResults.jsx` — use quiz-specific CSS classes, import constants
- `src/data/quizQuestions.js` — no changes needed
- `src/index.css` — replace legacy overrides with clean quiz CSS block
- **New files**: `src/components/Quiz/Quiz.jsx`, `src/components/Quiz/useQuiz.js`, `src/components/Quiz/quizConstants.js`, `src/components/Quiz/QuizReview.jsx`

---

## Verification

1. `npm run lint` — no ESLint errors after all changes
2. `npm run build` — production build succeeds
3. Manual: navigate to `/quiz`, answer all 24 questions — verify slide animations, feedback colors (correct=teal, incorrect=red with correct revealed), progress bar updates, locked state during animation
4. Manual: complete quiz — verify review screen shows all answers, then results screen shows animated score with correct tier color and message
5. Manual: click "Започни отначало" — verify full reset, questions are reshuffled
6. Manual: test responsive behavior at 375px, 768px, 1024px, 1440px — verify grid layout adapts without overflow
7. Manual: keyboard-only navigation — Tab through options, Enter/Space to select, verify focus indicators
8. Browser DevTools: confirm no legacy `.question-item-*` or `.only-text-content` classes remain in quiz DOM
9. Browser DevTools: confirm no unused `.soge-young-chatbot .question-item-*` override rules remain in CSS

---

## Decisions
- **Architecture pattern**: Follow the existing Chatbot convention — page component is a thin wrapper, orchestrator lives in `components/Quiz/`
- **CSS approach**: Per project convention, all styles stay in single `index.css` but use quiz-namespaced classes (`quiz-*`) to avoid inheritance issues
- **No TypeScript**: Per project rules, all files are `.jsx` / `.js`
- **No test framework**: Verification is manual per project convention
- **Scope boundary**: This plan covers only the quiz feature; chatbot and other features are untouched. Legacy CSS classes used by other pages remain intact — we only stop using them in quiz components.

## Further Considerations
1. **Question data format**: Currently `quizQuestions.js` exports a JS array. Could migrate to `quizQuestions.json` for consistency with `questions.json` (chatbot). Recommended: keep as `.js` since it's already working and the chatbot JSON pattern adds no benefit here.
2. **Quiz results persistence**: The chatbot submits answers to the API, but the quiz does not. Adding API persistence is out of scope for this refactor but would be a natural follow-up.
3. **Review screen scope**: The review screen (Step 10) adds a new component and state. If this feels too large, it can be deferred to a follow-up — the rest of the plan is independently valuable without it.
