import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FiltersInterface } from '../../interfaces/filters.interface';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FilterFormInterface } from '../../interfaces/form.interface';

@Component({
  selector: 'et-transactions-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './transactions-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFiltersComponent implements OnInit, OnDestroy {
  @Input() categories: string[] = [];
  @Output() filterChange = new EventEmitter<FiltersInterface>();

  filterForm: FormGroup<FilterFormInterface>;
  filteredCategories: string[] = [];
  categorySearchControl: FormControl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      type: [''],
      search: [''],
    });
  }

  ngOnInit(): void {
    this.filteredCategories = this.categories;

    this.setFormListeners();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.categorySearchControl.reset('');
    this.filteredCategories = this.categories;
    this.emitFilterChange();
  }

  onCategorySelected(category: string): void {
    this.categorySearchControl.setValue(category);
    this.emitFilterChange();
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setFormListeners(): void {
    this.filterForm
      .get('search')!
      .valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilterChange();
      });

    this.filterForm
      .get('type')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilterChange();
      });

    this.categorySearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filteredCategories = this.categories.filter((category) =>
          category.toLowerCase().includes(value?.toLowerCase() || ''),
        );
      });
  }

  private emitFilterChange(): void {
    const { search, type } = this.filterForm.getRawValue();
    const category = this.categorySearchControl.value || '';
    this.filterChange.emit({ search: search || '', type: type || '', category });
  }
}
