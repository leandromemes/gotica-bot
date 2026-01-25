import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX, OWNER_LID } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "trabalhar-cooldown";
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669';

const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  }).format(valor);

function getPaths() {
  const databaseDir = path.resolve(BASE_DIR, 'database');
  if (!fs.existsSync(databaseDir)) fs.mkdirSync(databaseDir, { recursive: true });

  const saldoPath = path.resolve(databaseDir, `${SALDO_FILE}.json`);
  const cooldownPath = path.resolve(databaseDir, `${COOLDOWN_FILE}.json`);

  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}), 'utf8');
  if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, JSON.stringify({}), 'utf8');

  return { saldoPath, cooldownPath };
}

export default {
  name: "trabalhar",
  description: "Trabalhe para ganhar dinheiro real!",
  commands: ["trabalhar", "trampar", "Trabaia"],
  usage: `${PREFIX}trabalhar`,

  handle: async ({ remoteJid, userLid, sendReply }) => { 
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

    // --- LOGICA DE ID UNIFICADA ---
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE) || jidToUse === OWNER_LID) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    const key = `${remoteJid}-${jidToUse}`;
    const now = Date.now();
    const cooldownTime = 60 * 1000; // 1 minuto

    if (now - (cooldownData[key] || 0) < cooldownTime) {
      const resto = Math.ceil((cooldownTime - (now - cooldownData[key])) / 1000);
      return sendReply(`⏳ Espere ${resto}s para trabalhar novamente.`);
    }

    const trabalhos = [
      { cargo: "Ajudante de pedreiro", ganho: 10 + Math.random() * 15 },
      { cargo: "Programador de Bot", ganho: 20 + Math.random() * 30 },
      { cargo: "Entregador de Ifood", ganho: 12 + Math.random() * 10 },
      { cargo: "Vendedor de curso", ganho: 5 + Math.random() * 50 }
    ];

    const trabalho = trabalhos[Math.floor(Math.random() * trabalhos.length)];
    const ganho = Math.floor(trabalho.ganho);

    // Salva o saldo
    if (!saldoData[key]) saldoData[key] = 0;
    saldoData[key] += ganho;
    cooldownData[key] = now;

    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

    await sendReply(`
✨ 👷 *Trabalho Concluído!*
---------------------------------
Você trabalhou como *${trabalho.cargo}* e ganhou: 💸 *${formatarReal(ganho)}*!

Seu novo saldo é: *${formatarReal(saldoData[key])}*
---------------------------------
_Próximo trabalho em 1 minuto!_
    `.trim());
  },
};