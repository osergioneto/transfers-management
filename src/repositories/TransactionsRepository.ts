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
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = transactions.reduce(
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
}

export default TransactionsRepository;
