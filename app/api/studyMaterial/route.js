import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import StudyMaterial from '../../../models/studyMaterialTable';

// POST: Create a new study material document.
export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const newMaterial = await StudyMaterial.create(data);
    return NextResponse.json(newMaterial, { status: 200 });
  } catch (error) {
    console.error('Error creating study material:', error);
    return NextResponse.json(
      { message: 'Error creating study material', error: error.message },
      { status: 500 }
    );
  }
}