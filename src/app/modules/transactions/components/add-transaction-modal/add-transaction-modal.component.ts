import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionFormInterface } from '../../interfaces/form.interface';
import { TransactionType } from '../../types/transaction.type';

@Component({
  selector: 'et-add-transaction-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    CommonModule,
  ],
  templateUrl: './add-transaction-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTransactionModalComponent {
  transactionForm: FormGroup<TransactionFormInterface>;

  constructor(
    private fb: NonNullableFormBuilder,
    private dialogRef: MatDialogRef<AddTransactionModalComponent>,
  ) {
    this.transactionForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      amount: this.fb.control(0, [Validators.required, Validators.min(0.01)]),
      type: this.fb.control<TransactionType>('income', Validators.required),
      category: this.fb.control('', Validators.required),
      date: this.fb.control(new Date().toISOString().split('T')[0], Validators.required),
    });
  }

  addTransaction(): void {
    if (this.transactionForm.valid) {
      this.dialogRef.close(this.transactionForm.value);
    }
  }
}
