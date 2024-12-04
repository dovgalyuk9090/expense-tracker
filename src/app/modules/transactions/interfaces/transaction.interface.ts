import { TransactionType } from '../types/transaction.type';

export interface TransactionInterface {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}
