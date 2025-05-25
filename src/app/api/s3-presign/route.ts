import { NextRequest, NextResponse } from 'next/server';
import { S3 } from 'aws-sdk';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json();
    const s3 = new S3({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      signatureVersion: 'v4',
    });

    const fileKey = `uploads/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: fileKey,
      Expires: 60, // URL valid for 1 minute
      ContentType: fileType,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return NextResponse.json({ uploadUrl, fileKey });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to generate pre-signed URL', details: err },
      { status: 500 }
    );
  }
}
