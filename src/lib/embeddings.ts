import {OpenAIApi, Configuration} from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const res = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    });
    const result = await res.json();
    if (!result.data || !result.data[0]) {
      throw new Error('Invalid response structure');
    }
    return result.data[0].embedding as number[];
  } catch (err) {
    throw err;
  }
}
