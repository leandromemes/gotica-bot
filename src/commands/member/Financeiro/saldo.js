const { PREFIX } = require(`${BASE_DIR}/config`);
// Agora esta função deve ser carregada corretamente
const {
  isActiveRealGroup
} = require(`${BASE_DIR}/utils/database`);
const fs = require("fs");
const path = require("path");

// 1. CORREÇÃO DE NOME: O arquivo correto que o seu sistema usa é 'saldo-real'
const SALDO_FILE = "saldo-real";

// JIDs FIXOS PARA O DONO: O SALDO É LIDO DESTA CHAVE
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';


// Função para formatar o saldo (consistente com trabalhar.js)
const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  }).format(valor);

function getPaths() {
  const databaseDir = path.resolve(`${BASE_DIR}/database`);
  
  // Garante que a pasta exista (melhoria de robustez)
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  const saldoPath = path.resolve(`${databaseDir}/${SALDO_FILE}.json`);
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
  
  return { saldoPath };
}

module.exports = {
  name: "saldo", 
  description: "Mostra quanto 💸 você tem no sistema de Real.",
  commands: ["saldo", "real", "dinheiro"], 
  usage: `${PREFIX}saldo`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, sendReply }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo. Use um comando de admin para ativá-lo.");
    }

    const { saldoPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath));
    
    let jidToUse = userJid;

    // 2. CORREÇÃO DE CHAVE: Mapear o JID do Dono para a chave que tem o dinheiro (R$ 300K)
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }

    // Chave no formato Grupo-Usuário (usando o JID mapeado)
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