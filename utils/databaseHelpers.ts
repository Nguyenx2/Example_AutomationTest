import { Pool } from "pg";

export class DatabaseHelper {
  private pool: Pool;

  constructor(config: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    this.pool = new Pool(config);
  }

  // Execute query
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const { rows } = await this.pool.query(sql, params);
    return rows;
  }

  // Close connection
  async close(): Promise<void> {
    await this.pool.end();
  }
}
