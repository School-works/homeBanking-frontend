import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankingService, Account } from '../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-card.html',
  styleUrls: ['./account-card.css'],
})
export class AccountCard implements OnInit, OnDestroy {
  @Input() account!: Account;

  protected balance = 0;
  protected menuOpen = false;

  private subs: Subscription[] = [];

  constructor(private banking: BankingService) {}

  ngOnInit(): void {
    // Carica il saldo del conto all'avvio
    const sub = this.banking.getBalance(this.account.id).subscribe({
      next: (data) => this.balance = data.balance,
      error: () => this.balance = 0,
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // Chiude il menu se si clicca fuori dalla card
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-account-card')) {
      this.menuOpen = false;
    }
  }
}