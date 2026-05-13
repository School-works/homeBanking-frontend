import { Transaction } from './transaction';

export interface Account {
  id: number;
  owner_name: string;
  currency: string;
  created_at: Date;
  transactions?: Transaction[];
}