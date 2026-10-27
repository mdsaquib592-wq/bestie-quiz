import React, { useState, useEffect } from "react";
import { QUIZ_QUESTIONS } from "./data/questions";
import Header from "./components/Header";
import AdBanner from "./components/AdBanner";
import WelcomeCard from "./components/WelcomeCard";
import QuizQuestion from "./components/QuizQuestion";
import ShareModal from "./components/ShareModal";
import ResultsCard from "./components/ResultsCard";

export default function App() {
  const [view, setView] = useState("welcome");
  const [isFriendMode, setIsFriendMode] = useState(false);

  const [creatorName, setCreatorName] = useState("");
  const [creatorAnswers, setCreatorAnswers] = useState([]);

  const [friendName, setFriendName] = useState("");
  const [friendScore, setFriendScore] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlAns = params.get("ans");

    if (urlName && urlAns) {
      try {
        const decodedAnswers = JSON.parse(
          decodeURIComponent(escape(atob(urlAns))),
        );
        if (
          Array.isArray(decodedAnswers) &&
          decodedAnswers.length === QUIZ_QUESTIONS.length
        ) {
          setCreatorName(decodeURIComponent(urlName));
          setCreatorAnswers(decodedAnswers);
          setIsFriendMode(true);
        }
      } catch (err) {
        console.error("Invalid quiz URL parameters", err);
      }
    }
  }, []);

  const handleStartQuiz = (enteredName) => {
    if (isFriendMode) {
      setFriendName(enteredName);
    } else {
      setCreatorName(enteredName);
      setCreatorAnswers([]);
    }
    setCurrentIndex(0);
    setView("quiz");
  };

  const handleSelectOption = (optionIndex) => {
    if (!isFriendMode) {
      const updatedAnswers = [...creatorAnswers, optionIndex];
      setCreatorAnswers(updatedAnswers);

      if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const encodedData = btoa(
          unescape(encodeURIComponent(JSON.stringify(updatedAnswers))),
        );
        const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(creatorName)}&ans=${encodedData}`;
        setShareUrl(url);
        setView("share");
      }
    } else {
      let newScore = friendScore;
      if (optionIndex === creatorAnswers[currentIndex]) {
        newScore += 1;
        setFriendScore(newScore);
      }

      if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setView("result");
      }
    }
  };

  const handleResetToCreate = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setIsFriendMode(false);
    setCreatorName("");
    setCreatorAnswers([]);
    setFriendName("");
    setFriendScore(0);
    setCurrentIndex(0);
    setView("welcome");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 selection:bg-pink-500 selection:text-white">
      <Header onReset={handleResetToCreate} />

      <AdBanner slotLabel="Top Header Banner" format="horizontal" />

      <main className="w-full flex flex-col items-center justify-center my-auto">
        {view === "welcome" && (
          <WelcomeCard
            targetName={creatorName}
            isFriendMode={isFriendMode}
            onStart={handleStartQuiz}
          />
        )}

        {view === "quiz" && (
          <>
            <QuizQuestion
              questionData={QUIZ_QUESTIONS[currentIndex]}
              currentIndex={currentIndex}
              totalQuestions={QUIZ_QUESTIONS.length}
              targetName={creatorName}
              isFriendMode={isFriendMode}
              onSelectOption={handleSelectOption}
            />
            <AdBanner slotLabel="Mid-Quiz Native Ad" format="horizontal" />
          </>
        )}

        {view === "share" && (
          <>
            <ShareModal shareUrl={shareUrl} onRestart={handleResetToCreate} />
            <AdBanner slotLabel="Post-Share Rectangle" format="box" />
          </>
        )}

        {view === "result" && (
          <>
            <ResultsCard
              score={friendScore}
              total={QUIZ_QUESTIONS.length}
              targetName={creatorName}
              friendName={friendName}
              onCreateOwn={handleResetToCreate}
            />
            <AdBanner slotLabel="Scorecard Rectangle" format="box" />
          </>
        )}
      </main>

      <footer className="w-full max-w-md text-center py-6 text-xs text-slate-600">
        BestieDare 2026 • Share & Play with Friends
      </footer>
    </div>
  );
}
