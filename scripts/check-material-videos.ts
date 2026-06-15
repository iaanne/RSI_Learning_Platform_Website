import { db } from "../lib/db";

async function main() {
  const materials = await db.material.findMany({
    select: {
      id: true,
      title: true,
      videos: {
        select: {
          id: true,
          title: true,
          embedUrl: true,
        },
      },
    },
  });

  console.log(JSON.stringify(materials, null, 2));
}

main()
  .catch(console.error)
  .finally(() => process.exit());