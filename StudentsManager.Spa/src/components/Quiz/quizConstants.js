export const FEEDBACK_DELAY = 600;
export const SLIDE_DURATION = 0.35;
export const SLIDE_OFFSET = 60;
export const SCORE_ANIM_DURATION = 1.5;

/** Fisher-Yates shuffle — returns a new shuffled array, original is not mutated */
export function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
