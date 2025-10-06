const { PREFIX } = require(`${BASE_DIR}/config`);
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`);
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "apostar-cooldown"; 

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
  const cooldownPath = path.resolve(`${databaseDir}/${COOLDOWN_FILE}.json`);

  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
  if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, JSON.stringify({}));

  return { saldoPath, cooldownPath };
}

function loadData() {
  const { saldoPath, cooldownPath } = getPaths();
  const saldoData = JSON.parse(fs.readFileSync(saldoPath));
  const cooldownData = JSON.parse(fs.readFileSync(cooldownPath));
  return { saldoData, cooldownData, saldoPath, cooldownPath };
}

module.exports = {
  name: "apostar",
  description: "Aposte uma quantia do seu saldo e tente dobrar!",
  commands: ["apostar", "apostinha", "bet"],
  usage: `${PREFIX}apostar valor`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, args, sendReply }) => {
    // 1. Checagem do modo real
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    // 2. Validação do Valor
    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 
    const valorFormatado = formatarReal(valor);
    
    if (isNaN(valor) || valor <= 0) {
      return sendReply("🎲 ❌ Valor inválido. Digite um número inteiro maior que zero (sem centavos).");
    }

    const { saldoData, cooldownData, saldoPath, cooldownPath } = loadData();
    
    // CORREÇÃO 2: Mapeamento de JID para o Dono (Chave Mestra)
    let jidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    // A chave agora usa o JID mapeado para leitura/escrita e cooldown
    const userKey = `${remoteJid}-${jidToUse}`;
    
    // 3. Cooldown (1 minuto)
    const tempoDeEspera = 60 * 1000;
    const agora = Date.now();
    const lastTime = cooldownData[userKey] || 0; // Usa userKey corrigida

    if (agora - lastTime < tempoDeEspera) {
      const segundos = Math.ceil((tempoDeEspera - (agora - lastTime)) / 1000);
      return sendReply(`⏳ Calma! Espere *${segundos} segundo(s)* para apostar novamente.`);
    }

    // 4. Checagem de Saldo
    if (!saldoData[userKey]) saldoData[userKey] = 0;
    const saldoAtual = saldoData[userKey]; // Usa userKey corrigida

    if (saldoAtual < valor) {
      return sendReply(`❌ Saldo insuficiente. Você tem apenas *${formatarReal(saldoAtual)}* para apostar em *${valorFormatado}*.`);
    }

    // 5. Lógica da Aposta (50/50)
    const ganhou = Math.random() < 0.5;

    let mensagem = `🎰 Você apostou *${valorFormatado}*...\n\n`;

    if (ganhou) {
      saldoData[userKey] += valor;
      mensagem += `✅ Parabéns! Você ganhou *${valorFormatado}* e dobrou sua aposta! 🤑\n`;
    } else {
      saldoData[userKey] -= valor;
      mensagem += `❌ Que pena! Você perdeu *${valorFormatado}* 😢\n`;
    }
    
    // 6. Atualização de Dados
    cooldownData[userKey] = agora; // Usa userKey corrigida
    
    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2));

    mensagem += `\n💼 Seu novo saldo é: *${formatarReal(saldoData[userKey])}*`;

    await sendReply(mensagem);
  },
};