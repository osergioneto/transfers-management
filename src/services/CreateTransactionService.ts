import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  value: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private transactionsRepository = new TransactionsRepository();

  private async hasFund(value: number): Promise<void> {
    const { total } = await this.transactionsRepository.getBalance();

    if (value > total) {
      throw new AppError("You can't create a outcome without a valid balance.");
    }
  }

  public async execute({ value, type, title }: Request): Promise<Transaction> {
    if (type === 'outcome') {
      this.hasFund(value);
    }

    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
