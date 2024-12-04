import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TransactionService } from '../../services/transaction.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'et-balance-display',
  imports: [MatToolbarModule, CurrencyPipe, MatCardModule],
  templateUrl: './balance-display.component.html',
})
export class BalanceDisplayComponent implements OnInit, OnDestroy {
  balance: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getBalance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getBalance(): void {
    this.transactionService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        this.balance = income - expense;
      });
  }
}
