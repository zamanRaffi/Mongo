import { embeddingQueue } from '../../../../lib/queue.js';

export async function GET() {
  try {
    const counts = await embeddingQueue.getJobCounts();
    return new Response(JSON.stringify({ counts }), { status: 200 });
  } catch (err) {
    console.error('Job status error', err);
    return new Response(JSON.stringify({ error: 'failed to get job counts' }), { status: 500 });
  }
}
