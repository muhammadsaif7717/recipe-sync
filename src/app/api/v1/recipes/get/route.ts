import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const db = await connectDB();
  const productsCollection = db?.collection('recipes2');

  if (!productsCollection) {
    throw new Error('Failed to connect to the database');
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const filter: Partial<{ status: string }> = {};
  if (status) {
    filter.status = status;
  }

  try {
    const products = await productsCollection.find(filter).toArray();

    return NextResponse.json(
      { message: 'Get successful', res: products },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Something went wrong: ${err}` },
      { status: 500 },
    );
  }
};
