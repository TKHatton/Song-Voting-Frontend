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
    
    // Get IP address from request headers
    const ip_address = event.headers['x-forwarded-for'] || 
                      event.headers['x-real-ip'] || 
                      event.headers['client-ip'] || 
                      '0.0.0.0';
    
    if (!Number.isInteger(video_id)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'INVALID_VIDEO_ID' }) };
    }

    // Check if this IP has voted for this video in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentVote, error: checkError } = await supabase
      .from('vote_history')
      .select('id')
      .eq('video_id', video_id)
      .eq('ip_address', ip_address)
      .gte('voted_at', twentyFourHoursAgo)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError; // Only throw if it's not a "no rows" error
    }

    if (recentVote) {
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'ALREADY_VOTED_TODAY' }) 
      };
    }

    // Record the vote in history
    const { error: historyError } = await supabase
      .from('vote_history')
      .insert({ video_id, ip_address });

    if (historyError) throw historyError;

    // Update vote totals (existing logic)
    const { data: current, error: selErr } = await supabase
      .from('votes')
      .select('count')
      .eq('video_id', video_id)
      .single();

    if (selErr && selErr.code !== 'PGRST116') throw selErr;

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