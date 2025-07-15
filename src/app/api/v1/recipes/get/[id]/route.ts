import { connectDB } from '@/lib/connectDB';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  const db = await connectDB();
  const recipesCollection = db?.collection('recipes2');

  if (!recipesCollection) {
    return NextResponse.json(
      { message: 'Database connection failed' },
      { status: 500 },
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid recipe ID' }, { status: 400 });
  }

  try {
    const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) });

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Recipe fetched successfully', res: recipe },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Error fetching recipe: ${err}` },
      { status: 500 },
    );
  }
};
