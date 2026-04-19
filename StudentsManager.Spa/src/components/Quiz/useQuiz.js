import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { createEvent, getUserEvents } from '../../services/eventsService';
import {
    FEEDBACK_DELAY,
    SLIDE_DURATION,
    SLIDE_OFFSET,
    QUIZ_QUESTION_COUNT,
    calculateQuizResult,
    shuffleArray,
} from './quizConstants';

const QUIZ_EVENT_TYPES = {
    start: 'quiz-start',
    answer: 'quiz-answer',
    result: 'quiz-result',
};

function createAttemptId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getGuestQuizUserId() {
    const storageKey = 'quizGuestUserId';
    const existingId = localStorage.getItem(storageKey);
    if (existingId) return existingId;

    const nextId = `quiz-guest-${createAttemptId()}`;
    localStorage.setItem(storageKey, nextId);
    return nextId;
}

function parseEventData(event) {
    if (!event?.data) return {};
    if (typeof event.data !== 'string') return event.data;

    try {
        return JSON.parse(event.data);
    } catch {
        return {};
    }
}

function getEventDate(event, data) {
    return event?.datetimeUtc || event?.datetimeUTC || event?.createdAt || data?.finishedAt || data?.startedAt;
}

function createQuestionSet(questions) {
    return shuffleArray(questions).slice(0, Math.min(QUIZ_QUESTION_COUNT, questions.length));
}

export function useQuiz(questions) {
    const { userId } = useAuth();
    const [guestUserId] = useState(getGuestQuizUserId);
    const participantId = userId || guestUserId;
    const [attemptId, setAttemptId] = useState(createAttemptId);
    const [quizStarted, setQuizStarted] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState(() => createQuestionSet(questions));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [scoreDetails, setScoreDetails] = useState(() => calculateQuizResult([], shuffledQuestions.length));
    const [feedbackState, setFeedbackState] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');

    const questionCardRef = useRef(null);
    const feedbackTimerRef = useRef(null);

    const logQuizEvent = useCallback(async (type, data = {}) => {
        if (!participantId) return;

        try {
            await createEvent({
                userId: participantId,
                type,
                data: {
                    attemptId,
                    source: 'StudentsManager.Spa',
                    ...data,
                },
            });
        } catch (err) {
            console.error('Quiz event logging failed:', err);
        }
    }, [attemptId, participantId]);

    const loadHistory = useCallback(async () => {
        if (!participantId) return;

        setHistoryLoading(true);
        setHistoryError('');

        try {
            const events = await getUserEvents(participantId);
            const quizResults = events
                .filter((event) => event.type === QUIZ_EVENT_TYPES.result || event.type === 'quiz')
                .map((event) => {
                    const data = parseEventData(event);
                    return {
                        id: event.id || `${data.attemptId}-${getEventDate(event, data)}`,
                        date: getEventDate(event, data),
                        correctCount: data.correctCount ?? data.correct ?? 0,
                        totalQuestions: data.totalQuestions ?? 0,
                        percentage: data.percentage ?? data.score ?? 0,
                        points: data.points ?? 0,
                        passed: Boolean(data.passed),
                    };
                })
                .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
                .slice(0, 5);

            setHistory(quizResults);
        } catch (err) {
            console.error('Quiz history loading failed:', err);
            setHistoryError('Историята не може да бъде заредена в момента.');
        } finally {
            setHistoryLoading(false);
        }
    }, [participantId]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    useEffect(() => {
        const card = questionCardRef.current;
        return () => {
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            if (card) gsap.killTweensOf(card);
        };
    }, []);

    useEffect(() => {
        if (!quizStarted || !questionCardRef.current) return;

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
    }, [currentQuestionIndex, quizStarted]);

    const handleStart = useCallback(() => {
        setQuizStarted(true);
        logQuizEvent(QUIZ_EVENT_TYPES.start, {
            startedAt: new Date().toISOString(),
            questionIds: shuffledQuestions.map((question) => question.id),
            totalQuestions: shuffledQuestions.length,
        });
    }, [logQuizEvent, shuffledQuestions]);

    const handleAnswerClick = useCallback((optionId) => {
        if (isAnimating) return;

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const selectedOption = currentQuestion.options.find((option) => option.id === optionId);
        const correctOption = currentQuestion.options.find((option) => option.id === currentQuestion.correctAnswer);
        const isCorrect = currentQuestion.correctAnswer === optionId;
        const nextAnswers = [
            ...answers,
            {
                questionId: currentQuestion.id,
                question: currentQuestion.question,
                selectedId: optionId,
                selectedText: selectedOption?.text || '',
                correctId: currentQuestion.correctAnswer,
                correctText: correctOption?.text || '',
                options: currentQuestion.options,
                isCorrect,
            },
        ];

        setAnswers(nextAnswers);
        setFeedbackState(isCorrect ? 'correct' : 'incorrect');
        setIsAnimating(true);
        logQuizEvent(QUIZ_EVENT_TYPES.answer, {
            questionId: currentQuestion.id,
            selectedId: optionId,
            selectedText: selectedOption?.text || '',
            correctId: currentQuestion.correctAnswer,
            isCorrect,
            answeredAt: new Date().toISOString(),
            questionNumber: currentQuestionIndex + 1,
        });

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
                        const result = calculateQuizResult(nextAnswers, shuffledQuestions.length);
                        setScoreDetails(result);
                        setReviewMode(true);
                        setIsAnimating(false);
                        logQuizEvent(QUIZ_EVENT_TYPES.result, {
                            ...result,
                            totalQuestions: shuffledQuestions.length,
                            answers: nextAnswers.map((answer) => ({
                                questionId: answer.questionId,
                                selectedId: answer.selectedId,
                                correctId: answer.correctId,
                                isCorrect: answer.isCorrect,
                            })),
                            finishedAt: new Date().toISOString(),
                        }).then(loadHistory);
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
    }, [answers, currentQuestionIndex, isAnimating, loadHistory, logQuizEvent, shuffledQuestions]);

    const handleShowResults = useCallback(() => {
        setReviewMode(false);
        setQuizCompleted(true);
    }, []);

    const handleShowReview = useCallback(() => {
        setQuizCompleted(false);
        setReviewMode(true);
    }, []);

    const handleRestart = useCallback(() => {
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        if (questionCardRef.current) gsap.killTweensOf(questionCardRef.current);

        const nextQuestions = createQuestionSet(questions);
        setAttemptId(createAttemptId());
        setShuffledQuestions(nextQuestions);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setIsAnimating(false);
        setQuizCompleted(false);
        setReviewMode(false);
        setQuizStarted(false);
        setScoreDetails(calculateQuizResult([], nextQuestions.length));
        setFeedbackState(null);
    }, [questions]);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const selectedAnswer = answers.length > currentQuestionIndex
        ? answers[currentQuestionIndex].selectedId
        : null;

    return {
        participantId,
        quizStarted,
        shuffledQuestions,
        currentQuestionIndex,
        currentQuestion,
        selectedAnswer,
        answers,
        isAnimating,
        quizCompleted,
        reviewMode,
        scoreDetails,
        feedbackState,
        history,
        historyLoading,
        historyError,
        questionCardRef,
        handleStart,
        handleAnswerClick,
        handleShowResults,
        handleShowReview,
        handleRestart,
    };
}
