const { PREFIX } = require(`${BASE_DIR}/config`);
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`);
const fs = require("fs");
const path = require("path");

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
  name: "doar", 
  description: "Doe uma quantia em dinheiro para outro membro (responda a mensagem)", 
  commands: ["doar", "caridade"], 
  usage: `Responda a mensagem da pessoa com ${PREFIX}doar valor`, 

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, args, isReply, replyJid, sendReply, getGroupName, pushName }) => {
    // 1. Checagem do modo real
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    // 2. Checagem de resposta
    if (!isReply) {
      return sendReply(`✨ ⚠️ Use o comando ${PREFIX}doar *respondendo* a mensagem da pessoa para quem deseja doar.\n\nExemplo: Responda uma mensagem com:\n${PREFIX}doar 10`);
    }

    // 3. Validação do Valor
    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero (sem centavos).");
    }

    // 4. Bloqueio para Si Mesmo
    if (replyJid === userJid) {
      return sendReply("✨ ❌ Você não pode doar para si mesmo.");
    }
    
    // 5. Bloqueio para JIDs de Grupo
    if (replyJid.endsWith("@g.us")) {
        return sendReply("✨ ❌ Não é possível doar para este grupo.");
    }
    
    // 6. Carregamento de Dados
    const { data, saldoPath } = loadSaldoData();
    
    // CORREÇÃO 2: Mapeamento de JID para o REMETENTE (Você)
    let remetenteJidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        remetenteJidToUse = TARGET_JID_DONO; 
    }

    // O destinatário pode ser qualquer JID, inclusive o Dono, então checamos a chave dele também.
    let destinatarioJidToUse = replyJid;
    if (replyJid.includes(DONO_PHONE)) {
        destinatarioJidToUse = TARGET_JID_DONO; 
    }
    
    const remetenteKey = `${remoteJid}-${remetenteJidToUse}`;
    const destinatarioKey = `${remoteJid}-${destinatarioJidToUse}`;
    
    if (!data[remetenteKey]) data[remetenteKey] = 0;
    if (!data[destinatarioKey]) data[destinatarioKey] = 0;

    const valorFormatado = formatarReal(valor);

    // 7. Checagem de Saldo
    if (data[remetenteKey] < valor) {
      const saldoAtualFormatado = formatarReal(data[remetenteKey]);
      return sendReply(`✨ ❌ Saldo insuficiente para doar. Seu saldo atual é de *${saldoAtualFormatado}*.`);
    }

    // 8. Atualiza Saldos
    data[remetenteKey] -= valor;
    data[destinatarioKey] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2));

    // 9. Envia Sucesso com Menção
    const remetenteNome = pushName || userJid.split('@')[0];
    
    await sendReply(
      `✨ 🎁 *ATO DE CARIDADE!* 🎁
---------------------------------
🫂 Doação de *${valorFormatado}*
💖 De: ${remetenteNome} (@${userJid.split('@')[0]})
🎯 Para: @${replyJid.split('@')[0]}
---------------------------------
_A solidariedade faz a diferença!_`,
      [userJid, replyJid]
    );
  },
};