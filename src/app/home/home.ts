import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/account';
import { AccountCard } from '../../components/account-card/account-card';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, AccountCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  protected readonly accounts: Account[] = [
    {
      id: 1,
      owner_name: 'Alice Rossi',
      currency: 'EUR',
      created_at: new Date('2024-05-01'),
    },
    {
      id: 2,
      owner_name: 'Marco Bianchi',
      currency: 'USD',
      created_at: new Date('2025-02-14'),
    },
    {
      id: 3,
      owner_name: 'Giulia Verdi',
      currency: 'GBP',
      created_at: new Date('2023-11-30'),
    },
  ];
}
