import { connectDB } from '@/lib/connectDB';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { recipeId } = await req.json();

    if (!recipeId || !ObjectId.isValid(recipeId)) {
      return NextResponse.json(
        { message: 'Invalid recipe ID' },
        { status: 400 },
      );
    }

    const db = await connectDB();
    const recipesCollection = db?.collection('recipes2');

    if (!recipesCollection) {
      throw new Error('DB connection failed');
    }

    const result = await recipesCollection.deleteOne({
      _id: new ObjectId(recipeId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Recipe deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Delete failed: ${error}` },
      { status: 500 },
    );
  }
}
