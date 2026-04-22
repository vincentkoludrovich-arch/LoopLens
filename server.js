import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const staticFiles = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/app.js", "app.js"],
  ["/PROJECT_BRIEF.md", "PROJECT_BRIEF.md"],
]);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    status: { type: "string" },
    description: { type: "string" },
    path: { type: "string" },
    risk: { type: "string" },
    diversion: { type: "string" },
    savings: { type: "string" },
    impactSummary: { type: "string" },
    actionSummary: { type: "string" },
    reasoningSummary: { type: "string" },
    confidenceSummary: { type: "string" },
    chartCaption: { type: "string" },
    scanSignal: { type: "string" },
    scanConfidence: { type: "string" },
    mistakes: {
      type: "array",
      items: { type: "string" },
    },
    signage: {
      type: "array",
      items: { type: "string" },
    },
    bars: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "integer" },
        after: { type: "integer" },
        avoided: { type: "integer" },
      },
      required: ["before", "after", "avoided"],
    },
  },
  required: [
    "title",
    "status",
    "description",
    "path",
    "risk",
    "diversion",
    "savings",
    "impactSummary",
    "actionSummary",
    "reasoningSummary",
    "confidenceSummary",
    "chartCaption",
    "scanSignal",
    "scanConfidence",
    "mistakes",
    "signage",
    "bars",
  ],
};

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function callOpenAI(payload) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "Set OPENAI_API_KEY and run the site from the local server to enable live AI analysis."
    );
  }

  const userContent = [
    {
      type: "input_text",
      text:
        "Analyze this campus recycling situation and produce operational guidance. " +
        `Location: ${payload.location}. Zone: ${payload.zoneLabel}. Item: ${payload.itemType}. ` +
        `Material: ${payload.materialLabel}. Residue: ${payload.residueLabel}. Weekly volume: ${payload.volume}.`,
    },
  ];

  if (payload.imageDataUrl) {
    userContent.push({
      type: "input_image",
      image_url: payload.imageDataUrl,
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are LoopLens, an AI recycling intelligence system for universities and large facilities. " +
                "Return concise operationally useful output for sustainability and facilities teams. " +
                "Be decisive, practical, and specific to the given location. Use US English.",
            },
          ],
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "looplens_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${errorText}`);
  }

  const data = await response.json();
  const outputText =
    data.output_text ||
    data.output?.find((item) => item.type === "output_text")?.text ||
    "";

  if (!outputText) {
    throw new Error("OpenAI API returned no parsable analysis text.");
  }

  return JSON.parse(outputText);
}

async function serveStatic(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const file = staticFiles.get(pathname);
  if (!file) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const target = path.join(__dirname, file);
  const body = await readFile(target);
  const extension = path.extname(target);

  res.writeHead(200, {
    "Content-Type": contentTypes[extension] || "application/octet-stream",
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/analyze") {
      const payload = await readJsonBody(req);
      const analysis = await callOpenAI(payload);
      sendJson(res, 200, analysis);
      return;
    }

    if (req.method === "GET") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, {
      error:
        error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
});

server.listen(port, host, () => {
  console.log(`LoopLens server running at http://${host}:${port}`);
});
