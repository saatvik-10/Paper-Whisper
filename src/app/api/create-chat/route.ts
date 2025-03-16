import { loadS3ToPinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    const pages = await loadS3ToPinecone(file_key);
    return NextResponse.json({ pages });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
  }
}
