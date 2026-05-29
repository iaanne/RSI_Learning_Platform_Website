"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  difficulty: string;
}

export default function QuizPage() {
  const params = useParams();

  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    startQuiz();
  }, []);

  async function startQuiz() {
    const res = await fetch("/api/quiz/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        materialId: params.materialId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSessionId(data.sessionId);
      setQuestion(data.question);
    }

    setLoading(false);
  }

  async function answerQuestion(answer: string) {
    if (!question) return;

    const res = await fetch("/api/quiz/answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        questionId: question.id,
        answerGiven: answer,
      }),
    });

    const data = await res.json();

    if (data.done) {
      finishQuiz();
      return;
    }

    setQuestion(data.nextQuestion);
  }

  async function finishQuiz() {
    const res = await fetch("/api/quiz/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    const data = await res.json();

    setResult(data);
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (result) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">
          Quiz Selesai
        </h1>

        <div className="bg-white border rounded-xl p-6 space-y-2">
          <p>Score: {result.score}</p>
          <p>Benar: {result.correctCount}</p>
          <p>Salah: {result.wrongCount}</p>
          <p>Result: {result.resultLevel}</p>
          <p>Points: +{result.pointsEarned}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return <div className="p-6">Tidak ada soal</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            Difficulty: {question.difficulty}
          </p>

          <h1 className="text-2xl font-bold mt-2">
            {question.questionText}
          </h1>
        </div>

        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => answerQuestion(option)}
              className="border rounded-xl p-4 text-left hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}