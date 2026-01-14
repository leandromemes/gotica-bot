import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sobe 4 níveis para a raiz
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "traficar-cooldown"; 

// IDs Oficiais para o seu dinheiro cair na conta certa
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
  name: "traficar",
  description: "💵 Fique rico traficando!",
  commands: ["traficar", "crime", "vender"],
  usage: `${PREFIX}traficar`,

  handle: async ({ remoteJid, userLid, sendReply }) => { 
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

    // --- IDENTIFICAÇÃO UNIFICADA (Igual ao Saldo) ---
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE_NUMBER) || jidToUse === TARGET_JID_DONO) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    const key = `${remoteJid}-${jidToUse}`;
    const now = Date.now();
    const tempoDeEspera = 60 * 1000; // 1 minuto

    if (now - (cooldownData[key] || 0) < tempoDeEspera) {
      const segundos = Math.ceil((tempoDeEspera - (now - cooldownData[key])) / 1000);
      return sendReply(`⏳ Espere *${segundos} segundos* para traficar novamente.`);
    }

    const traficos = [
      { mensagem: `traficando 5g de maconha e`, ganho: 30 + Math.random() * 20 },
      { mensagem: `vendendo 30g de Skank para os playboys e`, ganho: 55 + Math.random() * 20 },
      { mensagem: `traficando 5 litros de lança perfume e`, ganho: 40 + Math.random() * 20 },
      { mensagem: `vendendo crack para os noias e`, ganho: 25 + Math.random() * 20 },
      { mensagem: `vendendo 5 rins no mercado negro e`, ganho: 80 + Math.random() * 20 },
      { mensagem: `fazendo 150g de Bazuco para os caras da favela e`, ganho: 50 + Math.random() * 20 },
      { mensagem: `traficando 150g de pasta base e`, ganho: 65 + Math.random() * 20 },
      { mensagem: `vendendo loló para a gatinha no baile e`, ganho: 40 + Math.random() * 20 },
      { mensagem: `com 1kg de cocaína pura e`, ganho: 80 + Math.random() * 20 },
    ];

    const trafico = traficos[Math.floor(Math.random() * traficos.length)];
    const ganho = Math.floor(trafico.ganho);

    // Atualiza Saldo e Cooldown
    if (!saldoData[key]) saldoData[key] = 0;
    saldoData[key] += ganho;
    cooldownData[key] = now;

    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

    await sendReply(`
✨ 🚬 *Traficando...*
---------------------------------
Você ${trafico.mensagem} ganhou: 💸 *${formatarReal(ganho)}*!

Seu novo saldo é: *${formatarReal(saldoData[key])}*
---------------------------------
_Próximo tráfico em 1 minuto!_
    `.trim());
  },
};