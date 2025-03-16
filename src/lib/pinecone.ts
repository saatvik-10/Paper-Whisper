import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function loadS3ToPinecone(fileKey: string) {
  //get the pdf from s3
  console.log('downlaoding s3 file into the system');
  const file_name = await downloadFromS3(fileKey);

  if (!file_name) {
    throw new Error('Error in downloading file from s3');
  }

  const loader = new PDFLoader(file_name);
  const pages = await loader.load();
  return pages;
}
