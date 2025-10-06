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
  name: "pagar",
  description: "Transfere dinheiro para outra pessoa (responda a mensagem da pessoa)",
  commands: ["pagar", "pix", "paga"],
  usage: `Responda a mensagem da pessoa com ${PREFIX}pagar valor`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, args, isReply, replyJid, sendReply, getGroupName }) => {
    // 1. Checagem do modo real
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    // 2. Checagem de resposta
    if (!isReply) {
      return sendReply(`✨ ⚠️ Use o comando ${PREFIX}pagar *respondendo* a mensagem da pessoa para quem deseja transferir.\n\nExemplo: Responda uma mensagem com:\n${PREFIX}pagar 10`);
    }

    // 3. Validação do Valor
    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero (sem centavos).");
    }

    // 4. Bloqueio de Pix para Si Mesmo
    if (replyJid === userJid) {
      return sendReply("✨ ❌ Você não pode transferir para si mesmo.");
    }
    
    // 5. Bloqueio para JIDs de Grupo
    if (replyJid.endsWith("@g.us")) {
        return sendReply("✨ ❌ Não é possível fazer Pix para este grupo.");
    }
    
    // 6. Carregamento de Dados
    const { data, saldoPath } = loadSaldoData();
    
    // CORREÇÃO 2: Mapeamento de JID para o REMETENTE (Você)
    let remetenteJidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        remetenteJidToUse = TARGET_JID_DONO; 
    }

    // Mapeamento de JID para o DESTINATÁRIO
    let destinatarioJidToUse = replyJid;
    if (replyJid.includes(DONO_PHONE)) {
        destinatarioJidToUse = TARGET_JID_DONO; 
    }

    // A chave agora usa o JID mapeado
    const remetenteKey = `${remoteJid}-${remetenteJidToUse}`;
    const destinatarioKey = `${remoteJid}-${destinatarioJidToUse}`;

    if (!data[remetenteKey]) data[remetenteKey] = 0;
    if (!data[destinatarioKey]) data[destinatarioKey] = 0;

    const valorFormatado = formatarReal(valor);

    // 7. Checagem de Saldo
    if (data[remetenteKey] < valor) {
      const saldoAtualFormatado = formatarReal(data[remetenteKey]);
      return sendReply(`✨ ❌ Saldo insuficiente. Seu saldo atual é de *${saldoAtualFormatado}*.`);
    }

    // 8. Atualiza Saldos
    data[remetenteKey] -= valor;
    data[destinatarioKey] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2));

    // 9. Envia Sucesso com Menção
    const grupoNome = await getGroupName(remoteJid) || "este grupo";
    
    await sendReply(
      `✨ 💸 *Transferência de ${valorFormatado}* feita com sucesso!
---------------------------------
💰 Remetente: Você
🏦 Destinatário: @${replyJid.split('@')[0]}
Grupo: ${grupoNome}`,
      [replyJid]
    );
  },
};