import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a raiz (4 níveis)
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

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

// Mapeia o ID do dono para o LID oficial se necessário
function getMappedJid(jid) {
    if (!jid) return "";
    if (jid.includes(DONO_PHONE_NUMBER) || jid === TARGET_JID_DONO) return TARGET_JID_DONO;
    return jid;
}

export default {
  name: "duelo",
  description: "Desafia outro membro para um duelo apostando dinheiro.",
  commands: ["duelo", "apostar", "x1"],
  usage: `Responda a pessoa com ${PREFIX}duelo valor`,

  handle: async ({ remoteJid, userLid, args, isReply, replyLid, sendReply }) => {
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }
    
    if (!isReply || !replyLid) {
      return sendReply(`✨ ⚠️ Responda a mensagem de quem você deseja desafiar.\nExemplo: ${PREFIX}duelo 50`);
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 
    
    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero.");
    }

    if (replyLid === userLid) {
      return sendReply("✨ ❌ Você não pode duelar com você mesmo.");
    }
    
    const desafianteJidToUse = getMappedJid(userLid);
    const desafiadoJidToUse = getMappedJid(replyLid);

    const { saldoPath } = getPaths();
    const data = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    
    const desafianteKey = `${remoteJid}-${desafianteJidToUse}`;
    const desafiadoKey = `${remoteJid}-${desafiadoJidToUse}`;
    
    if (!data[desafianteKey]) data[desafianteKey] = 0;
    if (!data[desafiadoKey]) data[desafiadoKey] = 0;

    const valorFormatado = formatarReal(valor);

    // Checagem de Saldo de ambos
    if (data[desafianteKey] < valor || data[desafiadoKey] < valor) {
      let msg = `✨ ❌ Ambos precisam de *${valorFormatado}* para o duelo.`;
      if (data[desafianteKey] < valor) msg += `\nSeu saldo (${formatarReal(data[desafianteKey])}) é baixo.`;
      if (data[desafiadoKey] < valor) msg += `\nO saldo do oponente (${formatarReal(data[desafiadoKey])}) é baixo.`;
      return sendReply(msg, [replyLid]);
    }
    
    // Sorteio do Vencedor
    const vencedorEhDesafiante = Math.random() < 0.5;
    const vencedorJidToUse = vencedorEhDesafiante ? desafianteJidToUse : desafiadoJidToUse;
    const perdedorJidToUse = vencedorEhDesafiante ? desafiadoJidToUse : desafianteJidToUse;
    
    // Atualiza o JSON
    data[`${remoteJid}-${vencedorJidToUse}`] += valor;
    data[`${remoteJid}-${perdedorJidToUse}`] -= valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2), 'utf8');
    
    const vencedorMencao = vencedorEhDesafiante ? userLid : replyLid;
    const perdedorMencao = vencedorEhDesafiante ? replyLid : userLid;
    
    await sendReply(
      `⚔️ *DUELO ENCERRADO* ⚔️
---------------------------------
🔥 Valor da Aposta: *${valorFormatado}*

🥇 Vencedor: @${vencedorMencao.split('@')[0]}
💸 Ganho: *+${valorFormatado}*

💔 Perdedor: @${perdedorMencao.split('@')[0]}
💀 Perda: *-${valorFormatado}*
---------------------------------`.trim(),
      [userLid, replyLid] 
    );
  },
};