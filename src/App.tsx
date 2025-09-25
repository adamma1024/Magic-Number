import React, { useState, useEffect } from "react";
import { Balloons } from './components/Balloons';
import toastr from "toastr";

// Utility: random number generator
const generateNumber = (level: "easy" | "medium" | "hard") => {
  switch (level) {
    case "easy":
      return Math.floor(Math.random() * 100) + 1; // 1-100
    case "medium":
      return Math.floor(Math.random() * 200) + 1; // 1-200
    case "hard":
      return Math.floor(Math.random() * 1000) + 1; // 1-1000
  }
};

const getParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const App: React.FC = () => {
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [magicNumber, setMagicNumber] = useState<number>(() =>
    generateNumber(level)
  );
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(3);
  const [unlimited, setUnlimited] = useState<boolean>(false);
  const [showBallons, setShowBallons] = useState<boolean>(false);

  useEffect(() => {
    const unlimitedAttempts = getParam("unlimitedAttempts");
    setUnlimited(unlimitedAttempts === "true");
  }, []);

  const handleGuess = () => {
    const guessNum = Number(guess);

    if (!guessNum || guessNum <= 0) {
      toastr.warning("Enter a valid number!");
      return;
    }

    if (guessNum === magicNumber) {
      toastr.success("🎉 Correct! You guessed the magic number!");
      setShowBallons(true);
      return;
    }

    if (!unlimited) {
      if (attempts - 1 === 0) {
        toastr.error(`Game Over! The number was ${magicNumber}`);
        resetGame();
        return;
      }
      setAttempts((prev) => prev - 1);
      toastr.info(`Wrong! You have ${attempts - 1} attempts left.`);
    } else {
      toastr.info("Wrong! Try again (unlimited mode).");
    }
  };

  const resetGame = () => {
    setMagicNumber(generateNumber(level));
    setAttempts(3);
    setGuess("");
  };

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Magic Number</h1>
          <p className="text-gray-700 mb-4">
            Take a chance. 1 through{" "}
            {level === "easy" ? 100 : level === "medium" ? 200 : 1000}.
            <br />
            What do you think the magic number is?
          </p>

          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Guess"
          />

          <button
            onClick={handleGuess}
            className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-600 w-full"
          >
            TRY THIS ONE?
          </button>

          <button
            onClick={resetGame}
            className="mt-4 bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 w-full"
          >
            Start Over
          </button>

          <div className="mt-4">
            <p className="text-gray-600">
              Attempts left:{" "}
              {unlimited ? "∞ (test mode)" : attempts}
            </p>
            <p className="text-sm text-gray-400">Level: {level}</p>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setLevel("easy");
                resetGame();
              }}
              className={`px-3 py-1 rounded ${level === "easy" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
              Easy
            </button>
            <button
              onClick={() => {
                setLevel("medium");
                resetGame();
              }}
              className={`px-3 py-1 rounded ${level === "medium" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
              Medium
            </button>
            <button
              onClick={() => {
                setLevel("hard");
                resetGame();
              }}
              className={`px-3 py-1 rounded ${level === "hard" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
      <Balloons showBallons={showBallons} callback={() => { setShowBallons(false); resetGame(); }} />
    </div>
  );
};

export default App;

