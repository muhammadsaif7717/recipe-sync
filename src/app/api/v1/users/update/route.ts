// /app/api/v1/users/update/route.ts

import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    const db = await connectDB();
    const usersCollection = db?.collection('users');

    if (!usersCollection) {
      throw new Error('Failed to connect to the database');
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'No user updated' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User role updated successfully' },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: `Error: ${err}` }, { status: 500 });
  }
}
