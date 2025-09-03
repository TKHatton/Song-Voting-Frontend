import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE, // your backend/service key
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { video_id } = JSON.parse(event.body || '{}');

    if (!Number.isInteger(video_id)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'INVALID_VIDEO_ID' })
      };
    }

    // Best-effort IP detection on Netlify
    const ipAddress =
      event.headers['x-nf-client-connection-ip'] ||
      event.headers['client-ip'] ||
      (event.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
      event.headers['x-real-ip'] ||
      '0.0.0.0';

    // Check last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: recent, error: checkErr } = await supabase
      .from('vote_history')
      .select('id')
      .eq('video_id', video_id)
      .eq('ip_address', ipAddress)
      .gte('voted_at', since)
      .maybeSingle(); // null when none

    if (checkErr) throw checkErr;

    if (recent) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'ALREADY_VOTED_TODAY' })
      };
    }

    // Record history
    const { error: historyErr } = await supabase
      .from('vote_history')
      .insert({ video_id, ip_address: ipAddress });

    if (historyErr) throw historyErr;

    // Atomic increment via SQL function
    const { data: rpcData, error: rpcErr } = await supabase.rpc('increment_vote', { p_video_id: video_id });
    if (rpcErr) throw rpcErr;

    // Supabase returns the count; normalize in case it comes back as an array
    const newCount = Array.isArray(rpcData) ? rpcData[0] : rpcData;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, new_vote_count: newCount })
    };
  } catch (err) {
    console.error('vote function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'SERVER_ERROR' })
    };
  }
};
