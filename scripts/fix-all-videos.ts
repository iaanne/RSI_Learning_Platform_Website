import { db } from "../lib/db";

async function main() {
  const videos = await db.video.findMany();

  for (const video of videos) {
    await db.video.update({
      where: { id: video.id },
      data: {
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    });

    console.log("updated:", video.title);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
