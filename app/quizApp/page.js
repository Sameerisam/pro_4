"use client";

import "./quizz.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctArray, setCorrectArray] = useState([]);
  const [submittedArray, setSubmittedArray] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://quizapi.io/api/v1/questions?apiKey=LfJvbMXYyjYfW5o9zxTalsoC0f08eoMMeWvs4RNI&limit=10&tags=JavaScript"
      )
      .then((resp) => {
        setQuestions(resp.data);
        setSubmittedArray(Array(resp.data.length).fill(false));
        setCorrectArray(Array(resp.data.length).fill(false));
      })
      .catch((e) => {
        console.log("failed to load questions", e);
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const correct = questions[currentIndex].correct_answers;
    const correctKey = `${selectedOption}_correct`;

    const newSubmitted = [...submittedArray];
    newSubmitted[currentIndex] = true;
    setSubmittedArray(newSubmitted);

    if (correct[correctKey] === "true") {
      setIsCorrect(true);
      setScore((prev) => prev + 1);

      const newCorrectArray = [...correctArray];
      newCorrectArray[currentIndex] = true;
      setCorrectArray(newCorrectArray);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption("");
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption("");
      setIsCorrect(null);
    }
  };

  const reTry=()=>{

    
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
    setIsCorrect(null);
   setSelectedOption("");
   
   setCorrectArray(Array(questions.length).fill(false));
   setSubmittedArray(Array(questions.length).fill(false));
  };
  return (
    <div
      style={{
        backgroundImage: "url('/question-mark-background-1909040_1920.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <div className="container bg-white p-4 rounded shadow">
        <h1 className="text-center mb-4">My Quiz</h1>
        <h4>Score: {score}</h4>

        {showResult ? (
          <div className="mt-4">
            <h2> You've completed the quiz!</h2>
            <p>
              Your final score: {score} / {questions.length}
            </p>
            <button className="btn btn-success mb-3" onClick={reTry}>Try again</button>
          </div>
        ) : (
          questions.length > 0 && (
            <>
              <h5 className="mb-3">
                Q{currentIndex + 1}: {questions[currentIndex]?.question}
              </h5>

              <ul className="list-group">
                {Object.entries(questions[currentIndex].answers).map(
                  ([key, value]) => {
                    if (!value) return null;
                    return (
                      <li
                        className="list-group-item"
                        style={{ cursor: "pointer" }}
                        key={key}
                      >
                        <input
                          type="radio"
                          name="quiz-option"
                          className="form-check-input me-2"
                          checked={selectedOption === key}
                          onChange={() => setSelectedOption(key)}
                        />
                        {value}
                      </li>
                    );
                  }
                )}
              </ul>

              
              {!correctArray[currentIndex] && (
                <button
                  className="btn btn-primary mt-3 me-2"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}

             {isCorrect === true && (
  <div className="alert alert-success mt-3">
     Correct Answer!
  </div>
)}

{isCorrect === null && correctArray[currentIndex] && (
  <div className="alert alert-success mt-3">
     Already answered correctly!
  </div>
)}
              {isCorrect === false && (
                <div className="alert alert-danger mt-3">
                   Wrong Answer.
                </div>
              )}

              {(isCorrect !== null || correctArray[currentIndex]) && (
                <button className="btn btn-success mt-3" onClick={handleNext}>
                  Next
                </button>
              )}

              <button
                className="btn btn-secondary mb-3"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}
