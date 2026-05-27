const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', '..', 'db', 'migrations', '002_permissions_seller_version.sql');
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const envMatch = envContent.match(/^SUPABASE_DB_PASSWORD=(.+)$/m);
const password = process.env.SUPABASE_DB_PASSWORD || (envMatch ? envMatch[1].trim() : null);

if (!password) {
  console.error('Missing SUPABASE_DB_PASSWORD environment variable');
  process.exit(1);
}

const client = new Client({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.equtixyatyhfihtksvny',
  password,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE seller_application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement && !statement.startsWith('--') && !statement.includes('CREATE TYPE seller_application_status'));

  for (const statement of statements) {
    try {
      await client.query(statement);
      console.log('OK:', statement.split('\n')[0]);
    } catch (error) {
      console.error('FAIL:', statement.split('\n')[0], '-', error.message);
      throw error;
    }
  }

  await client.end();
  console.log('Migration completed successfully');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
