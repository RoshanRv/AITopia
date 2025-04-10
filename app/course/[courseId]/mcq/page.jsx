"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { generateMCQ, generateMCQFeedback } from "@/services/GlobalServices";
import { getCourseNotes } from "@/services/api";

export default function MCQPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  // 1. Generate MCQs from notes if none exist
  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const notesData = await getCourseNotes(courseId);
        const notes = notesData.notes;
        const mcqData = await generateMCQ({ notes });
        setMcqs(mcqData.mcqs);
      } catch (error) {
        console.error("Error generating MCQs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mcqs.length === 0) {
      generate();
    }
  }, [courseId]);

  // 2. Handle selecting an option
  const handleOptionClick = (option) => {
    if (selectedOption !== null) return; // Only allow selection once
    setSelectedOption(option);
    const currentMCQ = mcqs[currentIndex];
    setUserResponses((prev) => [
      ...prev,
      {
        question: currentMCQ.question,
        selectedOption: option,
        correctAnswer: currentMCQ.answer,
      },
    ]);
  };

  // 3. Navigation logic
  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setSelectedOption(null);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 4. Calculate and show final score & feedback
  const calculateScore = () => {
    return userResponses.filter(
      (res) => res.selectedOption === res.correctAnswer
    ).length;
  };

  const handleFinish = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    try {
      const feedbackText = await generateMCQFeedback({ responses: userResponses });
      setFeedback(feedbackText);
    } catch (error) {
      console.error("Feedback generation failed:", error);
    }
  };

  // 5. Loading & MCQ checks
  if (loading) {
    return <p className="text-lg text-center text-gray-600">Generating MCQs...</p>;
  }
  if (!loading && mcqs.length === 0) {
    return <p className="text-lg text-center text-gray-600">No MCQs available.</p>;
  }

  const currentMCQ = mcqs[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center space-y-6">
      {/* Back to Course */}
      <div className="self-start ml-4">
        <Button onClick={() => router.push(`/course/${courseId}`)}>Back to Course</Button>
      </div>

      <h1 className="text-4xl font-bold text-center text-gray-900">MCQ Test</h1>

      {/* MCQ Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <p className="text-xl font-semibold mb-4">{currentMCQ.question}</p>
        <div className="space-y-4">
          {currentMCQ.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = currentMCQ.answer === option;
            let optionClass = "border border-gray-300 rounded p-2 cursor-pointer";

            // If user has selected, color correct/incorrect
            if (selectedOption !== null) {
              if (isCorrect) {
                optionClass += " bg-green-200";
              }
              if (isSelected && !isCorrect) {
                optionClass += " bg-red-200";
              }
            }

            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentIndex > 0 && (
          <Button onClick={handlePrev} className="px-6">
            Previous
          </Button>
        )}
        {currentIndex < mcqs.length - 1 && (
          <Button onClick={handleNext} className="px-6" disabled={selectedOption === null}>
            Next
          </Button>
        )}
        {currentIndex === mcqs.length - 1 && selectedOption !== null && (
          <Button onClick={handleFinish} className="px-6">
            Finish
          </Button>
        )}
      </div>

      {/* Score + Feedback */}
      {score !== null && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow w-full max-w-md text-center">
          <p className="text-xl font-bold">
            Score: {score} / {mcqs.length}
          </p>

          {/* Markdown Feedback */}
          {feedback && (
            <div className="mt-4 text-left prose prose-sm text-gray-700">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 text-center mt-2">
          Question {currentIndex + 1} of {mcqs.length}
        </p>
      </div>
    </div>
  );
}
