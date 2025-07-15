import { connectDB } from '@/lib/connectDB';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const db = await connectDB();
    const usersCollection = db?.collection('users');
    const { id } = await context.params;

    if (!usersCollection) {
      throw new Error('DB connection failed');
    }

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Delete failed: ${error}` },
      { status: 500 },
    );
  }
}
