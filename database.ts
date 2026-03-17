import * as SQLite from 'expo-sqlite';
import { deobfuscateTransactionData } from './utils/deobfuscate';
import { logger } from './utils/logger';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string | null;
  category: string | null;
  date: string;
  created_at?: string;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

let db: SQLite.SQLiteDatabase | null = null;
let dbInitialized = false;
let initPromise: Promise<void> | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('expense.db');
  }
  // Ensure database is initialized before returning
  if (!dbInitialized && !initPromise) {
    await initDatabase();
  } else if (initPromise) {
    await initPromise;
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  if (dbInitialized) {
    return; // Already initialized
  }
  if (initPromise) {
    return initPromise; // Return existing promise if initialization is in progress
  }
  
  initPromise = (async () => {
    try {
      // Get database connection first
      if (!db) {
        db = await SQLite.openDatabaseAsync('expense.db');
      }
      // Then create tables
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          description TEXT,
          category TEXT,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
      dbInitialized = true;
      logger.log('Database initialized');
    } catch (error) {
      logger.error('Database initialization error:', error);
      initPromise = null; // Reset on error
      throw error;
    }
  })();
  
  return initPromise;
};

export const addTransaction = async (
  type: 'income' | 'expense',
  amount: number,
  description: string | null,
  category: string | null,
  date: string
): Promise<number> => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO transactions (type, amount, description, category, date) VALUES (?, ?, ?, ?, ?);',
      [type, amount, description || '', category || '', date]
    );
    return result.lastInsertRowId;
  } catch (error) {
    logger.error('Add transaction error:', error);
    throw error;
  }
};

export const getAllTransactions = async (
  deobfuscate: boolean = false,
  deobfuscationMethod: 'auto' | 'base64' | 'hex' | 'url' | 'rot13' | 'reverse' | 'caesar' | 'xor' = 'auto',
  deobfuscationOptions?: { shift?: number; key?: string }
): Promise<Transaction[]> => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync<Transaction>(
      'SELECT * FROM transactions ORDER BY date DESC, created_at DESC;'
    );
    
    if (deobfuscate) {
      return result.map((transaction) => ({
        ...transaction,
        description: deobfuscateTransactionData(transaction.description, deobfuscationMethod, deobfuscationOptions),
        category: deobfuscateTransactionData(transaction.category, deobfuscationMethod, deobfuscationOptions),
      }));
    }
    
    return result;
  } catch (error) {
    logger.error('Get transactions error:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
  } catch (error) {
    logger.error('Delete transaction error:', error);
    throw error;
  }
};

export const getMonthlySummary = async (year: number, month: number): Promise<MonthlySummary> => {
  try {
    const database = await getDatabase();
    interface SummaryRow {
      type: string;
      total: number;
    }
    const result = await database.getAllAsync<SummaryRow>(
      `SELECT 
        type,
        SUM(amount) as total
      FROM transactions 
      WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
      GROUP BY type;`,
      [year.toString(), month.toString().padStart(2, '0')]
    );
    
    const summary: MonthlySummary = { income: 0, expense: 0, balance: 0 };
    result.forEach((row) => {
      if (row.type === 'income') {
        summary.income = row.total;
      } else {
        summary.expense = row.total;
      }
    });
    summary.balance = summary.income - summary.expense;
    return summary;
  } catch (error) {
    logger.error('Get monthly summary error:', error);
    throw error;
  }
};

export const getTransactionsByMonth = async (
  year: number,
  month: number,
  deobfuscate: boolean = false,
  deobfuscationMethod: 'auto' | 'base64' | 'hex' | 'url' | 'rot13' | 'reverse' | 'caesar' | 'xor' = 'auto',
  deobfuscationOptions?: { shift?: number; key?: string }
): Promise<Transaction[]> => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync<Transaction>(
      `SELECT * FROM transactions 
      WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
      ORDER BY date DESC, created_at DESC;`,
      [year.toString(), month.toString().padStart(2, '0')]
    );
    
    if (deobfuscate) {
      return result.map((transaction) => ({
        ...transaction,
        description: deobfuscateTransactionData(transaction.description, deobfuscationMethod, deobfuscationOptions),
        category: deobfuscateTransactionData(transaction.category, deobfuscationMethod, deobfuscationOptions),
      }));
    }
    
    return result;
  } catch (error) {
    logger.error('Get transactions by month error:', error);
    throw error;
  }
};

export const updateTransaction = async (
  id: number,
  type: 'income' | 'expense',
  amount: number,
  description: string | null,
  category: string | null,
  date: string
): Promise<void> => {
  try {
    const database = await getDatabase();
    await database.runAsync(
      'UPDATE transactions SET type = ?, amount = ?, description = ?, category = ?, date = ? WHERE id = ?;',
      [type, amount, description || '', category || '', date, id]
    );
  } catch (error) {
    logger.error('Update transaction error:', error);
    throw error;
  }
};

export const clearAllTransactions = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM transactions;');
  } catch (error) {
    logger.error('Clear all transactions error:', error);
    throw error;
  }
};

