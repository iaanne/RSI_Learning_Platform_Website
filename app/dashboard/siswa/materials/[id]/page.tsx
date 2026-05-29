"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Material {
  id: string;
  title: string;
  contentText: string;
  difficulty: string;
  videos: {
    id: string;
    title: string;
    embedUrl: string;
  }[];
}

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/materials/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMaterial(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!material) {
    return <div className="p-6">Material tidak ditemukan</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{material.title}</h1>
        <p className="text-gray-500">
          Difficulty: {material.difficulty}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="whitespace-pre-line">
          {material.contentText}
        </p>
      </div>

      <div className="space-y-4">
        {material.videos.map((video) => (
          <div
            key={video.id}
            className="bg-white p-4 rounded-xl border"
          >
            <h2 className="font-semibold mb-3">
              {video.title}
            </h2>

            <iframe
              src={video.embedUrl}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          router.push(`/dashboard/siswa/quiz/${material.id}`)
        }
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Mulai Quiz
      </button>
    </div>
  );
}