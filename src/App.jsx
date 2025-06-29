import React, { useState, useRef } from "react";
import { questions } from "./questions";

function decodeBase64(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [name, setName] = useState("");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [tries, setTries] = useState(0);
  const [triesForCurrent, setTriesForCurrent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [selected, setSelected] = useState("");
  const inputRef = useRef();

  // Start quiz
  const handleStart = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      inputRef.current.focus();
      return;
    }
    setScreen("quiz");
    setStartTime(Date.now());
    setCurrent(0);
    setScore(0);
    setWrong(0);
    setTries(0);
    setTriesForCurrent(0);
    setFeedback("");
    setFeedbackType("");
    setSelected("");
  };

  // Handle answer submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) {
      setFeedback("Please select an answer.");
      setFeedbackType("error");
      return;
    }
    setTriesForCurrent(triesForCurrent + 1);
    setTries(tries + 1);
    const isCorrect = selected === decodeBase64(questions[current].correct);
    if (isCorrect) {
      setScore(score + 1);
      setFeedback("Correct!");
      setFeedbackType("success");
      setTimeout(() => {
        nextQuestion();
      }, 900);
    } else {
      if (triesForCurrent < 1) {
        setFeedback("Incorrect. Try again!");
        setFeedbackType("error");
      } else {
        setWrong(wrong + 1);
        setFeedback(
          `Incorrect. The correct answer was: ${decodeBase64(
            questions[current].correct
          )}`
        );
        setFeedbackType("error");
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      }
    }
  };

  // Next question or finish
  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTriesForCurrent(0);
      setFeedback("");
      setFeedbackType("");
      setSelected("");
    } else {
      setEndTime(Date.now());
      setScreen("summary");
      sendToFormspree();
    }
  };

  // Send results to Formspree
  const sendToFormspree = () => {
    const timeTaken = ((endTime - startTime) / 1000).toFixed(1);
    console.log('Formspree ID:', FORMSPREE_ID); // Debug log
    if (!FORMSPREE_ID) {
      console.log('No Formspree ID found!'); // Debug log
      return;
    }
    console.log('Sending to Formspree:', { name, time: timeTaken, wrong, tries, score }); // Debug log
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        time: timeTaken,
        wrong,
        tries,
        score,
      }),
    })
    .then(response => {
      console.log('Formspree response:', response); // Debug log
      if (response.ok) {
        console.log('Formspree submission successful!'); // Debug log
      } else {
        console.log('Formspree submission failed:', response.status); // Debug log
      }
    })
    .catch(error => {
      console.log('Formspree error:', error); // Debug log
    });
  };

  // Restart quiz
  const handleRestart = () => {
    setScreen("welcome");
    setName("");
    setCurrent(0);
    setScore(0);
    setWrong(0);
    setTries(0);
    setTriesForCurrent(0);
    setFeedback("");
    setFeedbackType("");
    setSelected("");
    setStartTime(null);
    setEndTime(null);
  };

  // Progress bar
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
      
      {/* Welcome Screen */}
      {screen === "welcome" && (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <img 
              src="https://i.postimg.cc/pXz5N3xS/A-3-D-rendered-digital-image-showcases-an-arrangeme.png" 
              alt="Cube Logo" 
              className="w-16 h-16 mb-3 rounded-xl shadow-lg border border-purple-400/30" 
            />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-3xl font-bold mb-2 animate-pulse">Solve It</h1>
            <h2 className="text-white/90 text-lg mb-6 text-center font-medium">
              Welcome! Please enter your name to start the quiz.
            </h2>
            <form className="w-full" onSubmit={handleStart} autoComplete="off">
              <label htmlFor="username" className="block text-purple-300 mb-2 font-medium">
                Your Name
              </label>
              <input
                ref={inputRef}
                id="username"
                type="text"
                className="w-full p-3 rounded-xl bg-slate-800/80 text-white border border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none mb-4 backdrop-blur-sm transition-all duration-300"
                maxLength={32}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Screen */}
      {screen === "quiz" && (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          <div className="relative z-10 w-full">
            <div className="flex justify-between w-full mb-4 text-purple-300 text-sm font-medium">
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-purple-500/30">{name}</span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-purple-500/30">
                Score: {score} / {questions.length}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800/80 rounded-full mb-6 overflow-hidden border border-purple-500/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div
              className="text-xl text-white mb-6 text-center font-medium leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<span class="text-purple-400 font-bold">Q${current + 1}:</span> ${questions[current].text}`,
              }}
            />
            <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex flex-col gap-3 mb-4">
                {questions[current].options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      selected === opt
                        ? "border-purple-400 bg-gradient-to-r from-purple-600/20 to-pink-600/20 shadow-lg shadow-purple-500/25"
                        : "border-purple-500/30 bg-slate-800/80 hover:border-purple-400/50 hover:bg-slate-700/80"
                    }`}
                    tabIndex={0}
                    onClick={() => setSelected(opt)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelected(opt);
                    }}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={opt}
                      checked={selected === opt}
                      onChange={() => setSelected(opt)}
                      className="accent-purple-500"
                    />
                    <span className="text-white" dangerouslySetInnerHTML={{ __html: opt }} />
                  </label>
                ))}
              </div>
              <div
                className={`min-h-[24px] text-center font-medium mb-4 ${
                  feedbackType === "error"
                    ? "text-red-400"
                    : feedbackType === "success"
                    ? "text-green-400"
                    : "text-purple-300"
                }`}
              >
                {feedback}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Summary Screen */}
      {screen === "summary" && (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <img 
              src="https://i.postimg.cc/pXz5N3xS/A-3-D-rendered-digital-image-showcases-an-arrangeme.png" 
              alt="Cube Logo" 
              className="w-16 h-16 mb-3 rounded-xl shadow-lg border border-purple-400/30" 
            />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-3xl font-bold mb-4 animate-pulse">Quiz Complete!</h1>
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 w-full text-center text-white mb-6 border border-purple-500/30 backdrop-blur-sm">
              <h2 className="text-xl mb-4 font-medium">
                Well done, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">{name}</span>!
              </h2>
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-purple-400">⏱️</span>
                  Time taken: <b className="text-purple-300">
                    {endTime && startTime
                      ? formatTime((endTime - startTime) / 1000)
                      : "--"}
                  </b>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✅</span>
                  Score: <b className="text-green-300">{score} / {questions.length}</b>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-red-400">❌</span>
                  Wrong questions: <b className="text-red-300">{wrong}</b>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-blue-400">🔄</span>
                  Total tries: <b className="text-blue-300">{tries}</b>
                </p>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              onClick={handleRestart}
            >
              Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 