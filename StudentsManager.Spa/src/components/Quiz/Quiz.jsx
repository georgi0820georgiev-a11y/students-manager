import { quizQuestions } from '../../data/quizQuestions';
import { useQuiz } from './useQuiz';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizReview from './QuizReview';
import QuizStart from './QuizStart';

function Quiz() {
    const {
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
    } = useQuiz(quizQuestions);

    if (!quizStarted) {
        return (
            <QuizStart
                totalQuestions={shuffledQuestions.length}
                onStart={handleStart}
                history={history}
                historyLoading={historyLoading}
                historyError={historyError}
            />
        );
    }

    if (quizCompleted) {
        return (
            <QuizResults
                scoreDetails={scoreDetails}
                totalQuestions={shuffledQuestions.length}
                answers={answers}
                onReview={handleShowReview}
                onRestart={handleRestart}
            />
        );
    }

    if (reviewMode) {
        return (
            <QuizReview
                answers={answers}
                onShowResults={handleShowResults}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="soge-young-chatbot" ref={questionCardRef}>
            <QuizProgress
                currentIndex={currentQuestionIndex}
                totalQuestions={shuffledQuestions.length}
                answers={answers}
            />
            <QuizQuestion
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerClick={handleAnswerClick}
                feedbackState={feedbackState}
                isAnimating={isAnimating}
            />
        </div>
    );
}

export default Quiz;
