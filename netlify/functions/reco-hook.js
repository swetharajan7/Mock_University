// /netlify/functions/reco-hook.js
import { createClient } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const blobs = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const body = await req.json().catch(() => ({}));

  // Minimal schema we expect from StellarRec
  const {
    external_id,            // shared key across both steps
    student_name,
    student_email,
    recommender_name,
    recommender_email,
    universities = [],      // array of { unitid, name }
    status,                 // 'pending' | 'sent' | 'completed'
    artifact_url = '',      // pdf/txt/mp4 once completed
    ts = Date.now(),
  } = body;

  if (!external_id) return new Response('external_id required', { status: 400 });

  // Use one blob per recommendation
  const key = `recs/${external_id}.json`;
  const existing = await blobs.get(key).then(r => r?.body ? r.json() : null).catch(() => null);

  const record = {
    ...(existing || {}),
    external_id,
    student_name,
    student_email,
    recommender_name,
    recommender_email,
    universities,
    status,       // overwrite step-wise
    artifact_url, // may be empty until completion
    updated_at: ts,
    created_at: existing?.created_at || ts,
  };

  await blobs.setJSON(key, record);
  return Response.json({ ok: true, record });
};