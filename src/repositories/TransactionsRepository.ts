import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Transactions {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private transactions: Transaction[];

  constructor() {
    super();
    this.transactions = [];
  }

  public async getBalance(): Promise<Balance> {
    const balance: Balance = this.transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'income') {
          accumulator.income += currentValue.value;
          accumulator.total += currentValue.value;
        } else {
          accumulator.outcome += currentValue.value;
          accumulator.total -= currentValue.value;
        }

        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
