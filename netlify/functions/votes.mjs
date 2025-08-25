import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('video_id,count');

    if (error) throw error;

    const map = {};
    (data || []).forEach(row => { map[row.video_id] = row.count; });
    return res.json({ success: true, votes: map });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, votes: {} });
  }
};
