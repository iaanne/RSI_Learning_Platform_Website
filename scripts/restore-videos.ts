import { db } from "../lib/db";

async function main() {
  const updates = [
    {
      title: "Video Bilangan Bulat",
      embedUrl: "https://www.youtube.com/embed/7_MUYu2f2iA",
    },
    {
      title: "Video Pecahan",
      embedUrl: "https://www.youtube.com/embed/6dTnFmvd0FE",
    },
    {
      title: "Video Bangun Datar",
      embedUrl: "https://www.youtube.com/embed/1LMr0FbUeR4",
    },
    // add remaining if needed
  ];

  for (const u of updates) {
    await db.video.updateMany({
      where: { title: u.title },
      data: { embedUrl: u.embedUrl },
    });
  }

  console.log("done");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
