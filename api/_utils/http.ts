import { NowRequest } from '@vercel/node';
import { Buffer } from 'buffer';

const getRawBody = async (readable: NowRequest): Promise<Buffer> => {
  const chunks: any[] = [];
  let bytes = 0;

  return new Promise((resolve, reject) => {
    readable.on('error', reject);

    readable.on('data', chunk => {
      chunks.push(chunk);
      bytes += chunk.length;
    });

    readable.on('end', () => {
      resolve(Buffer.concat(chunks, bytes));
    });
  });
};

export default getRawBody;
