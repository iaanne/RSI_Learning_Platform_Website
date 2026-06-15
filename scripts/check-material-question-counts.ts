import { db } from "../lib/db";

async function main() {
  const materials = await db.material.findMany({
    take: 10,
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  console.log(JSON.stringify(materials, null, 2));
}

main()
  .catch(console.error)
  .finally(() => process.exit());
