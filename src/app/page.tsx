import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "50px" }}>
      <h1>✨ Welcome to WordCard ✨</h1>
      <p>Learn Japanese words with fun flashcards!</p>

      <Link href="/flashcards" style={{ textDecoration: "none" }}>
        <button
          style={{
            marginTop: 24,
            padding: "12px 20px",
            fontSize: 16,
            borderRadius: 8,
            background: "#0066cc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Study Flashcards
        </button>
      </Link>
    </main>
  );
}
