export enum TransactionType {
    Withdrawal = "withdrawal",
    Deposit = "deposit"
}

export interface Transaction {
    id: number;
    account_id: number;
    amount: number;
    description: string | null;
    created_at: Date;

}
