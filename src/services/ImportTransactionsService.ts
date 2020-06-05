import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  transactionsFile: Buffer;
}

class ImportTransactionsService {
  public async execute({ transactionsFile }: Request): Promise<Transaction[]> {
    // const transactionsRepository = getRepository(Transaction);
    const createTransactionService = new CreateTransactionService();

    const rows = transactionsFile.toString().split('\n');
    rows.pop();
    rows.shift();
    const transactions = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const row of rows) {
      const [title, type, value, category] = row.split(', ');
      console.log({ title, value, type, category });
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
