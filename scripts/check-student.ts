import { db } from "../lib/db";

async function main() {
  const student = await db.student.findFirst();

  console.log(student);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
