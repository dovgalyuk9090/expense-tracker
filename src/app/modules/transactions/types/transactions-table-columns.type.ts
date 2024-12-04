export type TransactionsTableColumnsType =
  | 'name'
  | 'amount'
  | 'type'
  | 'category'
  | 'date';

export const DEFAULT_BOOK_COLUMNS: TransactionsTableColumnsType[] = [
  'name',
  'amount',
  'type',
  'category',
  'date',
];
