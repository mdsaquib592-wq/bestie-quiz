import React, { useState, useEffect } from "react";
import { QUIZ_CATEGORIES } from "./data/questions";
import Header from "./components/Header";
import CategoryBar from "./components/CategoryBar";
import AdBanner from "./components/AdBanner";
import WelcomeCard from "./components/WelcomeCard";
import QuizQuestion from "./components/QuizQuestion";
import ShareModal from "./components/ShareModal";
import ResultsCard from "./components/ResultsCard";
import LeaderboardView from "./components/LeaderboardView";

export default function App() {
  const [selectedCatKey, setSelectedCatKey] = useState("best_friend");
  const [view, setView] = useState("welcome"); // 'welcome' | 'quiz' | 'share' | 'result' | 'leaderboard'
  const [isFriendMode, setIsFriendMode] = useState(false);

  // Creator state
  const [creatorName, setCreatorName] = useState("");
  const [creatorAnswers, setCreatorAnswers] = useState([]);

  // Friend state
  const [friendName, setFriendName] = useState("");
  const [friendScore, setFriendScore] = useState(0);
  const [friendAnswers, setFriendAnswers] = useState([]);

  // Scoreboard / Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  const currentCategory =
    QUIZ_CATEGORIES[selectedCatKey] || QUIZ_CATEGORIES.best_friend;
  const questionsList = currentCategory.questions;

  // 1. Load saved quiz and existing leaderboard from LocalStorage on mount
  useEffect(() => {
    const savedQuiz = localStorage.getItem("bestiedare_my_quiz");
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);
        if (parsed.creatorName && parsed.creatorAnswers) {
          setCreatorName(parsed.creatorName);
          setCreatorAnswers(parsed.creatorAnswers);
          if (parsed.category) setSelectedCatKey(parsed.category);
          if (parsed.shareUrl) setShareUrl(parsed.shareUrl);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedBoard = localStorage.getItem("bestiedare_leaderboard");
    if (savedBoard) {
      try {
        setLeaderboard(JSON.parse(savedBoard));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2. Detect if visitor opened via a friend's link (?cat=...&name=...&ans=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get("cat");
    const urlName = params.get("name");
    const urlAns = params.get("ans");

    if (urlCat && QUIZ_CATEGORIES[urlCat]) {
      setSelectedCatKey(urlCat);
    }

    if (urlName && urlAns) {
      try {
        const decodedAnswers = JSON.parse(
          decodeURIComponent(escape(atob(urlAns))),
        );
        const targetQuestions = (
          QUIZ_CATEGORIES[urlCat] || QUIZ_CATEGORIES.best_friend
        ).questions;
        if (
          Array.isArray(decodedAnswers) &&
          decodedAnswers.length === targetQuestions.length
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

  // Start Quiz
  const handleStartQuiz = (enteredName) => {
    if (isFriendMode) {
      setFriendName(enteredName);
      setFriendAnswers([]);
      setFriendScore(0);
    } else {
      setCreatorName(enteredName);
      setCreatorAnswers([]);
    }
    setCurrentIndex(0);
    setView("quiz");
  };

  // Option Click
  const handleSelectOption = (optionIndex) => {
    if (!isFriendMode) {
      // Creator Flow
      const updatedAnswers = [...creatorAnswers, optionIndex];
      setCreatorAnswers(updatedAnswers);

      if (currentIndex + 1 < questionsList.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const encodedData = btoa(
          unescape(encodeURIComponent(JSON.stringify(updatedAnswers))),
        );
        const url = `${window.location.origin}${window.location.pathname}?cat=${selectedCatKey}&name=${encodeURIComponent(creatorName)}&ans=${encodedData}`;
        setShareUrl(url);

        // Save creator quiz locally
        localStorage.setItem(
          "bestiedare_my_quiz",
          JSON.stringify({
            creatorName,
            creatorAnswers: updatedAnswers,
            category: selectedCatKey,
            shareUrl: url,
          }),
        );

        setView("share");
      }
    } else {
      // Friend Flow
      const updatedFriendAnswers = [...friendAnswers, optionIndex];
      setFriendAnswers(updatedFriendAnswers);

      let newScore = friendScore;
      if (optionIndex === creatorAnswers[currentIndex]) {
        newScore += 1;
        setFriendScore(newScore);
      }

      if (currentIndex + 1 < questionsList.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Quiz completed: save attempt to local leaderboard
        const newEntry = {
          id: Date.now(),
          name: friendName,
          score: newScore,
          answers: updatedFriendAnswers,
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        const updatedBoard = [newEntry, ...leaderboard];
        setLeaderboard(updatedBoard);
        localStorage.setItem(
          "bestiedare_leaderboard",
          JSON.stringify(updatedBoard),
        );

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
      {/* Top Header */}
      <Header
        onReset={handleResetToCreate}
        onOpenResults={() => setView("leaderboard")}
        hasSavedQuiz={Boolean(creatorAnswers.length > 0)}
      />

      {/* Category Bar */}
      {view === "welcome" && (
        <CategoryBar
          selectedCategory={selectedCatKey}
          onSelectCategory={setSelectedCatKey}
          disabled={isFriendMode}
        />
      )}

      {/* Top Ad */}
      <AdBanner slotLabel="Top Header Banner" format="horizontal" />

      {/* Main Interactive Screen */}
      <main className="w-full flex flex-col items-center justify-center my-auto">
        {view === "welcome" && (
          <WelcomeCard
            targetName={creatorName}
            isFriendMode={isFriendMode}
            currentCategory={currentCategory}
            onStart={handleStartQuiz}
          />
        )}

        {view === "quiz" && (
          <>
            <QuizQuestion
              questionData={questionsList[currentIndex]}
              currentIndex={currentIndex}
              totalQuestions={questionsList.length}
              targetName={creatorName}
              isFriendMode={isFriendMode}
              onSelectOption={handleSelectOption}
            />
            <AdBanner slotLabel="Mid-Quiz Native Ad" format="horizontal" />
          </>
        )}

        {view === "share" && (
          <>
            <ShareModal
              shareUrl={shareUrl}
              onRestart={handleResetToCreate}
              onViewResults={() => setView("leaderboard")}
            />
            <AdBanner slotLabel="Post-Share Rectangle" format="box" />
          </>
        )}

        {view === "result" && (
          <>
            <ResultsCard
              score={friendScore}
              total={questionsList.length}
              targetName={creatorName}
              friendName={friendName}
              currentCategory={currentCategory}
              onViewLeaderboard={() => setView("leaderboard")}
              onCreateOwn={handleResetToCreate}
            />
            <AdBanner slotLabel="Scorecard Rectangle" format="box" />
          </>
        )}

        {view === "leaderboard" && (
          <>
            <LeaderboardView
              quizTitle={currentCategory.title}
              creatorName={creatorName || "Your"}
              questions={questionsList}
              creatorAnswers={creatorAnswers}
              results={leaderboard}
              onBack={() => setView(shareUrl ? "share" : "welcome")}
              onCreateNew={handleResetToCreate}
            />
            <AdBanner slotLabel="Leaderboard Bottom Ad" format="box" />
          </>
        )}
      </main>

      <footer className="w-full max-w-md text-center py-6 text-xs text-slate-600">
        BestieDare 2026 • Live Leaderboard & Results • Share & Play
      </footer>
    </div>
  );
}
