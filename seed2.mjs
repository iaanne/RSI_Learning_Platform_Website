import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://postgres:1234@localhost:5432/RSI_Learning_Platform'
});

await client.connect();

const hash = await bcrypt.hash('password123', 12);

await client.query(`
  INSERT INTO users (id, email, password_hash, role, name, is_active, created_at)
  VALUES 
    (gen_random_uuid(), 'guru@test.com',   $1, 'TEACHER',   'Ibu Pertiwi',    true, NOW()),
    (gen_random_uuid(), 'kepsek@test.com', $1, 'PRINCIPAL', 'Kepala Sekolah', true, NOW()),
    (gen_random_uuid(), 'ortu@test.com',   $1, 'PARENT',    'Bapak Sukma',    true, NOW())
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
`, [hash]);

console.log('Done! Users created with password: password123');
await client.end();