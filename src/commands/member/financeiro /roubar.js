import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX, OWNER_LID } from "../../../config.js";
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "roubar-cooldown";

// ID e Telefone do Mestre Supremo
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
  name: "roubar",
  description: "Tente roubar alguém. Risco de perder saldo!",
  commands: ["roubar", "assaltar"],
  usage: `${PREFIX}roubar @membro`,

  handle: async ({ remoteJid, userLid, sendReply, mentionedJidList, isReply, replyLid, sendReact }) => { 
    if (!isActiveRealGroup(remoteJid)) return sendReply("⚠️ O modo real não está ativado.");

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

    let vitimaJid = isReply ? replyLid : (mentionedJidList ? mentionedJidList[0] : null);
    if (!vitimaJid) return sendReply("❌ Mencione ou responda alguém para roubar!");

    const tratarId = (id) => (id.includes(DONO_PHONE) || id === OWNER_LID) ? TARGET_JID_DONO : id;
    const ladraoId = tratarId(userLid);
    const vitimaId = tratarId(vitimaJid);

    // --- PROTEÇÃO DO MESTRE SUPREMO (LEANDRO) ---
    if (vitimaId === TARGET_JID_DONO && ladraoId !== TARGET_JID_DONO) {
        const keyLadrao = `${remoteJid}-${ladraoId}`;
        const multaAudacia = 200;

        // Tira 200 do ladrão e dá para o mestre
        saldoData[keyLadrao] = (saldoData[keyLadrao] || 0) - multaAudacia;
        saldoData[`${remoteJid}-${TARGET_JID_DONO}`] = (saldoData[`${remoteJid}-${TARGET_JID_DONO}`] || 0) + multaAudacia;

        fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
        
        await sendReact("⚡");
        return await sendReply(`🤨 *QUEM VOCÊ PENSA QUE É?*\n\nPara tentar roubar a grana do nosso mestre supremo Leandro? Pela sua audácia e falta de respeito, você acaba de perder *${formatarReal(multaAudacia)}* que foram transferidos para a conta dele imediatamente! 👑🔥`);
    }

    if (ladraoId === vitimaId) return sendReply("🤡 Roubar a si mesmo? Você não é muito inteligente, né?");

    const keyLadrao = `${remoteJid}-${ladraoId}`;
    const keyVitima = `${remoteJid}-${vitimaId}`;
    
    const now = Date.now();
    const cooldownTime = 5 * 60 * 1000; 
    if (now - (cooldownData[keyLadrao] || 0) < cooldownTime) {
      const resto = Math.ceil((cooldownTime - (now - cooldownData[keyLadrao])) / 1000);
      return sendReply(`🚨 Shhh! A polícia está na rua. Espere ${Math.floor(resto/60)}m ${resto%60}s.`);
    }

    const saldoVitima = saldoData[keyVitima] || 0;
    const saldoLadrao = saldoData[keyLadrao] || 0;

    if (saldoVitima < 150) return sendReply("⚠️ A vítima está sem nada, deixe ela em paz.");

    await sendReact("🥷");
    const sucesso = Math.random() < 0.40; 
    cooldownData[keyLadrao] = now;

    if (sucesso) {
      const fatorRoubo = 0.10 + Math.random() * 0.15;
      const valorRoubado = Math.floor(saldoVitima * fatorRoubo);

      saldoData[keyVitima] -= valorRoubado;
      saldoData[keyLadrao] = (saldoData[keyLadrao] || 0) + valorRoubado;

      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
      fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

      await sendReply(`
💰 *ASSALTO BEM SUCEDIDO!*
---------------------------------
🥷 *Ladrão:* @${userLid.split('@')[0]}
📉 *Vítima:* @${vitimaJid.split('@')[0]}

💵 *Valor Roubado:* *${formatarReal(valorRoubado)}*
⚖️ *Seu Novo Saldo:* *${formatarReal(saldoData[keyLadrao])}*
---------------------------------
      `, [userLid, vitimaJid]);
    } else {
      const multaPercentual = 0.05; 
      const valorMulta = Math.floor(saldoLadrao * multaPercentual);
      const valorFinalMulta = valorMulta < 50 ? (saldoLadrao < 50 ? saldoLadrao : 50) : valorMulta;

      saldoData[keyLadrao] -= valorFinalMulta;
      saldoData[keyVitima] = (saldoData[keyVitima] || 0) + valorFinalMulta;

      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');
      fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2), 'utf8');

      await sendReply(`
🤡 *LADRÃO RODOU!*
---------------------------------
Você tentou roubar @${vitimaJid.split('@')[0]} mas a polícia chegou na hora!

🚓 *Punição:* Você perdeu *5%* do seu saldo.
💸 *Indenização paga à vítima:* *${formatarReal(valorFinalMulta)}*
---------------------------------
      `, [vitimaJid]);
    }
  },
};