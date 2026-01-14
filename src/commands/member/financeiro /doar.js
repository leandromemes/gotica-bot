import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PREFIX } from "../../../config.js";
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a raiz (4 níveis: financeiro -> member -> commands -> src -> raiz)
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
  name: "doar", 
  description: "Doe uma quantia em dinheiro para outro membro (responda a mensagem)", 
  commands: ["doar", "caridade", "presentear"], 
  usage: `Responda a mensagem da pessoa com ${PREFIX}doar valor`, 

  handle: async ({ remoteJid, userLid, args, isReply, replyLid, sendReply, pushName }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    if (!isReply || !replyLid) {
      return sendReply(`✨ ⚠️ Use o comando ${PREFIX}doar *respondendo* a mensagem da pessoa.`);
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero.");
    }

    const remetenteMapped = getMappedJid(userLid);
    const destinatarioMapped = getMappedJid(replyLid);

    if (remetenteMapped === destinatarioMapped) {
      return sendReply("✨ ❌ Você não pode doar para si mesmo.");
    }
    
    if (replyLid.endsWith("@g.us")) {
        return sendReply("✨ ❌ Não é possível doar para este grupo.");
    }
    
    const { saldoPath } = getPaths();
    const data = JSON.parse(fs.readFileSync(saldoPath, "utf8")); 
    
    const remetenteKey = `${remoteJid}-${remetenteMapped}`;
    const destinatarioKey = `${remoteJid}-${destinatarioMapped}`;
    
    if (!data[remetenteKey]) data[remetenteKey] = 0;
    if (!data[destinatarioKey]) data[destinatarioKey] = 0;

    if (data[remetenteKey] < valor) {
      return sendReply(`✨ ❌ Saldo insuficiente. Seu saldo atual é de *${formatarReal(data[remetenteKey])}*.`);
    }

    // Processa a doação
    data[remetenteKey] -= valor;
    data[destinatarioKey] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2), "utf8");

    const remetenteNome = pushName || "Alguém";
    
    await sendReply(
      `✨ 🎁 *ATO DE CARIDADE!* 🎁
---------------------------------
🫂 Doação de *${formatarReal(valor)}*
💖 De: ${remetenteNome}
🎯 Para: @${replyLid.split('@')[0]}
---------------------------------
_A solidariedade faz a diferença!_`,
      [replyLid]
    );
  },
};