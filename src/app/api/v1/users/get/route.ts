import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const db = await connectDB();
  const productsCollection = db?.collection('users');

  if (!productsCollection) {
    throw new Error('Failed to connect to the database');
  }

  try {
    const products = await productsCollection.find().toArray();
    return NextResponse.json(
      { message: 'Get successfull', res: products },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Something went worng ${err}` },
      { status: 500 },
    );
  }
};
