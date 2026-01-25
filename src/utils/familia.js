import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.resolve(__dirname, "..", "..", "database", "familia.json");

export function lerFamilia() {
  if (!fs.existsSync(databasePath)) return {};
  return JSON.parse(fs.readFileSync(databasePath, "utf-8"));
}

export function salvarFamilia(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

export function cleanJid(jid) {
  return jid?.replace(/:[0-9][0-9]|:[0-9]/g, "");
}