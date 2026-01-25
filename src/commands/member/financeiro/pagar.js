import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sobe 4 níveis para a raiz (src/commands/member/financeiro -> raiz)
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

export default {
  name: "pagar",
  description: "Transfere dinheiro para outra pessoa (responda a mensagem dela)",
  commands: ["pagar", "pix", "paga"],
  usage: `Responda a mensagem da pessoa com ${PREFIX}pagar valor`,

  handle: async ({ remoteJid, userLid, args, isReply, replyLid, sendReply, getGroupName }) => {
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    if (!isReply || !replyLid) {
        return sendReply(`✨ ⚠️ Responda a mensagem de quem você deseja pagar.\nExemplo: ${PREFIX}pagar 10`);
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero.");
    }

    // --- LOGICA DE IDENTIFICAÇÃO (Mapeia o Dono) ---
    const identificarLid = (lid) => {
        if (!lid) return "";
        if (lid.includes(DONO_PHONE_NUMBER) || lid === TARGET_JID_DONO) {
            return TARGET_JID_DONO;
        }
        return lid;
    };

    const remetenteFinal = identificarLid(userLid);
    const destinatarioFinal = identificarLid(replyLid);

    if (destinatarioFinal === remetenteFinal) {
      return sendReply("✨ ❌ Você não pode fazer um Pix para si mesmo.");
    }
    
    const { saldoPath } = getPaths();
    const data = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    
    const remetenteKey = `${remoteJid}-${remetenteFinal}`;
    const destinatarioKey = `${remoteJid}-${destinatarioFinal}`;

    // Inicializa saldos se não existirem
    if (!data[remetenteKey]) data[remetenteKey] = 0;
    if (!data[destinatarioKey]) data[destinatarioKey] = 0;

    // Checagem de Saldo
    if (data[remetenteKey] < valor) {
      return sendReply(`✨ ❌ Saldo insuficiente. Seu saldo atual é: ${formatarReal(data[remetenteKey])}`);
    }

    // EXECUÇÃO DA TRANSFERÊNCIA
    data[remetenteKey] -= valor;
    data[destinatarioKey] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2), 'utf8');

    const grupoNome = await getGroupName(remoteJid) || "este grupo";
    const valorFormatado = formatarReal(valor);
    
    await sendReply(
      `✨ 💸 *Pix Realizado!*
---------------------------------
💰 Valor: *${valorFormatado}*
🏦 Destinatário: @${replyLid.split('@')[0]}
Grupo: ${grupoNome}
---------------------------------
_Transferência concluída com sucesso!_`,
      [replyLid]
    );
  },
};