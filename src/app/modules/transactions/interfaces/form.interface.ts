import { FormControl } from '@angular/forms';
import { TransactionType } from '../types/transaction.type';

export interface TransactionFormInterface {
  name: FormControl<string>;
  amount: FormControl<number>;
  type: FormControl<TransactionType>;
  category: FormControl<string>;
  date: FormControl<string>;
}

export interface FilterFormInterface {
  type: FormControl<string | null>;
  search: FormControl<string | null>;
}
