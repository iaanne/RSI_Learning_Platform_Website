import { db } from "../lib/db";

async function main() {
  const logs = await db.pointLog.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(JSON.stringify(logs, null, 2));
}

main()
  .catch(console.error)
  .finally(() => process.exit());
