export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors(), body: "Method Not Allowed" };
  }

  const { video_id } = JSON.parse(event.body || "{}");
  if (!video_id) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: "video_id required" }) };
  }

  // Atomic increment: INCRBY votes:<id> 1
  const res = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/incrby/votes:${video_id}/1`,
    { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
  );
  const data = await res.json();
  const newCount = Number(data.result ?? 0);

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ success: true, new_vote_count: newCount }),
  };
};

const cors = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
});
