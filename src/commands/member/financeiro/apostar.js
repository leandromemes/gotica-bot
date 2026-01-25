import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "apostar-cooldown"; 

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
  const cooldownPath = path.resolve(databaseDir, `${COOLDOWN_FILE}.json`); 

  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}), 'utf8');
  if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, JSON.stringify({}), 'utf8');

  return { saldoPath, cooldownPath };
}

export default {
  name: "apostar",
  description: "Aposte uma quantia específica do seu saldo.",
  commands: ["apostar", "bet"],
  usage: `${PREFIX}apostar valor`,

  handle: async ({ remoteJid, userLid, args, sendReply }) => { 
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 
    
    if (isNaN(valor) || valor <= 0) {
      return sendReply("🎲 ❌ Valor inválido. Digite um valor maior que zero.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));
    
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE_NUMBER) || jidToUse === TARGET_JID_DONO) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    const userKey = `${remoteJid}-${jidToUse}`;
    
    const tempoDeEspera = 60 * 1000;
    const agora = Date.now();
    if (agora - (cooldownData[userKey] || 0) < tempoDeEspera) {
      const segundos = Math.ceil((tempoDeEspera - (agora - cooldownData[userKey])) / 1000);
      return sendReply(`⏳ Calma! Espere *${segundos}s* para apostar novamente.`);
    }

    const saldoAtual = saldoData[userKey] || 0;
    if (saldoAtual < valor) {
      return sendReply(`❌ Saldo insuficiente. Você tem *${formatarReal(saldoAtual)}*.`);
    }

    const ganhou = Math.random() < 0.5;
    const valorFormatado = formatarReal(valor);

    if (ganhou) {
      saldoData[userKey] += valor;
    } else {
      saldoData[userKey] -= valor;
    }
    
    cooldownData[userKey] = agora; 
    
    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

    const resultado = ganhou 
      ? `✅ Parabéns! Você ganhou *${valorFormatado}*! 🤑` 
      : `❌ Que pena! Você perdeu *${valorFormatado}* 😢`;

    await sendReply(`
🎰 *CASSINO GÓTICA BOT*
---------------------------------
${resultado}

💼 Novo saldo: *${formatarReal(saldoData[userKey])}*
---------------------------------
    `.trim());
  },
};