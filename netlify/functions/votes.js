export const handler = async () => {
  // If you add/remove videos, change this list:
  const ids = [1,2,3,4,5,6,7,8,9,10,11];

  // Upstash REST GET for each key: GET /get/<key>
  const results = await Promise.all(ids.map(async (id) => {
    const res = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/votes:${id}`,
      { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
    );
    const data = await res.json().catch(() => ({}));
    const n = Number(data.result ?? 0);
    return [id, Number.isFinite(n) ? n : 0];
  }));

  const votes = Object.fromEntries(results);
  return json(200, { success: true, votes });
};

const json = (status, body) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});
