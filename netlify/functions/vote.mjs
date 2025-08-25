import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { video_id } = JSON.parse(event.body || '{}');
    if (!Number.isInteger(video_id)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'INVALID_VIDEO_ID' }) };
    }

    // Fetch current count
    const { data: current, error: selErr } = await supabase
      .from('votes')
      .select('count')
      .eq('video_id', video_id)
      .single();

    if (selErr && selErr.code !== 'PGRST116') throw selErr; // ignore "no rows" error

    let newCount = 1;

    if (current) {
      const { data: updated, error: updErr } = await supabase
        .from('votes')
        .update({ count: current.count + 1 })
        .eq('video_id', video_id)
        .select('count')
        .single();
      if (updErr) throw updErr;
      newCount = updated.count;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('votes')
        .insert({ video_id, count: 1 })
        .select('count')
        .single();
      if (insErr) throw insErr;
      newCount = inserted.count;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, new_vote_count: newCount }),
    };
  } catch (err) {
    console.error('vote function error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SERVER_ERROR' }) };
  }
};
