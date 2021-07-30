import postgres from 'postgres';
import { config } from 'dotenv';
config();

const sql = postgres(process.env.DATABASE_URL!);

export default sql;
