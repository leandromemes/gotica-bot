const { PREFIX } = require(`${BASE_DIR}/config`);
const fs = require("fs");
const path = require("path");
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`);

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real";

// JIDs FIXOS PARA O DONO: Chave mestra do seu sistema de economia
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// Função para formatar o saldo (consistente com os outros comandos)
const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0 
  }).format(valor);

// Funções de Caminho (Unificada e Robusta)
function getPaths() {
  const databaseDir = path.resolve(`${BASE_DIR}/database`);

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  const saldoPath = path.resolve(`${databaseDir}/${SALDO_FILE}.json`);

  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));

  return { saldoPath };
}

function loadSaldoData() {
  const { saldoPath } = getPaths();
  const data = JSON.parse(fs.readFileSync(saldoPath));
  return { data, saldoPath };
}

module.exports = {
  name: "apostartudo",
  description: "Aposta todo seu saldo e pode dobrar ou perder tudo.",
  commands: ["apostartudo"],
  usage: `${PREFIX}apostartudo`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, sendReply }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { data, saldoPath } = loadSaldoData();
    
    // CORREÇÃO 2: Mapeamento de JID para o Dono (Chave Mestra)
    let jidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    // A chave agora usa o JID mapeado para leitura/escrita
    const key = `${remoteJid}-${jidToUse}`;
    
    const saldoAtual = data[key] || 0;
    
    const saldoApostadoFormatado = formatarReal(saldoAtual);

    if (saldoAtual <= 0) {
      return sendReply("😢 Você não tem saldo suficiente para apostar. Seu saldo é R$0.");
    }

    // 🪙 Sorteio (50% chance)
    const ganhou = Math.random() < 0.5;

    // 1. Lógica de Ganhos/Perdas
    if (ganhou) {
      data[key] += saldoAtual; // dobra
    } else {
      data[key] = 0; // perde tudo
    }

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2));
    
    const novoSaldoFormatado = formatarReal(data[key]);

    // 2. Frases sortidas
    const mensagensPerda = [
      `💔 Que tragédia! Você apostou *${saldoApostadoFormatado}* e perdeu tudo! Agora tá zerado. 😢`,
      `🪙 Você foi com sede demais e perdeu seus *${saldoApostadoFormatado}*! O azar te pegou hoje. 💀`,
      `😞 Perdeu *${saldoApostadoFormatado}* no giro da sorte. A vida é dura pra quem aposta alto. 🤧`,
      `🔻 Você se jogou no tudo ou nada e ficou com o nada. Saldo atual: *${novoSaldoFormatado}*. 😬`,
      `💸 Apostou *${saldoApostadoFormatado}* e tomou no prejuízo! Vai ter que trabalhar de novo. 🛠️`,
    ];

    const mensagensVitoria = [
      `💰 UAU! Você apostou *${saldoApostadoFormatado}* e DOBROU! Seu novo saldo é: *${novoSaldoFormatado}*! 🎉`,
      `🏆 Que jogada! Você apostou alto e saiu com o dobro! Novo saldo: *${novoSaldoFormatado}*! 💸`,
      `🔥 Incrível! Apostou tudo e ganhou! Seu saldo agora é: *${novoSaldoFormatado}*! 🤑`,
      `🍀 Sorte grande! Sua aposta de *${saldoApostadoFormatado}* foi certeira! Novo saldo: *${novoSaldoFormatado}*!`,
      `😎 Apostou com coragem e se deu bem! Que virada sensacional! Novo saldo: *${novoSaldoFormatado}*!`,
    ];

    const msgArray = ganhou ? mensagensVitoria : mensagensPerda;
    const msg = msgArray[Math.floor(Math.random() * msgArray.length)];

    await sendReply(msg);
  },
};