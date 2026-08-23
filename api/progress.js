// A small serverless function that stores/retrieves one JSON blob per
// Family Code, using Vercel Blob storage. Requires a Blob store connected
// to the project in the Vercel dashboard (one click - see README), which
// auto-injects the BLOB_READ_WRITE_TOKEN this relies on.
import { put, list } from "@vercel/blob";

export default async function handler(request) {
  const url = new URL(request.url);

  try {
    if (request.method === "GET") {
      const code = url.searchParams.get("code");
      if (!code) {
        return Response.json({ error: "missing code" }, { status: 400 });
      }
      const { blobs } = await list({ prefix: `progress/${code}.json` });
      if (!blobs.length) {
        return Response.json({ data: null }, { status: 200 });
      }
      const fileRes = await fetch(blobs[0].url);
      const data = await fileRes.json();
      return Response.json({ data }, { status: 200 });
    }

    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return Response.json({ error: "invalid json" }, { status: 400 });
      }
      const { code, data } = body || {};
      if (!code) {
        return Response.json({ error: "missing code" }, { status: 400 });
      }
      await put(`progress/${code}.json`, JSON.stringify(data), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return Response.json({ ok: true }, { status: 200 });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({ error: String(e && e.message ? e.message : e) }, { status: 500 });
  }
}
