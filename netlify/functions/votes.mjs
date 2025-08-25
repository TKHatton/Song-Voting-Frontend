import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const handler = async () => {
  try {
    // read all vote rows and turn into { [videoId]: count }
    const { data, error } = await supabase
      .from('votes')
      .select('video_id, count');

    if (error) throw error;

    const result = {};
    (data || []).forEach(r => { result[r.video_id] = r.count; });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, votes: result }),
    };
  } catch (err) {
    console.error('votes function error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SERVER_ERROR' }) };
  }
};
