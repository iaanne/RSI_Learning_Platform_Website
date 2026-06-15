import { db } from "../lib/db";
import fs from "fs";

async function main() {
  const videos = await db.video.findMany({
    select: {
      id: true,
      title: true,
      embedUrl: true,
    },
  });

  const csv = [
    "id,title,embedUrl",
    ...videos.map(
      (v) =>
        `"${v.id}","${v.title}","${v.embedUrl}"`
    ),
  ].join("\n");

  fs.writeFileSync("videos.csv", csv);

  console.log(
    `Exported ${videos.length} videos to videos.csv`
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit());