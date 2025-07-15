import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const db = await connectDB();
    const recipesCollection = db?.collection('recipes2');

    if (!recipesCollection) {
      throw new Error('Failed to connect to recipes2 collection');
    }

    const body = await req.json();

    // basic required field check
    if (!body.title || !body.description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }

    const result = await recipesCollection.insertOne({
      ...body,
    });

    return NextResponse.json(
      { message: 'Recipe created successfully', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 500 },
    );
  }
};
