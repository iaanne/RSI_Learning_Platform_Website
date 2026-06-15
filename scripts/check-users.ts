import { db } from "../lib/db";

async function main() {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
    take: 20,
  });

  console.log("USERS:", users);

  const teachers = await db.teacher.count();
  const students = await db.student.count();
  const parents = await db.parent.count();

  console.log({
    teachers,
    students,
    parents,
  });
}

main().catch(console.error);