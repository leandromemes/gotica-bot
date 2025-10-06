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

// Função utilitária para mapear JID
function getMappedJid(jid) {
    if (jid.includes(DONO_PHONE)) {
        return TARGET_JID_DONO;
    }
    return jid;
}


module.exports = {
  name: "duelo",
  description: "Desafia outro membro para um duelo e apostam uma quantia.",
  commands: ["duelo"],
  usage: `Responda a mensagem da pessoa com ${PREFIX}duelo valor`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, args, isReply, replyJid, sendReply, getGroupMetadata, getGroupName }) => {
    // 1. Checagem do modo real
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }
    
    // 2. Validações Iniciais
    if (!isReply) {
      return sendReply(`✨ ⚠️ Use o comando ${PREFIX}duelo *respondendo* a mensagem da pessoa com quem deseja duelar.\n\nExemplo: Responda uma mensagem com:\n${PREFIX}duelo 10`);
    }

    const valorFloat = parseFloat(args[0]);
    const valor = Math.floor(valorFloat); 
    
    if (isNaN(valor) || valor <= 0) {
      return sendReply("✨ ❌ Valor inválido. Digite um número inteiro maior que zero (sem centavos).");
    }

    if (replyJid === userJid) {
      return sendReply("✨ ❌ Você não pode duelar com você mesmo.");
    }
    
    if (!replyJid.endsWith("@s.whatsapp.net")) {
        return sendReply("✨ ❌ O duelo deve ser com outro usuário, não com o bot ou grupo.");
    }
    
    // CORREÇÃO 2: Mapeamento dos JIDs
    const desafianteJidToUse = getMappedJid(userJid);
    const desafiadoJidToUse = getMappedJid(replyJid);

    // 3. Carregamento e Checagem de Saldo
    const { data, saldoPath } = loadSaldoData();

    // Chaves Corretas
    const desafianteKey = `${remoteJid}-${desafianteJidToUse}`;
    const desafiadoKey = `${remoteJid}-${desafiadoJidToUse}`;
    
    if (!data[desafianteKey]) data[desafianteKey] = 0;
    if (!data[desafiadoKey]) data[desafiadoKey] = 0;

    const valorFormatado = formatarReal(valor);

    if (data[desafianteKey] < valor || data[desafiadoKey] < valor) {
      let msg = `✨ ❌ Ambos os duelistas devem ter *${valorFormatado}* de saldo para duelar.`;
      
      if (data[desafianteKey] < valor) {
          msg += `\nSeu saldo (${formatarReal(data[desafianteKey])}) é insuficiente.`;
      }
      if (data[desafiadoKey] < valor) {
          msg += `\nO saldo do desafiado (${formatarReal(data[desafiadoKey])}) é insuficiente.`;
      }
      return sendReply(msg);
    }
    
    // 4. Lógica do Duelo
    const vencedores = [desafianteJidToUse, desafiadoJidToUse]; // Usa as chaves mapeadas aqui
    const vencedorJidToUse = vencedores[Math.floor(Math.random() * vencedores.length)];
    const perdedorJidToUse = vencedorJidToUse === desafianteJidToUse ? desafiadoJidToUse : desafianteJidToUse;
    
    // As chaves para escrita são as chaves mapeadas
    const vencedorKey = `${remoteJid}-${vencedorJidToUse}`;
    const perdedorKey = `${remoteJid}-${perdedorJidToUse}`;

    // 5. Ajusta os saldos (vencedor ganha o valor, perdedor perde o valor)
    data[vencedorKey] += valor;
    data[perdedorKey] -= valor;

    // 6. Salva os dados
    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2));
    
    // 7. Envio da Mensagem Final (Usa os JIDs REAIS para menção)
    
    const vencedorJidParaMencao = vencedorJidToUse === desafianteJidToUse ? userJid.split('@')[0] : replyJid.split('@')[0];
    const perdedorJidParaMencao = perdedorJidToUse === desafianteJidToUse ? userJid.split('@')[0] : replyJid.split('@')[0];

    await sendReply(
      `
⚔️ *DUELO ENCERRADO* ⚔️
---------------------------------
🔥 Valor Apostado: *${valorFormatado}*
    
🥇 Vencedor: @${vencedorJidParaMencao}
💸 Ganho: *+${valorFormatado}*
    
💔 Perdedor: @${perdedorJidParaMencao}
💀 Perda: *-${valorFormatado}*
---------------------------------
    `.trim(),
      // Menção deve usar os JIDs REAIS
      [userJid, replyJid] 
    );
  },
};