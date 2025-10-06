const { PREFIX } = require(`${BASE_DIR}/config`);
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`); 
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona (saldo-real)
const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "real-cooldown";

// JIDs FIXOS PARA O DONO: Chave mestra do seu sistema de economia
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// Função para formatar o saldo (consistente com saldo.js)
const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
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
  name: "trabalhar",
  description: "Ganhe Reais 💸 trabalhando",
  commands: ["trabalhar", "ganhar", "emprego"],
  usage: `${PREFIX}trabalhar`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, sendReply }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath));

    // CORREÇÃO 2: Mapeamento de JID para o Dono
    let jidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }

    // A chave agora usa o JID mapeado (chave mestra)
    const key = `${remoteJid}-${jidToUse}`;

    const lastTime = cooldownData[key] || 0;
    const now = Date.now();

    const tempoDeEspera = 60 * 1000; // 1 minuto (60 segundos)

    // 2. Checagem de Cooldown
    if (now - lastTime < tempoDeEspera) {
      const segundos = Math.ceil((tempoDeEspera - (now - lastTime)) / 1000);
      return sendReply(`⏳ Espere *${segundos} segundos* para trabalhar novamente.`);
    }

    // 3. Lógica do Trabalho e Ganho
    const profissoes = [
      "Garota do job", "Capinador de quintal", "Faxineira no hospital",
      "Streamer de Minecraft", "Babá de bebê reborn", "Entregador no Ifood",
      "Faxineiro(a)", "Atriz +18", "Mendigo pedindo esmola", "Ajudante de pedreiro"
    ];

    const profissao = profissoes[Math.floor(Math.random() * profissoes.length)];
    // Ganhos SEM centavos (apenas R$ inteiros)
    const ganho = Math.floor(Math.random() * 21) + 5; // de R$5 a R$25

    // 4. Atualização de Saldo e Cooldown
    if (!saldoData[key]) saldoData[key] = 0;
    saldoData[key] += ganho;
    cooldownData[key] = now;

    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2));

    const saldoAtualizado = saldoData[key];
    const ganhoFormatado = formatarReal(ganho);
    const saldoAtualizadoFormatado = formatarReal(saldoAtualizado);
    
    // 5. Envio de Resposta
    await sendReply(`
✨ 👷 *Trabalho Concluído!* ---------------------------------
Você trabalhou como *${profissao}* e ganhou: 💸 *${ganhoFormatado}*!

Seu novo saldo é: *${saldoAtualizadoFormatado}*
---------------------------------
_Próximo trabalho em 1 minuto!_
    `.trim());
  },
};