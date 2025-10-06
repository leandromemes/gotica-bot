const { PREFIX } = require(`${BASE_DIR}/config`);
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`);
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real"; 
const COOLDOWN_FILE = "traficar-cooldown"; 

// JIDs FIXOS PARA O DONO: Chave mestra do seu sistema de economia
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// Função para formatar o saldo (consistente com saldo.js e trabalhar.js)
const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0 
  }).format(valor);

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

module.exports = {
  name: "traficar",
  description: "💵 Fique rico traficando!",
  commands: ["traficar", "crime"],
  usage: `${PREFIX}traficar`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, sendReply }) => { // Removemos pushName daqui, pois não estava disponível
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath));

    // Mapeamento de JID para o Dono (Chave Mestra)
    let jidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }
    
    // A chave agora usa o JID mapeado para leitura/escrita e cooldown
    const key = `${remoteJid}-${jidToUse}`;
    
    const lastTime = cooldownData[key] || 0;
    const now = Date.now();

    const tempoDeEspera = 60 * 1000; // 1 minuto (60 segundos)

    // 2. Checagem de Cooldown
    if (now - lastTime < tempoDeEspera) {
      const segundos = Math.ceil((tempoDeEspera - (now - lastTime)) / 1000);
      
      return sendReply(`⏳ Espere *${segundos} segundos* para traficar novamente.`);
    }

    // Mensagens e valores de ganho (de R$25 a R$100)
    const traficos = [
      { mensagem: `traficando 5g de maconha e`, ganho: Math.floor(Math.random() * (50 - 30 + 1)) + 30 },
      { mensagem: `vendendo 30g de Skank para os playboys e`, ganho: Math.floor(Math.random() * (75 - 55 + 1)) + 55 },
      { mensagem: `traficando 5 litros de lança perfume e`, ganho: Math.floor(Math.random() * (60 - 40 + 1)) + 40 },
      { mensagem: `vendendo crack para os noias e`, ganho: Math.floor(Math.random() * (45 - 25 + 1)) + 25 },
      { mensagem: `vendendo 5 rins no mercado negro e`, ganho: Math.floor(Math.random() * (100 - 80 + 1)) + 80 },
      { mensagem: `fazendo 150g de Bazuco para os caras da favela e`, ganho: Math.floor(Math.random() * (70 - 50 + 1)) + 50 },
      { mensagem: `traficando 150g de pasta base e`, ganho: Math.floor(Math.random() * (85 - 65 + 1)) + 65 },
      { mensagem: `vendendo loló para a gatinha no baile e`, ganho: Math.floor(Math.random() * (60 - 40 + 1)) + 40 },
      { mensagem: `com 1kg de cocaína pura e`, ganho: Math.floor(Math.random() * (100 - 80 + 1)) + 80 },
    ];

    const trafico = traficos[Math.floor(Math.random() * traficos.length)];

    const ganho = trafico.ganho;

    // 4. Atualização de Saldo e Cooldown
    if (!saldoData[key]) saldoData[key] = 0;
    saldoData[key] += ganho;
    cooldownData[key] = now;

    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2));

    const saldoAtualizado = saldoData[key];
    const ganhoFormatado = formatarReal(ganho);
    const saldoAtualizadoFormatado = formatarReal(saldoAtualizado);

    // CORREÇÃO 3: Removido pushName e alterada a frase para "Você"
    await sendReply(`
✨ 🚬 *Traficando...* ---------------------------------
Você ${trafico.mensagem} ganhou: 💸 *${ganhoFormatado}*!

Seu novo saldo é: *${saldoAtualizadoFormatado}*
---------------------------------
_Próximo tráfico em 1 minuto!_
    `.trim());
  },
};