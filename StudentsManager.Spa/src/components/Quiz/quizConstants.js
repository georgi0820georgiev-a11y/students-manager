export const FEEDBACK_DELAY = 600;
export const SLIDE_DURATION = 0.35;
export const SLIDE_OFFSET = 60;
export const SCORE_ANIM_DURATION = 1.5;
export const QUIZ_QUESTION_COUNT = 4;
export const QUIZ_PASS_CORRECT_COUNT = 4;
export const QUIZ_HALF_POINT_CORRECT_COUNT = 2;

export function calculateQuizResult(answers, totalQuestions) {
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const percentage = totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const points = correctCount >= QUIZ_PASS_CORRECT_COUNT
        ? 1
        : correctCount >= QUIZ_HALF_POINT_CORRECT_COUNT
            ? 0.5
            : 0;

    return {
        correctCount,
        percentage,
        points,
        passed: points === 1,
    };
}

/** Fisher-Yates shuffle — returns a new shuffled array, original is not mutated */
export function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
