import { Injectable } from '@angular/core';
import { TransactionInterface } from '../interfaces/transaction.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private storageKey = 'transactions';
  private transactions = new BehaviorSubject<TransactionInterface[]>(
    this.loadFromStorage(),
  );

  transactions$ = this.transactions.asObservable();

  addTransaction(transaction: Omit<TransactionInterface, 'id'>): void {
    const currentTransactions: TransactionInterface[] = this.transactions.value;
    const updatedTransactions = [
      ...currentTransactions,
      { ...transaction, id: currentTransactions.length + 1 },
    ];
    this.updateTransactions(updatedTransactions);
  }

  // ToDo: we also can add logic for delete or edit of some transaction
  deleteTransaction(id: number): void {
    const updatedTransactions = this.transactions.value.filter((txn) => txn.id !== id);
    this.updateTransactions(updatedTransactions);
  }

  private updateTransactions(transactions: TransactionInterface[]): void {
    this.transactions.next(transactions);
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  private loadFromStorage(): TransactionInterface[] {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }
}
