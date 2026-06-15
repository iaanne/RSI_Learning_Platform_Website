import { db } from "../lib/db";

async function main() {
  const student = await db.student.findFirst();

  const video = await db.video.findFirst();

  console.log({
    studentId: student?.id,
    videoId: video?.id,
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());
