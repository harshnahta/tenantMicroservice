import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createTenantSchema(tenantId: string) {
  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${tenantId};`);
    await client.query(`SET search_path TO ${tenantId};`);

    // Manually migrate schema (e.g., copying tables from "public")
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${tenantId}.Products (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price INT NOT NULL,
        createdAt TIMESTAMP DEFAULT now(),
        updatedAt TIMESTAMP DEFAULT now()
      );
    `);

    console.log(`Schema ${tenantId} created successfully.`);
    return true;
  } catch (error) {
    console.error('Error creating schema:', error);
  } finally {
    client.release();
  }
}
