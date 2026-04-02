import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { FEEDBACK_DELAY, SLIDE_DURATION, SLIDE_OFFSET, shuffleArray } from './quizConstants';

export function useQuiz(questions) {
    const [shuffledQuestions] = useState(() => shuffleArray(questions));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [score, setScore] = useState(0);
    const [feedbackState, setFeedbackState] = useState(null);

    const questionCardRef = useRef(null);
    const feedbackTimerRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        const card = questionCardRef.current;
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            if (card) gsap.killTweensOf(card);
        };
    }, []);

    // Animate card in whenever currentQuestionIndex changes
    useEffect(() => {
        if (!questionCardRef.current) return;
        gsap.fromTo(
            questionCardRef.current,
            { x: SLIDE_OFFSET, autoAlpha: 0 },
            {
                x: 0,
                autoAlpha: 1,
                duration: SLIDE_DURATION,
                ease: 'power2.out',
                onComplete: () => setIsAnimating(false),
            }
        );
    }, [currentQuestionIndex]);

    const handleAnswerClick = useCallback((optionId) => {
        if (isAnimating) return;

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === optionId;
        const nextAnswers = [
            ...answers,
            {
                questionId: currentQuestion.id,
                question: currentQuestion.question,
                selectedId: optionId,
                correctId: currentQuestion.correctAnswer,
                options: currentQuestion.options,
                isCorrect,
            },
        ];

        setAnswers(nextAnswers);
        setFeedbackState(isCorrect ? 'correct' : 'incorrect');
        setIsAnimating(true);

        feedbackTimerRef.current = setTimeout(() => {
            if (!questionCardRef.current) return;
            gsap.to(questionCardRef.current, {
                x: -SLIDE_OFFSET,
                autoAlpha: 0,
                duration: SLIDE_DURATION,
                ease: 'power2.in',
                onComplete: () => {
                    const nextIndex = currentQuestionIndex + 1;
                    if (nextIndex >= shuffledQuestions.length) {
                        const correctCount = nextAnswers.filter((a) => a.isCorrect).length;
                        setScore(Math.round((correctCount / shuffledQuestions.length) * 100));
                        setReviewMode(true);
                        setIsAnimating(false);
                    } else {
                        if (questionCardRef.current) {
                            gsap.set(questionCardRef.current, { x: SLIDE_OFFSET, autoAlpha: 0 });
                        }
                        setFeedbackState(null);
                        setCurrentQuestionIndex(nextIndex);
                    }
                },
            });
        }, FEEDBACK_DELAY);
    }, [isAnimating, currentQuestionIndex, answers, shuffledQuestions]);

    const handleShowResults = useCallback(() => {
        setReviewMode(false);
        setQuizCompleted(true);
    }, []);

    const handleRestart = useCallback(() => {
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        if (questionCardRef.current) gsap.killTweensOf(questionCardRef.current);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setIsAnimating(false);
        setQuizCompleted(false);
        setReviewMode(false);
        setScore(0);
        setFeedbackState(null);
        // Note: shuffledQuestions keeps its initial shuffle; to re-shuffle on restart
        // we would need to lift it out of useState. Current behavior: same order on replay.
        // Acceptable per plan scope.
    }, []);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const selectedAnswer = answers.length > currentQuestionIndex
        ? answers[currentQuestionIndex].selectedId
        : null;

    return {
        shuffledQuestions,
        currentQuestionIndex,
        currentQuestion,
        selectedAnswer,
        answers,
        isAnimating,
        quizCompleted,
        reviewMode,
        score,
        feedbackState,
        questionCardRef,
        handleAnswerClick,
        handleShowResults,
        handleRestart,
    };
}
