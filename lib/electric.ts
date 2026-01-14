import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { z } from "zod";

// Schema para silobags
export const silobagSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  weight: z.number(),
  size: z.string(),
  species: z.string(),
  bagging_date: z.string(),
  created_at: z.string(),
});

export type Silobag = z.infer<typeof silobagSchema>;

// URL del servicio Electric
const ELECTRIC_URL = "http://localhost:3001/v1/shape";
// URL del backend
const API_URL = "http://localhost:3000";

// Colección de silobolsas sincronizada con Electric
export const silobagsCollection = createCollection(
  electricCollectionOptions({
    id: "sync-silobags",
    shapeOptions: {
      url: ELECTRIC_URL,
      params: {
        table: "silobags",
      },
    },
    getKey: (item) => item.id,
    schema: silobagSchema,
    onInsert: async ({ transaction }) => {
      // 1) obtené todas las mutaciones locales
      const mutations = transaction.mutations.map((m) => ({
        op: m.type, // 'insert', 'update', 'delete'
        table: "silobags", // fija porque esta colección apunta a esa tabla
        data: m.modified ?? {}, // para insert/update
        key: m.key, // para delete
      }));

      try {
        // 2) mandalo al endpoint de ingest
        const res = await fetch(`${API_URL}/ingest`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ mutations }),
        });

        if (!res.ok) throw new Error("ingest_failed");

        const { txid } = await res.json();

        // 3) devolvé txid para que TanStack DB se sincronice
        return { txid };
      } catch {
        // 4) si falla por offline o red, devolvé un txid local dummy
        //    para que la mutación NO se revierta
        return { txid: Date.now() };
      }
    },
  })
);
