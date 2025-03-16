import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import {
  Document,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter';

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

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
  const pages = (await loader.load()) as PDFPage[];

  //splitting the pdf into pages
  const document = await Promise.all(pages.map(prepareDocument));

  //vector and embed the docs
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ''); //regex to remove new lines with empty string

  //split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        loc: {
          pageNumber: metadata.loc.pageNumber,
          text: TruncateStringByBytes(pageContent, 36000),
        },
      },
    }),
  ]);
  return docs;
}

// async function embedDocument(docs: Document[]) {

// }

export const TruncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
};
