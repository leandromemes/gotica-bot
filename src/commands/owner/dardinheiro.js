import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../config.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O comando está em src/commands/owner/, então sobe 3 níveis para chegar na raiz
const BASE_DIR = path.resolve(__dirname, '..', '..', '..');
const SALDO_FILE = "saldo-real"; 

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE_NUMBER = '556391330669';

const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  }).format(valor);

function getPaths() {
  const databaseDir = path.resolve(BASE_DIR, 'database'); 
  if (!fs.existsSync(databaseDir)) fs.mkdirSync(databaseDir, { recursive: true });
  
  const saldoPath = path.resolve(databaseDir, `${SALDO_FILE}.json`);
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}), 'utf8');
  return { saldoPath };
}

export default {
  name: "dardinheiro",
  description: "Comando exclusivo do dono para adicionar saldo a um membro.",
  commands: ["dardinheiro", "darbot", "addmoney", "gerar"],
  usage: `${PREFIX}dardinheiro valor (mencione ou responda)`,
  
  handle: async ({ remoteJid, userLid, args, isReply, replyLid, mentionedJidList, sendReply, isOwner }) => {
    
    // VERIFICAÇÃO DE DONO
    const isActuallyOwner = isOwner || userLid.includes(DONO_PHONE_NUMBER) || userLid.includes(TARGET_JID_DONO);
    
    if (!isActuallyOwner) {
        return sendReply(`✨ 🚫 quem você pensa que é? Esse comando é só para meu dono *Leandro, aquele gostoso* 😎🔥`);
    }
    
    const valorFloat = parseFloat(args[0]);
    if (isNaN(valorFloat) || valorFloat <= 0) {
      return sendReply(`✨ ❌ Valor inválido. Use: ${PREFIX}dardinheiro 100 @membro`);
    }
    const valor = Math.floor(valorFloat);

    let destinatarioJid = isReply ? replyLid : (mentionedJidList ? mentionedJidList[0] : null);
    
    if (!destinatarioJid) {
        return sendReply(`✨ ⚠️ Você deve mencionar ou responder a mensagem da pessoa.`);
    }

    // Mapeamento de JID (Se você der dinheiro para si mesmo, cai no LID)
    let chaveDestino = destinatarioJid;
    if (destinatarioJid.includes(DONO_PHONE_NUMBER)) {
        chaveDestino = TARGET_JID_DONO; 
    }

    const { saldoPath } = getPaths();
    let saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const key = `${remoteJid}-${chaveDestino}`;

    if (!saldoData[key]) saldoData[key] = 0;
    saldoData[key] += valor;

    fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2), 'utf8');

    await sendReply(
      `✨ 👑 *DINHEIRO GERADO PELO DONO* 👑\n---------------------------------\n💰 Valor Adicionado: *${formatarReal(valor)}*\n🎯 Destinatário: @${destinatarioJid.split('@')[0]}\n📈 Novo Saldo: *${formatarReal(saldoData[key])}*\n---------------------------------\n_Obrigado pela generosidade, patrão!_`,
      [destinatarioJid]
    );
  },
};