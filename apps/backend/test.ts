import { MongoClient } from 'mongodb';

import 'dotenv/config';

async function main() {
  const cachedClient = await MongoClient.connect(
    'mongodb+srv://hlynkao:treemay3may@treemay.ycpdw9g.mongodb.net/?retryWrites=true&w=majority&appName=treemay',
  );

  const db = cachedClient.db(process.env.DB_NAME!);

  const t = await db.collection('items').countDocuments();

  console.log(t);
}

void main();
