import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AccountCard } from '../account-card';
import { BankingService, Account } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, AccountCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  protected accounts: Account[] = [];
  protected loading = true;
  protected error: string | null = null;

  private sub?: Subscription;

  constructor(
    private banking: BankingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  // Carica i conti dall'API e aggiorna la vista
  protected load(): void {
    this.loading = true;
    this.error = null;
    this.sub?.unsubscribe();

    this.sub = this.banking.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento dei conti:', err);
        this.error = 'Impossibile caricare i conti. Il server è in esecuzione?';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}