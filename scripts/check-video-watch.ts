import { db } from "../lib/db";

async function main() {
  const rows = await db.videoWatch.findMany({
    take: 20,
    include: {
      student: true,
      video: true,
    },
  });

  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch(console.error)
  .finally(() => process.exit());
