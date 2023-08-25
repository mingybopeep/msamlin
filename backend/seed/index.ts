import { Pool } from "mysql2/promise";

export const seedDb = async (pool: Pool) => {
  console.log("🌰 seeding db");
  const connection = await pool.getConnection();

  const [rows] = await connection.query<any[]>(`SHOW TABLES LIKE 'User'`);

  if (rows.length) {
    console.log("already seeded");
    return;
  }

  await connection.execute(`
    CREATE TABLE User (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
      email VARCHAR(255) NOT NULL, 
      hashed VARCHAR(255) NOT NULL, 
      salt VARCHAR(255) NOT NULL, 
      createdDate DATE NOT NULL
      );
      `);

  console.log("🌱 seeding successful");
};
