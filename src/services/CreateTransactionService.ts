import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

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
  private transactionsRepository = getCustomRepository(TransactionsRepository);

  private categoryRepository = getRepository(Category);

  private async hasFund(value: number): Promise<void> {
    const { total } = await this.transactionsRepository.getBalance();

    if (value > total) {
      throw new AppError("You can't create a outcome without a valid balance.");
    }
  }

  public async execute({
    value,
    type,
    title,
    category,
  }: Request): Promise<Transaction> {
    try {
      if (type === 'outcome') {
        this.hasFund(value);
      }

      let categoryExists = await this.categoryRepository.findOne({
        where: { title: category },
      });
      if (!categoryExists) {
        categoryExists = await this.categoryRepository.save({
          title: category,
        });
      }

      return this.transactionsRepository.save({
        title,
        value,
        type,
        category: categoryExists,
      });
    } catch (error) {
      throw new AppError(error);
    }
  }
}

export default CreateTransactionService;
