import { getRepository, DeleteResult } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<DeleteResult> {
    try {
      const transactionRepository = getRepository(Transaction);

      const deletedTransaction = await transactionRepository.delete({ id });

      return deletedTransaction;
    } catch (error) {
      throw new AppError(error);
    }
  }
}

export default DeleteTransactionService;
