"use client";
import { useState } from "react";

export default function AddWord() {
  const [kanji, setKanji] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");

  const handleSave = async () => {
    if (!kanji || !reading || !meaning) return alert("Бүх мөрийг бөглөнө үү");

    await fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanji, reading, meaning }),
    });

    setKanji("");
    setReading("");
    setMeaning("");
    alert("Хадгалагдлаа!");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Шинэ үг нэмэх</h1>
      <input
        value={kanji}
        onChange={(e) => setKanji(e.target.value)}
        placeholder="漢字"
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        value={reading}
        onChange={(e) => setReading(e.target.value)}
        placeholder="Дуудлага (yomi)"
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        placeholder="Монгол орчуулга"
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Хадгалах
      </button>
    </div>
  );
}
