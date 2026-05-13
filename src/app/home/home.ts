import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { accounts } from '../data/accounts';
import { AccountCard } from '../../components/account-card/account-card';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, AccountCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  protected accounts = accounts;
}
