import { Timestamp } from "firebase/firestore";

/**
 * Base interface for shared fields between Sale and Expense
 */
interface BaseTransaction {
  id: string;               // Firestore document ID
  amount: number;           // Transaction amount
  date: string;             // ISO string format 'YYYY-MM-DD'
  userId: string;           // Authenticated user's ID
  timestamp: Timestamp;     // Firestore Timestamp for sorting
}

/**
 * Predefined expense categories
 */
export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Utilities"
  | "Shopping"
  | "Entertainment"
  | "Rent"
  | "Payroll"
  | "Supplies"
  | "Marketing"
  | "Other";

/**
 * Represents a Sale transaction
 * Discriminant property 'type' ensures type distinction
 */
export interface Sale extends BaseTransaction {
  type: "sale";
}

/**
 * Represents an Expense transaction
 * Discriminant property 'type' ensures type distinction
 */
export interface Expense extends BaseTransaction {
  type: "expense";
  category: ExpenseCategory;
}

/**
 * Chart data point for weekly sales/expenses
 */
export interface ChartDataPoint {
  year: number;             // Year of the week
  month: number;            // Month number (1-12)
  week: number;             // Week number (1-52/53)
  amount: number;           // Total amount for that week
}

/**
 * Aggregated expense by category
 */
export interface ExpenseCategoryData {
  name: ExpenseCategory;    // Category name
  value: number;            // Total amount spent
}

/**
 * Utility type for any transaction
 */
export type Transaction = Sale | Expense;
