import { db } from '../lib/firebase';
import { doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';

export interface UpdateTransactionData {
  amount?: number;
  date?: string;
  category?: string;
  timestamp?: Timestamp;
}

/**
 * Delete a sale transaction
 */
export const deleteSale = async (userId: string, saleId: string): Promise<void> => {
  try {
    const saleRef = doc(db, `users/${userId}/sales_log`, saleId);
    await deleteDoc(saleRef);
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw new Error('Failed to delete sale');
  }
};

/**
 * Delete an expense transaction
 */
export const deleteExpense = async (userId: string, expenseId: string): Promise<void> => {
  try {
    const expenseRef = doc(db, `users/${userId}/expenses_log`, expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete expense');
  }
};

/**
 * Update a sale transaction
 */
export const updateSale = async (
  userId: string,
  saleId: string,
  data: UpdateTransactionData
): Promise<void> => {
  try {
    const saleRef = doc(db, `users/${userId}/sales_log`, saleId);
    const updateData = {
      ...data,
      timestamp: Timestamp.now(),
    };
    await updateDoc(saleRef, updateData);
  } catch (error) {
    console.error('Error updating sale:', error);
    throw new Error('Failed to update sale');
  }
};

/**
 * Update an expense transaction
 */
export const updateExpense = async (
  userId: string,
  expenseId: string,
  data: UpdateTransactionData
): Promise<void> => {
  try {
    const expenseRef = doc(db, `users/${userId}/expenses_log`, expenseId);
    const updateData = {
      ...data,
      timestamp: Timestamp.now(),
    };
    await updateDoc(expenseRef, updateData);
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new Error('Failed to update expense');
  }
};