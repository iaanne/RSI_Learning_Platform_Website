import { db } from "../lib/db";

async function main() {
  const count = await db.question.count();

  console.log("Questions:", count);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
