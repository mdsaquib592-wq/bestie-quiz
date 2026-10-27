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

// Helper functions for safe UTF-8 Base64 encoding/decoding
const encodePayload = (obj) => {
  try {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

const decodePayload = (str) => {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    // Fallback for older links created with unescape
    try {
      return JSON.parse(decodeURIComponent(escape(atob(str))));
    } catch (e) {
      return null;
    }
  }
};

export default function App() {
  const [selectedCatKey, setSelectedCatKey] = useState("best_friend");
  const [view, setView] = useState("welcome"); // 'welcome' | 'quiz' | 'share' | 'result' | 'leaderboard'
  const [isFriendMode, setIsFriendMode] = useState(false);

  // Creator state
  const [quizId, setQuizId] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorAnswers, setCreatorAnswers] = useState([]);

  // Friend state
  const [friendName, setFriendName] = useState("");
  const [friendScore, setFriendScore] = useState(0);
  const [friendAnswers, setFriendAnswers] = useState([]);

  // Scoreboard / Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [syncMessage, setSyncMessage] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shareUrl, setShareUrl] = useState("");

  const currentCategory =
    QUIZ_CATEGORIES[selectedCatKey] || QUIZ_CATEGORIES.best_friend;
  const questionsList = currentCategory.questions;

  // Save leaderboard helper (deduplicates by entry id)
  const saveToLocalLeaderboard = (newEntries) => {
    setLeaderboard((prev) => {
      const existingRaw = localStorage.getItem("bestiedare_leaderboard");
      const existing = existingRaw ? JSON.parse(existingRaw) : prev;
      const mergedMap = new Map();

      [...newEntries, ...existing].forEach((item) => {
        if (item && item.id) {
          mergedMap.set(String(item.id), item);
        }
      });

      const updated = Array.from(mergedMap.values());
      localStorage.setItem("bestiedare_leaderboard", JSON.stringify(updated));
      return updated;
    });
  };

  // Optional Free Cloud Sync (uses JSONBlob / KV fallback so scores sync automatically if online)
  const syncScoreToCloud = async (activeQuizId, entry) => {
    if (!activeQuizId) return;
    try {
      await fetch(`https://ntfy.sh/bestiedare_${activeQuizId}`, {
        method: "POST",
        body: JSON.stringify(entry),
      });
    } catch {
      // Silent fallback: URL sync link still guarantees 100% delivery
    }
  };

  const fetchCloudScores = async (activeQuizId) => {
    if (!activeQuizId) return;
    try {
      const res = await fetch(
        `https://ntfy.sh/bestiedare_${activeQuizId}/json?poll=1`,
      );
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.trim().split("\n").filter(Boolean);
      const cloudEntries = [];

      lines.forEach((line) => {
        try {
          const packet = JSON.parse(line);
          if (packet.message) {
            const parsedEntry = JSON.parse(packet.message);
            if (parsedEntry && parsedEntry.name && parsedEntry.answers) {
              cloudEntries.push(parsedEntry);
            }
          }
        } catch {}
      });

      if (cloudEntries.length > 0) {
        saveToLocalLeaderboard(cloudEntries);
      }
    } catch {
      // Ignore network errors
    }
  };

  // 1. Load saved quiz, existing leaderboard, and URL parameters on mount
  useEffect(() => {
    let loadedQuizId = "";
    const savedQuiz = localStorage.getItem("bestiedare_my_quiz");
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);
        if (parsed.creatorName && parsed.creatorAnswers) {
          setCreatorName(parsed.creatorName);
          setCreatorAnswers(parsed.creatorAnswers);
          if (parsed.quizId) {
            setQuizId(parsed.quizId);
            loadedQuizId = parsed.quizId;
          }
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

    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get("cat");
    const urlName = params.get("name");
    const urlAns = params.get("ans");
    const urlQuizId = params.get("qid");
    const urlResult = params.get("res");

    // Case A: Creator clicked on Friend's Result Sync Link (?res=...)
    if (urlResult) {
      const decodedRes = decodePayload(urlResult);
      if (decodedRes && decodedRes.name && Array.isArray(decodedRes.answers)) {
        if (decodedRes.cat && QUIZ_CATEGORIES[decodedRes.cat]) {
          setSelectedCatKey(decodedRes.cat);
        }
        if (decodedRes.creatorName && !savedQuiz) {
          setCreatorName(decodedRes.creatorName);
        }
        if (Array.isArray(decodedRes.creatorAnswers) && !savedQuiz) {
          setCreatorAnswers(decodedRes.creatorAnswers);
        }

        saveToLocalLeaderboard([decodedRes]);
        setSyncMessage(
          `🎉 ${decodedRes.name} ka result aapke Leaderboard me add ho gaya!`,
        );
        setView("leaderboard");

        // Clean URL after importing result
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        setTimeout(() => setSyncMessage(""), 5000);
        return;
      }
    }

    // Case B: Friend opened Creator's Quiz Link (?cat=...&name=...&ans=...)
    if (urlCat && QUIZ_CATEGORIES[urlCat]) {
      setSelectedCatKey(urlCat);
    }

    if (urlName && urlAns) {
      const decodedAnswers = decodePayload(urlAns);
      const targetQuestions = (
        QUIZ_CATEGORIES[urlCat] || QUIZ_CATEGORIES.best_friend
      ).questions;

      if (
        Array.isArray(decodedAnswers) &&
        decodedAnswers.length === targetQuestions.length
      ) {
        setCreatorName(decodeURIComponent(urlName));
        setCreatorAnswers(decodedAnswers);
        if (urlQuizId) setQuizId(urlQuizId);
        setIsFriendMode(true);
      }
    } else if (loadedQuizId) {
      // Pull any new friend attempts from live sync channel
      fetchCloudScores(loadedQuizId);
    }
  }, []);

  // Poll cloud scores whenever creator opens Leaderboard view
  useEffect(() => {
    if (view === "leaderboard" && quizId) {
      fetchCloudScores(quizId);
    }
  }, [view, quizId]);

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
        const newQuizId =
          "q_" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 6);
        setQuizId(newQuizId);

        const encodedData = encodePayload(updatedAnswers);
        const url = `${window.location.origin}${window.location.pathname}?cat=${selectedCatKey}&qid=${newQuizId}&name=${encodeURIComponent(creatorName)}&ans=${encodedData}`;
        setShareUrl(url);

        // Reset old leaderboard for fresh quiz & save creator quiz locally
        setLeaderboard([]);
        localStorage.setItem("bestiedare_leaderboard", JSON.stringify([]));
        localStorage.setItem(
          "bestiedare_my_quiz",
          JSON.stringify({
            quizId: newQuizId,
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
        // Quiz completed: save attempt locally + push to cloud + generate creator sync link
        const newEntry = {
          id: Date.now(),
          name: friendName,
          score: newScore,
          answers: updatedFriendAnswers,
          cat: selectedCatKey,
          creatorName,
          creatorAnswers,
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        saveToLocalLeaderboard([newEntry]);
        syncScoreToCloud(quizId, newEntry);
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
    setFriendAnswers([]);
    setCurrentIndex(0);
    setView("welcome");
  };

  // Build sync link so Friend can send their full scorecard directly to Creator's leaderboard
  const resultSyncPayload =
    view === "result"
      ? encodePayload({
          id: Date.now(),
          name: friendName,
          score: friendScore,
          answers: friendAnswers,
          cat: selectedCatKey,
          creatorName,
          creatorAnswers,
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      : "";

  const resultSyncUrl = resultSyncPayload
    ? `${window.location.origin}${window.location.pathname}?res=${resultSyncPayload}`
    : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <Header
        onReset={handleResetToCreate}
        onOpenResults={() => setView("leaderboard")}
        hasSavedQuiz={Boolean(
          creatorAnswers.length > 0 || leaderboard.length > 0,
        )}
      />

      {/* Toast Notification when Friend's result is synced */}
      {syncMessage && (
        <div className="w-full max-w-md mb-3 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center shadow-lg animate-bounce">
          {syncMessage}
        </div>
      )}

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
              correctOptionIndex={
                isFriendMode ? creatorAnswers[currentIndex] : null
              }
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
              questions={questionsList}
              creatorAnswers={creatorAnswers}
              friendAnswers={friendAnswers}
              resultSyncUrl={resultSyncUrl}
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
              onRefresh={() => fetchCloudScores(quizId)}
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
