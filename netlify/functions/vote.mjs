import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  try {
    const { video_id } = JSON.parse(req.body || '{}');
    if (!video_id) {
      return res.status(400).json({ success: false, error: 'video_id required' });
    }

    // upsert row and increment count
    const { data, error } = await supabase.rpc('increment_vote', { vid: video_id });
    if (error) throw error;

    return res.json({ success: true, new_vote_count: data?.count ?? null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
