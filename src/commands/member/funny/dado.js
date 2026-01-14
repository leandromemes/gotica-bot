import { delay } from "baileys";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { ASSETS_DIR, PREFIX, OWNER_LID } from "../../../config.js";
import { DangerError } from "../../../errors/index.js";
import { getRandomNumber } from "../../../utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURAÇÃO SINCRONIZADA (Sobe 4 níveis)
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "dado-cooldown"; // Arquivo separado para o cooldown do dado

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669';

const CUSTO_APOSTA = 100;
const PREMIO_VITORIA = 1000;
const TEMPO_ESPERA = 60 * 1000; // 1 Minuto em milissegundos

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
  name: "dado",
  description: "Aposte R$ 100 e tente ganhar R$ 1.000 no dado (1 min cooldown).",
  commands: ["dado", "dice"],
  usage: `${PREFIX}dado número`,

  handle: async ({
    args,
    sendWaitReply,
    sendReply,
    sendStickerFromURL,
    sendReact,
    webMessage,
    remoteJid,
    userLid
  }) => {
    const number = parseInt(args[0]);
    const pushName = webMessage?.pushName || "Usuário";

    if (!number || number < 1 || number > 6) {
      throw new DangerError(`🎲 Escolha um número entre 1 e 6!\nExemplo: ${PREFIX}dado 3`);
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

    // --- LOGICA DE ID UNIFICADA (Igual ao seu trabalhar.js) ---
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE) || jidToUse === OWNER_LID) {
        jidToUse = TARGET_JID_DONO; 
    }
    const key = `${remoteJid}-${jidToUse}`;

    // --- VERIFICAÇÃO DE COOLDOWN ---
    const now = Date.now();
    if (now - (cooldownData[key] || 0) < TEMPO_ESPERA) {
      const resto = Math.ceil((TEMPO_ESPERA - (now - cooldownData[key])) / 1000);
      return sendReply(`⏳ Calma aí! O dado está quente. Espere ${resto}s para apostar de novo.`);
    }

    const saldoAtual = saldoData[key] || 0;

    // --- VERIFICAÇÃO DE SALDO ---
    if (saldoAtual < CUSTO_APOSTA) {
      return await sendReply(
        `✨ ❌ *Saldo Insuficiente!*\n\n💰 Aposta: *${formatarReal(CUSTO_APOSTA)}*\n💵 Seu Saldo: *${formatarReal(saldoAtual)}*\n\n_Vá trabalhar para conseguir dinheiro!_`
      );
    }

    await sendReact("🎲");
    await sendWaitReply(`🎰 *${pushName}* apostou ${formatarReal(CUSTO_APOSTA)} no número ${number}!`);

    const result = getRandomNumber(1, 6);

    try {
      await sendStickerFromURL(path.resolve(ASSETS_DIR, "stickers", "dice", `${result}.webp`));
    } catch (e) {
      await sendReply(`🎲 O dado parou em: *${result}*`);
    }

    await delay(2000);

    // Salva o tempo do último uso (Cooldown)
    cooldownData[key] = now;
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

    if (number === result) {
      saldoData[key] = (saldoData[key] || 0) + PREMIO_VITORIA;
      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');

      await sendReact("🏆");
      await sendReply(
        `✨ 🎊 *VITÓRIA!* 🎊\n\n🎯 Dado: *${result}*\n💰 Ganhou: *${formatarReal(PREMIO_VITORIA)}*\n💵 Novo Saldo: *${formatarReal(saldoData[key])}*`,
        [userLid]
      );
    } else {
      saldoData[key] = (saldoData[key] || 0) - CUSTO_APOSTA;
      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');

      await sendReact("😭");
      await sendReply(
        `✨ 💀 *PERDEU!* 💀\n\n🎯 Dado: *${result}*\n💸 Perdeu: *${formatarReal(CUSTO_APOSTA)}*\n💵 Saldo: *${formatarReal(saldoData[key])}*`,
        [userLid]
      );
    }
  },
};