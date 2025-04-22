import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { loadS3ToPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { err: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    await loadS3ToPinecone(file_key);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        //after inserting, give back the ID of the new row
        insertedId: chats.id,
      });

    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Error in /api/create-chat:', err);
    return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
  }
}
