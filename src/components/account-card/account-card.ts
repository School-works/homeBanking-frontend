import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Account } from '../../models/account';

@Component({
  standalone: true,
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-card.html',
  styleUrls: ['./account-card.css'],
})
export class AccountCard {
  @Input() account!: Account;
}
