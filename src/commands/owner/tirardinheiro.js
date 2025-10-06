/**
 * Comando !tirardinheiro - Versão Corrigida com Checagem de Dono e JID
 * Remove dinheiro do saldo de um membro.
 */
const fs = require("fs");
const path = require("path");
const { PREFIX } = require(`${BASE_DIR}/config`);

const SALDO_FILE = "saldo-real"; 
const MIN_FRACTION_DIGITS = 0; // Usaremos 0, já que o resto do sistema usa.

// JIDs FIXOS PARA O DONO (CORREÇÃO DE CHAVE MESTRA)
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// FUNÇÕES DE MANIPULAÇÃO DE ARQUIVO
function getPaths() {
  const databaseDir = path.resolve(`${BASE_DIR}/database`);
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }
  const saldoPath = path.resolve(`${databaseDir}/${SALDO_FILE}.json`);
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
  return { saldoPath };
}

// FUNÇÃO MODIFICADA PARA SUBTRAIR
function updateRealSaldo(key, amount) {
    const { saldoPath } = getPaths(); 
    let saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));

    if (!saldoData[key]) {
        saldoData[key] = 0;
    }
    
    // VERIFICA SE O VALOR A REMOVER É MAIOR QUE O SALDO, E ZERA SE FOR.
    if (saldoData[key] < amount) {
        saldoData[key] = 0;
    } else {
        saldoData[key] -= amount; // SUBTRAÇÃO
    }
    
    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));
    
    return { balance: saldoData[key] };
}
// -----------------------------------------------------------

const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: MIN_FRACTION_DIGITS 
  }).format(valor);


module.exports = {
  name: "tirardinheiro",
  commands: ["tirardinheiro", "removerbot", "removergrana"],
  usage: `${PREFIX}tirardinheiro valor (mencione ou responda)`,
  
  handle: async ({ remoteJid, userJid, args, isReply, replyJid, mentionedJidList, sendReply }) => {
    
    // CHECAGEM DE DONO (Obrigatória para este comando)
    const isOwner = userJid.includes(DONO_PHONE) || userJid.includes(TARGET_JID_DONO);
    
    if (!isOwner) {
        // Mensagem de erro para não-Donos
        return sendReply(`✨ 🚫 quem você pensa que é? Esse comando é só para meu dono *Leandro, aquele gostoso* 😎🔥`);
    }
    // ----------------------------------------------------------------------------------------
    
    let valorFloat = parseFloat(args[0]);
    let valor = Math.floor(Math.abs(valorFloat)); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply(`✨ ❌ Valor inválido. Use: ${PREFIX}tirardinheiro 100 @membro`);
    }

    let destinatarioJid = replyJid; 
    if (!destinatarioJid && mentionedJidList && mentionedJidList.length > 0) {
        destinatarioJid = mentionedJidList[0];
    }
    
    if (!destinatarioJid) {
        return sendReply(`✨ ⚠️ Você deve mencionar ou responder a mensagem da pessoa de quem deseja remover o dinheiro.`);
    }

    // Mapeamento de JID para o Destinatário (checa se o destinatário é o Dono)
    let chaveDeDestino = destinatarioJid;
    if (destinatarioJid.includes(DONO_PHONE)) {
        chaveDeDestino = TARGET_JID_DONO; 
    }

    const destinatarioKey = `${remoteJid}-${chaveDeDestino}`;
    
    let valorFormatado = formatarReal(valor);

    // ESCREVE NA CHAVE CORRETA, SUBTRAINDO O VALOR
    const novoDados = updateRealSaldo(destinatarioKey, valor);
    
    const acao = novoDados.balance === 0 ? "ZERADO" : "REMOVIDO";

    await sendReply(
      `
✨ 👑 *DINHEIRO ${acao} PELO DONO* 👑
---------------------------------
💸 Valor ${acao}: *${valorFormatado}*
🎯 Destinatário: @${destinatarioJid.split('@')[0]}
📉 Novo Saldo: ${formatarReal(novoDados.balance)}
---------------------------------
_(Comando ${PREFIX}tirardinheiro)_
    `.trim(),
      [destinatarioJid]
    );
  },
};