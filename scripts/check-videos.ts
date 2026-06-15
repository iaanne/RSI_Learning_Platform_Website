import { db } from "../lib/db";

async function main() {
  const videos = await db.video.findMany({
    select: {
      title: true,
      embedUrl: true,
    },
  });

  console.log(videos);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
