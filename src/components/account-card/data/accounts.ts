import { Account } from '../../../models/account';

export const accounts: Account[] = [
  {
    id: 1,
    owner_name: 'Alice Rossi',
    currency: 'EUR',
    created_at: new Date('2024-05-01'),
    transactions: [
      {
        id: 1,
        account_id: 1,
        amount: -42.5,
        description: 'ATM withdrawal',
        created_at: new Date('2024-05-10'),
      },
      {
        id: 2,
        account_id: 1,
        amount: 1250,
        description: 'Salary deposit',
        created_at: new Date('2024-05-25'),
      },
    ],
  },
  {
    id: 2,
    owner_name: 'Marco Bianchi',
    currency: 'USD',
    created_at: new Date('2025-02-14'),
    transactions: [
      {
        id: 1,
        account_id: 2,
        amount: -75.99,
        description: 'Online shopping',
        created_at: new Date('2025-02-20'),
      },
      {
        id: 2,
        account_id: 2,
        amount: 540,
        description: 'Freelance payment',
        created_at: new Date('2025-02-28'),
      },
    ],
  },
  {
    id: 3,
    owner_name: 'Giulia Verdi',
    currency: 'GBP',
    created_at: new Date('2023-11-30'),
    transactions: [
      {
        id: 1,
        account_id: 3,
        amount: -15.5,
        description: 'Coffee shop',
        created_at: new Date('2023-12-02'),
      },
      {
        id: 2,
        account_id: 3,
        amount: 300,
        description: null,
        created_at: new Date('2024-01-05'),
      },
    ],
  },
];
