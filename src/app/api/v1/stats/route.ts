import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const db = await connectDB();
  const recipesCollection = db?.collection('recipes2');
  const usersCollection = db?.collection('users');

  if (!recipesCollection || !usersCollection) {
    throw new Error('Failed to connect to the database');
  }

  try {
    // Get total counts
    const totalUsers = await usersCollection.countDocuments();
    const totalRecipes = await recipesCollection.countDocuments();
    const totalPending = await recipesCollection.countDocuments({
      status: 'pending',
    });
    const totalAdmin = await usersCollection.countDocuments({ role: 'admin' });
    const totalRegular = await usersCollection.countDocuments({ role: 'user' });

    return NextResponse.json(
      {
        message: 'Stats fetch successful',
        stats: {
          totalUsers,
          totalAdmin,
          totalRegular,
          totalRecipes,
          totalPending,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Something went wrong: ${err}` },
      { status: 500 },
    );
  }
};
