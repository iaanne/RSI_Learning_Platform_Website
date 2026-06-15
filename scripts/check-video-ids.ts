// scripts/check-video-ids.ts

import { db } from "../lib/db";

async function main() {
  const videos = await db.video.findMany({
    select: {
      title: true,
      embedUrl: true,
    },
  });

  videos.forEach((v) => {
    const id = v.embedUrl
      .replace("https://www.youtube.com/embed/", "");

    console.log(`${v.title} -> ${id}`);
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());