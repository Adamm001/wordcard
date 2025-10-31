"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Card = { kanji: string; reading: string; meaning: string };

export default function Flashcards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [unknownWords, setUnknownWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("/data.csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text
          .trim()
          .split("\n")
          .map((line) => {
            const [kanji, reading, meaning] = line.split(",");
            return { kanji, reading, meaning };
          });
        setCards(rows);
        setFinished(false);
        pickRandom(rows, []); // initial pick (pass empty known list)
      });
  }, []);

  function pickRandom(list: Card[], known = knownWords) {
    const remaining = list.filter((c) => !known.includes(c.kanji));
    // If there are no remaining cards (all known) -> finished
    if (list.length > 0 && remaining.length === 0) {
      setFinished(true);
      return;
    }
    const pool = remaining.length > 0 ? remaining : list;
    const newIndex = Math.floor(Math.random() * pool.length);
    const reverse = Math.random() < 0.5;
    setIsReverse(reverse);
    const newCard = pool[newIndex];
    setIndex(list.findIndex((c) => c.kanji === newCard.kanji));
    setShowAnswer(false);
  }

  function nextCard() {
    pickRandom(cards);
  }

  function markKnown() {
    const current = cards[index];
    setKnownWords((prev) => {
      if (prev.includes(current.kanji)) {
        return prev;
      }
      const next = [...prev, current.kanji];
      // If after adding this one all cards are known -> finished
      if (cards.length > 0 && next.length === cards.length) {
        setFinished(true);
      } else {
        // pick next using the updated known list
        pickRandom(cards, next);
      }
      return next;
    });
    setScore((s) => s + 1);
  }

  function markUnknown() {
    const current = cards[index];
    setUnknownWords((prev) => {
      const next = [...prev, current.kanji];
      // if user marks unknown, ensure not finished
      setFinished(false);
      // pick next with current knownWords (no change to known)
      pickRandom(cards);
      return next;
    });
  }

  if (!cards.length)
    return <p className="text-center mt-10">Флаш карт алга...</p>;

  if (finished) {
    return (
      <div className="flex w-full h-120 justify-center items-center mt-10 text-white">
        <div className="w-100 flex flex-col items-center">
          <h2 className="text-2xl mb-4">Бүх карт мэдэгдлээ 🎉</h2>
          <p className="text-sm text-gray-500 mb-4">
            Score: <span className="text-green-400">{score}</span> /{" "}
            {cards.length}
          </p>
          <div className="flex gap-4 mt-5 w-full">
            <button
              onClick={() => {
                // restart progress
                setKnownWords([]);
                setUnknownWords([]);
                setScore(0);
                setFinished(false);
                pickRandom(cards, []);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded cursor-pointer w-full"
            >
              Дахин эхлэх
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[index];
  const question = isReverse ? card.meaning : card.kanji;
  const hint = isReverse ? "Монгол → Япон" : "Япон → Монгол";

  return (
    <div className="flex w-full h-120 justify-center items-center mt-10 text-white">
      <div className="w-100 flex flex-col items-center">
        <h2 className="text-gray-400 mb-2">{hint}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Score: <span className="text-green-400">{score}</span> /{" "}
          {cards.length}
        </p>
        {/* 💫 Flip animation */}
        <div
          className="perspective w-100 h-52 cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <AnimatePresence mode="wait">
            {!showAnswer ? (
              <motion.div
                key="front"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -180, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-100 h-52 flex flex-col justify-center items-center rounded-xl border bg-neutral-900 shadow-lg"
              >
                <h1 className="text-3xl font-bold">{question}</h1>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 180, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute w-100 h-52 flex flex-col justify-center items-center rounded-xl border bg-neutral-800 shadow-lg"
              >
                {!isReverse ? (
                  <>
                    {card.reading && card.reading.length > 0 && (
                      <p className="text-sm text-gray-300 mb-1">
                        {card.reading}
                      </p>
                    )}
                    <p className="text-xl text-green-400">{card.meaning}</p>
                  </>
                ) : (
                  <>
                    {card.reading && card.reading.length > 0 && (
                      <p className="text-sm text-gray-300 mb-1">
                        {card.reading}
                      </p>
                    )}

                    <p className="text-xl text-green-400">{card.kanji}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-4 mt-5 w-full">
          <button
            onClick={markKnown}
            className="bg-green-600 hover:bg-green-700 text-white h-10 rounded cursor-pointer w-full"
          ></button>
          <button
            onClick={markUnknown}
            className="bg-red-600 hover:bg-red-700 text-white h-10 rounded cursor-pointer w-full"
          ></button>
        </div>
      </div>
    </div>
  );
}
