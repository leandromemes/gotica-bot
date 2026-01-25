import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sobe 4 níveis para alcançar a pasta database na raiz
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const SALDO_FILE = "saldo-real.json";

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE_NUMBER = '556391330669';

const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  }).format(valor);

export default {
  name: "saldo", 
  description: "Mostra seu saldo total.",
  commands: ["saldo", "real", "dinheiro", "carteira"], 
  usage: `${PREFIX}saldo`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, userLid, sendReply, sendWarningReply }) => { 

    if (!isActiveRealGroup(remoteJid)) {
      return sendWarningReply("O modo real não está ativado neste grupo.");
    }

    const saldoPath = path.resolve(BASE_DIR, 'database', SALDO_FILE);
    
    // Se o arquivo não existe, o saldo é zero
    if (!fs.existsSync(saldoPath)) {
        return sendReply(`
💼 *Carteira em Real (R$)*
---------------------------------
Seu saldo atual é: 💸 *R$ 0,00*
---------------------------------
_Use ${PREFIX}trabalhar para ganhar mais!_
        `.trim());
    }

    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    
    // Lógica de identificação
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE_NUMBER)) {
        jidToUse = TARGET_JID_DONO; 
    }

    const key = `${remoteJid}-${jidToUse}`;
    const saldo = saldoData[key] || 0;
    const saldoFormatado = formatarReal(saldo);
    
    await sendReply(`
💼 *Carteira em Real (R$)*
---------------------------------
Seu saldo atual é: 💸 *${saldoFormatado}*
---------------------------------
_Use ${PREFIX}trabalhar para ganhar mais!_
    `.trim());
  },
};