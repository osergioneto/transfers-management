import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';

const upload = multer({ storage: multer.memoryStorage() });

const transactionsRouter = Router();

transactionsRouter.get('/', async (_request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balancePromise = transactionsRepository.getBalance();
    const transactionsPromise = transactionsRepository.find({
      relations: ['category'],
    });

    const [balance, transactions] = await Promise.all([
      balancePromise,
      transactionsPromise,
    ]);

    return response.status(200).json({ transactions, balance });
  } catch (error) {
    throw new AppError(error.msg);
  }
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  try {
    const transaction = await createTransactionService.execute({
      title,
      value,
      type,
      category,
    });

    return response.status(200).json(transaction);
  } catch (error) {
    throw new AppError(error.msg);
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  try {
    const deletedTransaction = await deleteTransactionService.execute({ id });

    return response.status(200).json(deletedTransaction);
  } catch (error) {
    throw new AppError(error);
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { buffer: file } = request.file;

    const importTransactionService = new ImportTransactionsService();

    const transactions = await importTransactionService.execute({ file });

    return response.status(200).json(transactions);
  },
);

export default transactionsRouter;
