import * as readline from 'readline';
import { Operation } from './types';
import calculateTaxes from './calculator';

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  try {
    for await (const line of rl) {
      if (line.trim() === '') {
        break;
      }

      try {
        const operations: Operation = JSON.parse(line);

        if (!Array.isArray(operations)) {
          console.log('[]');
          continue;
        }

        const results = calculateTaxes(operations);
        console.log(JSON.stringify(results));
      } catch (error) {
        console.log('[]');
      }
    }
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main().catch(error => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Fatal error...: ', error);
    }
    process.exit(1);
  })
}

export { main };