import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankingService, Account } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-deposit',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './deposit.html',
  styleUrls: ['./deposit.css'],
})
export class Deposit implements OnInit, OnDestroy {
  protected account?: Account;
  protected amount: number | null = null;
  protected description = '';
  protected error: string | null = null;
  protected success: string | null = null;
  protected submitting = false;

  private accountId!: number;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private banking: BankingService,
    private cdr: ChangeDetectorRef,
  ) {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    const sub = this.banking.getAccount(this.accountId).subscribe({
      next: (account) => { this.account = account; this.cdr.detectChanges(); },
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // Invia il deposito all'API
  protected submit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = "L'importo deve essere un numero positivo.";
      return;
    }
    if (!this.description.trim()) {
      this.error = 'La descrizione è obbligatoria.';
      return;
    }

    this.error = null;
    this.success = null;
    this.submitting = true;

    const sub = this.banking.deposit(this.accountId, this.amount, this.description).subscribe({
      next: (t) => {
        this.success = `Deposito di ${t.amount} ${this.account?.currency} registrato con successo.`;
        this.amount = null;
        this.description = '';
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Deposito fallito.';
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
    this.subs.push(sub);
  }
}