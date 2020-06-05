import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  file: Buffer;
}

class ImportTransactionsService {
  public async execute({ file }: Request): Promise<Transaction[]> {
    // const transactionsRepository = getRepository(Transaction);
    const createTransactionService = new CreateTransactionService();

    const rows = file.toString().split('\n');
    rows.pop();
    rows.shift();
    const transactions = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const row of rows) {
      const [title, type, value, category] = row.split(', ');
      const savedTransaction = await createTransactionService.execute({
        title,
        value: Number(value),
        type: type as 'income' | 'outcome',
        category,
      });

      transactions.push(savedTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
