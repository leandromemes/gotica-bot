/**
 * Correção Final para o comando !dardinheiro
 * Corrigindo a checagem de Dono
 */
const fs = require("fs");
const path = require("path");
const { PREFIX } = require(`${BASE_DIR}/config`);
// Removendo a importação de isBotOwner, pois está falhando.

const SALDO_FILE = "saldo-real"; 
const MIN_FRACTION_DIGITS = 2; 

// JIDs FIXOS PARA O DONO
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// FUNÇÕES DE MANIPULAÇÃO DE ARQUIVO (Mantidas)
function getPaths() {
  const databaseDir = path.resolve(`${BASE_DIR}/database`);
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }
  const saldoPath = path.resolve(`${databaseDir}/${SALDO_FILE}.json`);
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
  return { saldoPath };
}

function updateRealSaldo(key, amount) {
    const { saldoPath } = getPaths(); 
    let saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));

    if (!saldoData[key]) {
        saldoData[key] = 0;
    }
    saldoData[key] += amount;

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
  name: "dardinheiro",
  commands: ["dardinheiro", "darbot", "adicionarbot"],
  usage: `${PREFIX}dardinheiro valor (mencione ou responda)`,
  
  handle: async ({ remoteJid, userJid, args, isReply, replyJid, mentionedJidList, sendReply, isLid, pushName }) => {
    
    // CORREÇÃO DE DONO (VERIFICAÇÃO MANUAL POR JID)
    const isOwner = userJid.includes(DONO_PHONE) || userJid.includes(TARGET_JID_DONO);
    
    if (!isOwner) {
        return sendReply(`✨ 🚫 quem você pensa que é? Esse comando é só para meu dono *Leandro, aquele gostoso* 😎🔥`);
    }
    // ----------------------------------------------------------------------------------------
    
    let valorFloat = parseFloat(args[0]);
    let valor = Math.floor(Math.abs(valorFloat)); 

    if (isNaN(valor) || valor <= 0) {
      return sendReply(`✨ ❌ Valor inválido. Use: ${PREFIX}dardinheiro 100 @membro`);
    }

    let destinatarioJid = replyJid; 
    if (!destinatarioJid && mentionedJidList && mentionedJidList.length > 0) {
        destinatarioJid = mentionedJidList[0];
    }
    
    if (!destinatarioJid) {
        return sendReply(`✨ ⚠️ Você deve mencionar ou responder a mensagem da pessoa para quem deseja dar dinheiro.`);
    }

    let chaveDeDestino = destinatarioJid;

    // MANTÉM A CORREÇÃO DO SALDO (FORÇA O USO DA CHAVE QUE O !SALDO LÊ)
    if (destinatarioJid.includes(DONO_PHONE)) {
        chaveDeDestino = TARGET_JID_DONO; 
    }

    const destinatarioKey = `${remoteJid}-${chaveDeDestino}`;
    
    let valorFormatado = formatarReal(valor);

    // ESCREVE NA CHAVE CORRETA
    const novoDados = updateRealSaldo(destinatarioKey, valor);

    await sendReply(
      `
✨ 👑 *DINHEIRO DADO PELO DONO* 👑
---------------------------------
💰 Valor Adicionado: *${valorFormatado}*
🎯 Destinatário: @${destinatarioJid.split('@')[0]}
📈 Novo Saldo: ${formatarReal(novoDados.balance)}
---------------------------------
_(Comando ${PREFIX}dardinheiro)_
    `.trim(),
      [destinatarioJid]
    );
  },
};