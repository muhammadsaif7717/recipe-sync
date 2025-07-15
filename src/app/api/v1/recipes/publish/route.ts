import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { recipeId } = await req.json();

    if (!recipeId) {
      return NextResponse.json(
        { message: 'Recipe ID is required' },
        { status: 400 },
      );
    }

    const db = await connectDB();
    const collection = db?.collection('recipes2');

    const result = await collection.updateOne(
      { _id: new ObjectId(recipeId) },
      {
        $set: {
          status: 'published',
          updatedAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'No recipe updated' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Recipe published successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
