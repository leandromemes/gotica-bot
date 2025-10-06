const { PREFIX } = require(`${BASE_DIR}/config`);
const { 
  isActiveRealGroup, 
} = require(`${BASE_DIR}/utils/database`); 
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real";

// JIDs FIXOS PARA O DONO (para mapeamento de chaves)
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// Função para formatar o saldo (consistente com trabalhar.js e saldo.js)
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

  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));

  return { saldoPath };
}

module.exports = {
  name: "rankricos",
  description: "Mostra o ranking dos membros com mais dinheiro no grupo.",
  commands: ["rankricos", "topreal", "rank"],
  usage: `${PREFIX}rankricos`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, sendReply, getGroupParticipants }) => {
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const { saldoPath } = getPaths();
    const allSaldoData = JSON.parse(fs.readFileSync(saldoPath));
    const groupParticipants = await getGroupParticipants(remoteJid);
    
    // 2. Filtra e mapeia os saldos, CORRIGINDO O JID DO DONO NO PROCESSO
    const groupMembersSaldo = groupParticipants
        .map(participant => {
            const memberJid = participant.id;
            
            // CORREÇÃO 2: Se o participante for o Dono, usa a chave LID para ler o saldo
            let jidToUse = memberJid;
            if (memberJid.includes(DONO_PHONE)) {
                jidToUse = TARGET_JID_DONO;
            }

            // A chave precisa ser no formato JID-JID (Grupo-Usuário ou Grupo-LID)
            const key = `${remoteJid}-${jidToUse}`; 
            const saldo = allSaldoData[key] || 0;
            
            // Retorna o JID REAL do participante para menção, mas o saldo da chave correta
            return { memberJid, saldo };
        })
        .filter(item => item.saldo > 0) 
        .sort((a, b) => b.saldo - a.saldo)
        .slice(0, 10); 

    // 3. Monta a mensagem de ranking
    let rankingMessage = `
✨ 👑 *TOP 10 MEMBROS MAIS RICOS* (GRUPO)
---------------------------------
`;
    const mentions = [];
    
    if (groupMembersSaldo.length === 0) {
        rankingMessage += "Nenhum membro possui Reais (R$) ainda. Comece a trabalhar com !trabalhar!";
    } else {
        groupMembersSaldo.forEach((item, index) => {
            const rank = index + 1;
            const formattedSaldo = formatarReal(item.saldo);
            
            // Garante que o JID real seja adicionado à lista de menções
            mentions.push(item.memberJid);
            
            // Pega a parte do JID antes do @ para a exibição
            const mentionedJidPrefix = item.memberJid.split('@')[0];

            // CORREÇÃO 3: Adiciona a quebra de linha (\n) após cada item para separar
            rankingMessage += `${rank}º | @${mentionedJidPrefix} - *${formattedSaldo}*\n`;
        });
        
        rankingMessage += `\n---------------------------------
💰 Use ${PREFIX}trabalhar para entrar no ranking!`;
    }

    // Envia a resposta mencionando todos os membros do ranking
    await sendReply(rankingMessage.trim(), mentions);
  },
};