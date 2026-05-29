import bcrypt from "bcryptjs";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString:
    "postgresql://postgres:1234@localhost:5432/RSI_Learning_Platform",
});

await client.connect();

const hash = await bcrypt.hash("password123", 12);

// ======================
// USERS
// ======================

const teacherUser = await client.query(`
  INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    name,
    is_active,
    created_at
  )
  VALUES (
    gen_random_uuid(),
    'guru@test.com',
    '${hash}',
    'TEACHER',
    'Ibu Pertiwi',
    true,
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash
  RETURNING id
`);

const principalUser = await client.query(`
  INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    name,
    is_active,
    created_at
  )
  VALUES (
    gen_random_uuid(),
    'kepsek@test.com',
    '${hash}',
    'PRINCIPAL',
    'Kepala Sekolah',
    true,
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash
  RETURNING id
`);

const parentUser = await client.query(`
  INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    name,
    is_active,
    created_at
  )
  VALUES (
    gen_random_uuid(),
    'ortu@test.com',
    '${hash}',
    'PARENT',
    'Bapak Sukma',
    true,
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash
  RETURNING id
`);

const studentUser = await client.query(`
  INSERT INTO users (
    id,
    email,
    password_hash,
    role,
    name,
    is_active,
    created_at
  )
  VALUES (
    gen_random_uuid(),
    'siswa@test.com',
    '${hash}',
    'STUDENT',
    'Budi Santoso',
    true,
    NOW()
  )
  ON CONFLICT (email)
  DO UPDATE SET password_hash = EXCLUDED.password_hash
  RETURNING id
`);

const parentUserId = parentUser.rows[0].id;
const studentUserId = studentUser.rows[0].id;

// ======================
// PARENT
// ======================

const parent = await client.query(`
  INSERT INTO parents (
    id,
    user_id,
    phone,
    address
  )
  VALUES (
    gen_random_uuid(),
    '${parentUserId}',
    '08123456789',
    'Semarang'
  )
  ON CONFLICT (user_id)
  DO UPDATE SET phone = EXCLUDED.phone
  RETURNING id
`);

const parentId = parent.rows[0].id;

// ======================
// CLASS
// ======================

const kelas = await client.query(`
  INSERT INTO classes (
    id,
    name,
    grade_level,
    academic_year
  )
  VALUES (
    gen_random_uuid(),
    '7A',
    7,
    2026
  )
  RETURNING id
`);

const classId = kelas.rows[0].id;

// ======================
// STUDENT
// ======================

await client.query(`
  INSERT INTO students (
    id,
    user_id,
    class_id,
    parent_id,
    nis,
    total_points,
    current_streak,
    lives_remaining
  )
  VALUES (
    gen_random_uuid(),
    '${studentUserId}',
    '${classId}',
    '${parentId}',
    'SISWA001',
    0,
    0,
    3
  )
  ON CONFLICT (user_id)
  DO UPDATE SET nis = EXCLUDED.nis
`);

console.log("==================================");
console.log("TEST USERS CREATED");
console.log("==================================");
console.log("Teacher   : guru@test.com");
console.log("Principal : kepsek@test.com");
console.log("Parent    : ortu@test.com");
console.log("Student   : siswa@test.com");
console.log("Password  : password123");
console.log("==================================");

await client.end();