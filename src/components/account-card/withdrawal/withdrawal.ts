import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankingService, Account } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-withdrawal',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './withdrawal.html',
  styleUrls: ['./withdrawal.css'],
})
export class Withdrawal implements OnInit, OnDestroy {
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

  // Invia il prelievo all'API
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

    const sub = this.banking.withdraw(this.accountId, this.amount, this.description).subscribe({
      next: (t) => {
        this.success = `Prelievo di ${t.amount} ${this.account?.currency} registrato con successo.`;
        this.amount = null;
        this.description = '';
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Prelievo fallito. Saldo insufficiente?';
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
    this.subs.push(sub);
  }
}