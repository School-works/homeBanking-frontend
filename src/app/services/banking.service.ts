import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Account {
  id: number;
  owner_name: string;
  currency: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string | null;
  created_at: string;
}

export interface BalanceData {
  account_id: number;
  balance: number;
}

export interface Conversion {
  account_id: number;
  original_balance: number;
  converted_balance: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class BankingService {
  private baseUrl = 'http://localhost';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http
      .get<{ accounts: Account[]; count: number } | Account[]>(`${this.baseUrl}/accounts`)
      .pipe(map((data) => (Array.isArray(data) ? data : data.accounts)));
  }

  getAccount(accountId: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${accountId}`);
  }

  getTransactions(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/accounts/${accountId}/transactions`);
  }

  getTransaction(accountId: number, transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }

  getBalance(accountId: number): Observable<BalanceData> {
    return this.http.get<BalanceData>(`${this.baseUrl}/accounts/${accountId}/balance`);
  }

  convertFiat(accountId: number, to: string): Observable<Conversion> {
    return this.http.get<Conversion>(`${this.baseUrl}/accounts/${accountId}/balance/convert/fiat?to=${to}`);
  }

  convertCrypto(accountId: number, to: string): Observable<Conversion> {
    return this.http.get<Conversion>(`${this.baseUrl}/accounts/${accountId}/balance/convert/crypto?to=${to}`);
  }

  deposit(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/accounts/${accountId}/deposits`, { amount, description });
  }

  withdraw(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/accounts/${accountId}/withdrawals`, { amount, description });
  }

  editDescription(accountId: number, transactionId: number, description: string): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`, { description });
  }

  deleteTransaction(accountId: number, transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }
}