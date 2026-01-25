import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PREFIX } from "../../../config.js";
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a raiz (4 níveis para chegar na raiz a partir de member/Relacionamentos)
const BASE_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const SALDO_FILE = "saldo-real";

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE_NUMBER = '556391330669';

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
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}), 'utf8');
  return { saldoPath };
}

function getMappedJid(jid) {
    if (!jid) return jid;
    if (jid.includes(DONO_PHONE_NUMBER) || jid === TARGET_JID_DONO) {
        return TARGET_JID_DONO;
    }
    return jid;
}

export default {
  name: "pensao", 
  description: "Pague a pensão alimentícia para outro membro (responda a mensagem)", 
  commands: ["pensao", "alimentos", "pensionista"], 
  usage: `Responda a mensagem da pessoa com ${PREFIX}pensao valor`, 

  handle: async ({ remoteJid, userLid, args, isReply, replyLid, sendReply, pushName }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    if (!isReply || !replyLid) {
      return sendReply(`✨ ⚠️ Para pagar a pensão, responda a mensagem da pessoa com ${PREFIX}pensao valor.`);
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor da pensão inválido. Digite um número inteiro.");
    }

    const remetenteMapped = getMappedJid(userLid);
    const destinatarioMapped = getMappedJid(replyLid);

    if (remetenteMapped === destinatarioMapped) {
      return sendReply("✨ ❌ Você não pode pagar pensão para si mesmo. Onde já se viu? 🤡");
    }
    
    const { saldoPath } = getPaths();
    const data = JSON.parse(fs.readFileSync(saldoPath, "utf8")); 
    
    const remetenteKey = `${remoteJid}-${remetenteMapped}`;
    const destinatarioKey = `${remoteJid}-${destinatarioMapped}`;
    
    if (!data[remetenteKey]) data[remetenteKey] = 0;
    if (!data[destinatarioKey]) data[destinatarioKey] = 0;

    if (data[remetenteKey] < valor) {
      return sendReply(`✨ ❌ Saldo insuficiente para a pensão! O oficial de justiça está chegando... Seu saldo: *${formatarReal(data[remetenteKey])}*.`);
    }

    // Processa o pagamento da pensão
    data[remetenteKey] -= valor;
    data[destinatarioKey] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2), "utf8");

    const pagadorNome = pushName || "Alguém";
    
    await sendReply(
      `⚖️ *PENSÃO ALIMENTÍCIA* ⚖️
---------------------------------
💸 Valor pago: *${formatarReal(valor)}*
👤 Responsável: ${pagadorNome}
🍼 Beneficiário: @${replyLid.split('@')[0]}
---------------------------------
_Dever cumprido! Fuja da prisão hoje..._ 🦇`,
      [replyLid]
    );
  },
};