import { S3 } from 'aws-sdk';
export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const file_key =
      'uploads/' + Date.now().toString() + file.name.replace(' ', '-'); //uploads is the name of the folder inside s3

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log(
          'uploading to s3...',
          parseInt(((evt.loaded * 100) / evt.total).toString())
        ) + '%';
      })
      .promise();

    await upload.then((data) => {
      console.log('successfully uploaded to S3', file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (err) {
    console.log(err);
  }
}

export function getS3Url(file_key: string) {
  //publically accessible url to embed pdf in chat
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
