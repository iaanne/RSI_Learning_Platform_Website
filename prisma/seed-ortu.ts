import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME ?? "rsi_learning_platform",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const students = await prisma.student.findMany({
    where: { parentId: null },
    include: {
      user: { select: { id: true, name: true } },
      class: { select: { name: true } },
    },
  });

  console.log(`Found ${students.length} student(s) without parent account.`);

  for (const s of students) {
    const nameLower = s.user.name.toLowerCase();
    const email = `ortu${nameLower}@test.com`;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`  SKIP ${s.user.name} — ${email} already exists`);
      continue;
    }

    const passwordHash = await bcrypt.hash("password123", 12);
    const parentName = `Orang Tua ${s.user.name}`;

    const parentUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "PARENT",
        name: parentName,
      },
    });

    const parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
      },
    });

    await prisma.student.update({
      where: { id: s.id },
      data: { parentId: parent.id },
    });

    console.log(`  ✓ ${parentName} (${email}) → ${s.user.name} (${s.class?.name ?? "-"})`);
  }

  console.log("\nDone! Parent accounts created for all students.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
