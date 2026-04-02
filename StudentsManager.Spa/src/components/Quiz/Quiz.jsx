import { quizQuestions } from '../../data/quizQuestions';
import { useQuiz } from './useQuiz';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizReview from './QuizReview';

function Quiz() {
    const {
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
    } = useQuiz(quizQuestions);

    if (quizCompleted) {
        return (
            <QuizResults
                score={score}
                totalQuestions={shuffledQuestions.length}
                onRestart={handleRestart}
            />
        );
    }

    if (reviewMode) {
        return (
            <QuizReview
                answers={answers}
                onShowResults={handleShowResults}
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
