import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';

const transactionsRouter = Router();

transactionsRouter.get('/', async (_request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    return response.status(200).json(balance);
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

transactionsRouter.delete('/:id', async (_request, _response) => {
  // TODO
});

transactionsRouter.post('/import', async (_request, _response) => {
  // TODO
});

export default transactionsRouter;
