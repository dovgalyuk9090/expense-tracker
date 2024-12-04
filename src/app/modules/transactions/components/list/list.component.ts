import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { BalanceDisplayComponent } from '../balance-display/balance-display.component';
import { AddTransactionModalComponent } from '../add-transaction-modal/add-transaction-modal.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionInterface } from '../../interfaces/transaction.interface';
import { TransactionService } from '../../services/transaction.service';
import { MatSelectModule } from '@angular/material/select';
import { TransactionsFiltersComponent } from '../transactions-filters/transactions-filter.component';
import { FiltersInterface } from '../../interfaces/filters.interface';
import {
  DEFAULT_BOOK_COLUMNS,
  TransactionsTableColumnsType,
} from '../../types/transactions-table-columns.type';

@Component({
  selector: 'et-list',
  imports: [
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    BalanceDisplayComponent,
    CurrencyPipe,
    DatePipe,
    TransactionsFiltersComponent,
  ],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: TransactionsTableColumnsType[] = DEFAULT_BOOK_COLUMNS;
  transactionsDataSource: MatTableDataSource<TransactionInterface> =
    new MatTableDataSource<TransactionInterface>([]);
  categories: string[] = [];

  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setTransactionsDataSource();
  }

  ngAfterViewInit(): void {
    this.transactionsDataSource.paginator = this.paginator;
    this.transactionsDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddTransactionModal(): void {
    const dialogRef = this.dialog.open(AddTransactionModalComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.transactionService.addTransaction(result);
          this.updateSortingAndPaginator();
        }
      });
  }

  setTransactionsDataSource(): void {
    this.transactionService.transactions$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error fetching transactions:', error);
          return of([]);
        }),
      )
      .subscribe((data: TransactionInterface[]) => {
        this.transactionsDataSource.data = data;
        this.categories = this.getUniqueCategories(data);
      });
  }

  onFilterChange(filter: FiltersInterface): void {
    this.transactionsDataSource.filterPredicate = (data) => {
      const matchesType = filter.type ? data.type === filter.type : true;
      const matchesCategory = filter.category ? data.category === filter.category : true;
      const matchesSearch = filter.search
        ? data.name.toLowerCase().includes(filter.search.toLowerCase())
        : true;

      return matchesType && matchesCategory && matchesSearch;
    };

    this.transactionsDataSource.filter = JSON.stringify(filter);
  }

  private getUniqueCategories(transactions: TransactionInterface[]): string[] {
    return [...new Set(transactions.map((transaction) => transaction.category))];
  }

  private updateSortingAndPaginator(): void {
    this.transactionsDataSource.paginator = this.paginator;
    this.transactionsDataSource.sort = this.sort;
  }
}
