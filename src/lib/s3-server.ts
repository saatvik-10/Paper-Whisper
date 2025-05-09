import * as fs from 'fs';
import { S3 } from 'aws-sdk';

export async function downloadFromS3(file_key: string) {
  try {
    const s3 = new S3({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params).promise();
    const file_name = `/tmp/pdf;${Date.now().toString()}.pdf`; //save the file in tmp folder
    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (err) {
    return null;
  }
}
