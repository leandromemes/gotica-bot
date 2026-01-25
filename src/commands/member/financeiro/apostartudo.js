import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a raiz (4 níveis para chegar na database)
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
  name: "apostartudo",
  description: "Aposta todo seu saldo: dobre ou perca tudo!",
  commands: ["apostartudo", "allin"],
  usage: `${PREFIX}apostartudo`,

  handle: async ({ remoteJid, userLid, sendReply }) => { 
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath } = getPaths();
    const data = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    
    // Identificação do Usuário (Mapeia se for o Dono)
    let jidToUse = userLid || "";
    if (jidToUse.includes(DONO_PHONE_NUMBER) || jidToUse === TARGET_JID_DONO) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    const key = `${remoteJid}-${jidToUse}`;
    const saldoAtual = data[key] || 0;

    if (saldoAtual <= 0) {
      return sendReply("😢 Você não tem saldo para apostar. Seu saldo está zerado!");
    }

    const saldoApostadoFormatado = formatarReal(saldoAtual);

    // 🪙 Sorteio (50% de chance)
    const ganhou = Math.random() < 0.5;

    if (ganhou) {
      data[key] = saldoAtual * 2; 
    } else {
      data[key] = 0; 
    }

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2), 'utf8');
    
    const novoSaldoFormatado = formatarReal(data[key]);

    const mensagensPerda = [
      `💔 Que tragédia! Você apostou *${saldoApostadoFormatado}* e perdeu tudo! 😢`,
      `🪙 O azar te pegou! Seus *${saldoApostadoFormatado}* viraram fumaça. 💀`,
      `😞 No giro da sorte você se deu mal. Perdeu *${saldoApostadoFormatado}*. 🤧`,
      `💸 Apostou tudo no "All-in" e ficou com nada! Vai ter que trabalhar de novo. 🛠️`,
    ];

    const mensagensVitoria = [
      `💰 UAU! Você apostou *${saldoApostadoFormatado}* e DOBROU! Novo saldo: *${novoSaldoFormatado}*! 🎉`,
      `🏆 Que jogada de mestre! Você agora tem *${novoSaldoFormatado}* na conta! 💸`,
      `🔥 Incrível! A sorte sorriu para você! Saldo atualizado: *${novoSaldoFormatado}*! 🤑`,
      `🍀 Sorte grande! Sua aposta foi certeira! Você dobrou seu capital para *${novoSaldoFormatado}*!`,
    ];

    const msgArray = ganhou ? mensagensVitoria : mensagensPerda;
    const msg = msgArray[Math.floor(Math.random() * msgArray.length)];

    await sendReply(`🎲 *TUDO OU NADA* ---------------------------------
${msg}
---------------------------------`);
  },
};