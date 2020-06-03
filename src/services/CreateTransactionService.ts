import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  private hasFund(value: number): void {
    const { total } = this.transactionsRepository.getBalance();

    if (value > total) {
      throw new AppError("You can't create a outcome without a valid balance.");
    }
  }

  public async execute(): Promise<Transaction> {
    if (type === 'outcome') {
      this.hasFund(value);
    }

    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
