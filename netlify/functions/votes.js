import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const json = (status, body) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const handler = async () => {
  const { data, error } = await supabase
    .from('votes')
    .select('video_id,count')
    .order('video_id', { ascending: true });

  if (error) return json(500, { success: false, error: error.message });

  const votes = {};
  for (const row of data || []) votes[row.video_id] = row.count;

  return json(200, { success: true, votes });
};
