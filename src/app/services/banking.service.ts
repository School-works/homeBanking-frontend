import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// ── Interfacce che rispecchiano la struttura del DB ──────────

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

// ── Servizio principale per le chiamate API ──────────────────

@Injectable({ providedIn: 'root' })
export class BankingService {
  private baseUrl = 'http://localhost';

  constructor(private http: HttpClient) {}

  // Recupera tutti i conti dal DB
  getAccounts(): Observable<Account[]> {
    return this.http
      .get<{ accounts: Account[]; count: number } | Account[]>(`${this.baseUrl}/accounts`)
      .pipe(map((data) => (Array.isArray(data) ? data : data.accounts)));
  }

  // Recupera un singolo conto per ID
  getAccount(accountId: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${accountId}`);
  }

  // Recupera tutte le transazioni di un conto
  getTransactions(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/accounts/${accountId}/transactions`);
  }

  // Recupera una singola transazione
  getTransaction(accountId: number, transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }

  // Recupera il saldo calcolato dal DB
  getBalance(accountId: number): Observable<BalanceData> {
    return this.http.get<BalanceData>(`${this.baseUrl}/accounts/${accountId}/balance`);
  }

  // Converte il saldo in valuta fiat (es. EUR → USD)
  convertFiat(accountId: number, to: string): Observable<Conversion> {
    return this.http.get<Conversion>(`${this.baseUrl}/accounts/${accountId}/balance/convert/fiat?to=${to}`);
  }

  // Converte il saldo in criptovaluta (es. EUR → BTC)
  convertCrypto(accountId: number, to: string): Observable<Conversion> {
    return this.http.get<Conversion>(`${this.baseUrl}/accounts/${accountId}/balance/convert/crypto?to=${to}`);
  }

  // Registra un deposito
  deposit(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/accounts/${accountId}/deposits`, { amount, description });
  }

  // Registra un prelievo
  withdraw(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/accounts/${accountId}/withdrawals`, { amount, description });
  }

  // Modifica la descrizione di una transazione
  editDescription(accountId: number, transactionId: number, description: string): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`, { description });
  }

  // Elimina una transazione
  deleteTransaction(accountId: number, transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }
}