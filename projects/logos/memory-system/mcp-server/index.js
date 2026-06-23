import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios";
import crypto from "crypto";

const QDRANT_HOST = process.env.QDRANT_HOST ?? "localhost";
const QDRANT_PORT = parseInt(process.env.QDRANT_PORT ?? "6333");
const EMBEDDING_HOST = process.env.EMBEDDING_HOST ?? "localhost";
const EMBEDDING_PORT = process.env.EMBEDDING_PORT ?? "8000";
const COLLECTION = process.env.MEMORY_COLLECTION ?? "personal_memory";
const SCORE_THRESHOLD = parseFloat(process.env.SCORE_THRESHOLD ?? "0.72");
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_LIMIT ?? "10");

const EMBEDDING_URL = `http://${EMBEDDING_HOST}:${EMBEDDING_PORT}`;
const DENSE_VECTOR_SIZE = 1024;

const qdrant = new QdrantClient({ host: QDRANT_HOST, port: QDRANT_PORT });

const log = (...args) => process.stderr.write(args.join(" ") + "\n"); // stdout is the MCP protocol channel — writing there corrupts the message stream

const getEmbedding = async (text) => {
  const response = await axios.post(`${EMBEDDING_URL}/embed`, { text }, { timeout: 30000 });
  return response.data;
};

const ensureCollection = async () => {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION);

    if (!exists) {
      log(`Creating collection "${COLLECTION}"...`);
      await qdrant.createCollection(COLLECTION, {
        vectors: {
          dense: {
            size: DENSE_VECTOR_SIZE,
            distance: "Cosine",
          },
        },
        sparse_vectors: {
          sparse: {
            index: {
              on_disk: false,
            },
          },
        },
      });

      for (const field of ["domain", "project", "category", "scope"]) {
        await qdrant.createPayloadIndex(COLLECTION, {
          field_name: field,
          field_schema: "keyword",
        });
      }

      log(`Collection "${COLLECTION}" created with payload indexes.`);
    } else {
      log(`Collection "${COLLECTION}" already exists.`);
    }
  } catch (err) {
    log(`ERROR during collection setup: ${err.message}`);
    throw err;
  }
};

const buildMustFilter = (conditions) => ({
  must: conditions.map(([key, value]) => ({
    key,
    match: { value },
  })),
});

const server = new Server(
  { name: "logos-memory", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "save_memory",
      description: "Save a memory to the personal memory store.",
      inputSchema: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            enum: ["code", "dnd", "electronics", "cooking", "friends", "life"],
            description: "The broad domain this memory belongs to.",
          },
          project: {
            type: "string",
            description: "The specific project or campaign name.",
          },
          category: {
            type: "string",
            enum: ["rule", "decision", "context", "reasoning", "note", "task"],
            description: "The type of memory being stored.",
          },
          scope: {
            type: "string",
            description: "Optional narrower scope, e.g. 'javascript', 'world-building'.",
          },
          content: {
            type: "string",
            description: "The actual memory content to store.",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Optional tags for additional context.",
          },
        },
        required: ["domain", "project", "category", "content"],
      },
    },
    {
      name: "search_memory",
      description: "Search for memories using semantic similarity within a domain and project.",
      inputSchema: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            enum: ["code", "dnd", "electronics", "cooking", "friends", "life"],
            description: "Required domain filter.",
          },
          project: {
            type: "string",
            description: "Required project filter.",
          },
          query: {
            type: "string",
            description: "The search query to embed and match against.",
          },
          category: {
            type: "string",
            enum: ["rule", "decision", "context", "reasoning", "note", "task"],
            description: "Optional category filter.",
          },
          scope: {
            type: "string",
            description: "Optional scope filter.",
          },
          limit: {
            type: "number",
            description: "Maximum number of results. Defaults to 10.",
          },
          score_threshold: {
            type: "number",
            description: "Minimum similarity score. Defaults to 0.72.",
          },
        },
        required: ["domain", "project", "query"],
      },
    },
    {
      name: "get_rules",
      description: "Retrieve all rules for a domain/project, optionally filtered by scope. Always returns all matching rules regardless of similarity score.",
      inputSchema: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            enum: ["code", "dnd", "electronics", "cooking", "friends", "life"],
            description: "Required domain filter.",
          },
          project: {
            type: "string",
            description: "Required project filter.",
          },
          scope: {
            type: "string",
            description: "Optional scope. Returns rules where scope matches this value OR scope is 'global'.",
          },
        },
        required: ["domain", "project"],
      },
    },
    {
      name: "delete_memory",
      description: "Delete a single memory entry by its ID.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The UUID of the memory point to delete.",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "list_projects",
      description: "List all unique project names for a given domain.",
      inputSchema: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            enum: ["code", "dnd", "electronics", "cooking", "friends", "life"],
            description: "The domain to list projects for.",
          },
        },
        required: ["domain"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "save_memory") {
      const { domain, project, category, scope, content, tags } = args;

      let embedding;
      try {
        embedding = await getEmbedding(content);
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Embedding service unavailable — ${err.message}` }],
        };
      }

      const id = crypto.randomUUID();
      const payload = {
        domain,
        project,
        category,
        content,
        created_at: new Date().toISOString(),
        ...(scope !== undefined && { scope }),
        ...(tags !== undefined && { tags }),
      };

      try {
        await qdrant.upsert(COLLECTION, {
          points: [
            {
              id,
              vector: {
                dense: embedding.dense,
                sparse: {
                  indices: Object.keys(embedding.sparse).map(Number),
                  values: Object.values(embedding.sparse),
                },
              },
              payload,
            },
          ],
        });
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Qdrant unavailable — ${err.message}` }],
        };
      }

      return {
        content: [{ type: "text", text: `Memory saved. ID: ${id}` }],
      };
    }

    if (name === "search_memory") {
      const {
        domain,
        project,
        query,
        category,
        scope,
        limit = DEFAULT_LIMIT,
        score_threshold = SCORE_THRESHOLD,
      } = args;

      let embedding;
      try {
        embedding = await getEmbedding(query);
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Embedding service unavailable — ${err.message}` }],
        };
      }

      const mustConditions = [
        ["domain", domain],
        ["project", project],
      ];
      if (category) mustConditions.push(["category", category]);
      if (scope) mustConditions.push(["scope", scope]);

      let results;
      try {
        const response = await qdrant.query(COLLECTION, {
          query: embedding.dense,
          using: "dense",
          filter: buildMustFilter(mustConditions),
          score_threshold,
          limit,
          with_payload: true,
        });
        results = response.points ?? response; // Qdrant JS client shape differs between versions
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Qdrant unavailable — ${err.message}` }],
        };
      }

      if (!results || results.length === 0) {
        return {
          content: [{ type: "text", text: "No memories found matching your query." }],
        };
      }

      const formatted = results
        .map((r, i) => {
          const p = r.payload;
          const meta = [
            `[${i + 1}] ID: ${r.id}`,
            `    Score: ${r.score?.toFixed(4) ?? "n/a"}`,
            `    Category: ${p.category} | Scope: ${p.scope ?? "none"} | Tags: ${(p.tags ?? []).join(", ") || "none"}`,
            `    Created: ${p.created_at ?? "unknown"}`,
            `    ${p.content}`,
          ];
          return meta.join("\n");
        })
        .join("\n\n");

      return {
        content: [{ type: "text", text: formatted }],
      };
    }

    if (name === "get_rules") {
      const { domain, project, scope } = args;

      const mustConditions = [
        ["domain", domain],
        ["project", project],
        ["category", "rule"],
      ];

      let filter;
      if (scope) {
        filter = {
          must: [
            ...mustConditions.map(([key, value]) => ({ key, match: { value } })),
            {
              should: [
                { key: "scope", match: { value: scope } },
                { key: "scope", match: { value: "global" } },
              ],
            },
          ],
        };
      } else {
        filter = buildMustFilter(mustConditions);
      }

      let points = [];
      let offset = null;

      try {
        while (true) {
          const response = await qdrant.scroll(COLLECTION, {
            filter,
            limit: 100,
            with_payload: true,
            with_vector: false,
            ...(offset !== null && { offset }),
          });

          points = points.concat(response.points);

          if (!response.next_page_offset) break;
          offset = response.next_page_offset;
        }
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Qdrant unavailable — ${err.message}` }],
        };
      }

      if (points.length === 0) {
        return {
          content: [{ type: "text", text: "No rules found for this domain/project." }],
        };
      }

      const formatted = points
        .map((r, i) => {
          const p = r.payload;
          return [
            `[${i + 1}] ID: ${r.id}`,
            `    Scope: ${p.scope ?? "none"} | Tags: ${(p.tags ?? []).join(", ") || "none"}`,
            `    ${p.content}`,
          ].join("\n");
        })
        .join("\n\n");

      return {
        content: [{ type: "text", text: `${points.length} rule(s) found:\n\n${formatted}` }],
      };
    }

    if (name === "delete_memory") {
      const { id } = args;

      try {
        await qdrant.delete(COLLECTION, {
          points: [id],
        });
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Qdrant unavailable — ${err.message}` }],
        };
      }

      return {
        content: [{ type: "text", text: `Memory ${id} deleted.` }],
      };
    }

    if (name === "list_projects") {
      const { domain } = args;

      let points = [];
      let offset = null;

      try {
        while (true) {
          const response = await qdrant.scroll(COLLECTION, {
            filter: buildMustFilter([["domain", domain]]),
            limit: 250,
            with_payload: true,
            with_vector: false,
            ...(offset !== null && { offset }),
          });

          points = points.concat(response.points);

          if (!response.next_page_offset) break;
          offset = response.next_page_offset;
        }
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: Qdrant unavailable — ${err.message}` }],
        };
      }

      const projects = [...new Set(points.map((p) => p.payload?.project).filter(Boolean))].sort();

      if (projects.length === 0) {
        return {
          content: [{ type: "text", text: `No projects found for domain "${domain}".` }],
        };
      }

      return {
        content: [{ type: "text", text: `Projects in "${domain}":\n${projects.map((p) => `  - ${p}`).join("\n")}` }],
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
    };
  } catch (err) {
    log(`Unhandled error in tool "${name}": ${err.message}`);
    return {
      content: [{ type: "text", text: `Unexpected error: ${err.message}` }],
    };
  }
});

const main = async () => {
  log("Logos Memory MCP server starting...");

  try {
    await ensureCollection();
  } catch (err) {
    log(`WARNING: Could not initialize collection — Qdrant may not be running. Will retry on next tool call.`); // Claude Desktop starts MCP servers before Qdrant is necessarily up
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  log("Logos Memory MCP server ready.");
};

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});
