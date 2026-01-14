import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX } from "../../../config.js"; 
import { isActiveRealGroup } from "../../../utils/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sobe 4 níveis para a raiz
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const SALDO_FILE = "saldo-real.json";

// Configurações de Identidade do Dono
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE_NUMBER = '556391330669';

const formatarReal = (valor) => 
  new Intl.NumberFormat("pt-BR", { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  }).format(valor);

export default {
  name: "rankricos",
  description: "Mostra o ranking dos membros com mais dinheiro no grupo.",
  commands: ["rankricos", "topreal", "rank", "ricos"],
  usage: `${PREFIX}rankricos`,

  handle: async ({ remoteJid, sendReply, getGroupParticipants }) => {
    
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    const saldoPath = path.resolve(BASE_DIR, 'database', SALDO_FILE);

    if (!fs.existsSync(saldoPath)) {
        return sendReply("✨ 👑 *Ranking Vazio*\nNinguém possui saldo neste grupo ainda.");
    }

    const allSaldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
    const groupParticipants = await getGroupParticipants(remoteJid);
    
    const groupMembersSaldo = groupParticipants
        .map(participant => {
            const memberJid = participant.id;
            
            // Lógica de mapeamento: se o JID do participante for o seu número, usa o LID para buscar o saldo
            let jidToSearch = memberJid;
            if (memberJid.includes(DONO_PHONE_NUMBER)) {
                jidToSearch = TARGET_JID_DONO;
            }

            const key = `${remoteJid}-${jidToSearch}`; 
            const saldo = allSaldoData[key] || 0;
            
            return { memberJid, saldo };
        })
        .filter(item => item.saldo > 0) 
        .sort((a, b) => b.saldo - a.saldo)
        .slice(0, 10); 

    let rankingMessage = `✨ 👑 *TOP 10 MAIS RICOS* 👑\n---------------------------------\n`;
    const mentions = [];
    
    if (groupMembersSaldo.length === 0) {
        rankingMessage += "Nenhum membro possui Reais (R$) ainda. Comece a trabalhar!";
    } else {
        groupMembersSaldo.forEach((item, index) => {
            const rank = index + 1;
            const medalha = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}º`;
            
            mentions.push(item.memberJid);
            const userPhone = item.memberJid.split('@')[0];

            rankingMessage += `${medalha} | @${userPhone}\n💰 *${formatarReal(item.saldo)}*\n\n`;
        });
        
        rankingMessage += `---------------------------------\n_Use ${PREFIX}trabalhar para subir no ranking!_`;
    }

    await sendReply(rankingMessage.trim(), mentions);
  },
};