import { Pinecone } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embeddings';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index('paper-whisper');
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryRequest = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryRequest.matches || [];
  } catch (err) {
    console.log('error querying embeddings', err);
    throw err;
  }
}

export async function getContext(query: string, fileKey: string) {
  console.log('🧠 Getting context for query:', query);
  const queryEmbeddings = await getEmbeddings(query);
  console.log('🔢 Embeddings:', queryEmbeddings?.slice(0, 5));

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log('📚 Matches found:', matches.length);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.1
  );
  console.log('✅ Qualifying docs:', qualifyingDocs.length);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  const res = docs.join('\n').substring(0, 3000);
  console.log('📄 Final context length:', res.length);

  return res;
}
