import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, '..', '..', '..');
const SALDO_FILE = "saldo-real"; 

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE_NUMBER = '556391330669';

export default {
  name: "resetar",
  description: "Zera a economia apenas deste grupo.",
  commands: ["resetar", "zerarsaldos", "resetgrupo"],
  usage: "!resetar",

  handle: async ({ remoteJid, userLid, sendReply, isOwner, sendReact }) => {
    
    const isActuallyOwner = isOwner || userLid.includes(DONO_PHONE_NUMBER) || userLid.includes(TARGET_JID_DONO);
    
    if (!isActuallyOwner) {
        return sendReply(`✨ 🚫 quem você pensa que é? Esse comando é só para meu dono *Leandro, aquele gostoso* 😎🔥`);
    }

    try {
      await sendReact("⏳");

      const databaseDir = path.resolve(BASE_DIR, 'database');
      const saldoPath = path.resolve(databaseDir, `${SALDO_FILE}.json`);

      if (!fs.existsSync(saldoPath)) {
        return sendReply("✨ ⚠️ O banco de dados está vazio.");
      }

      // 1. Lê os dados atuais
      let saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
      
      // 2. Filtra: Remove apenas as entradas deste grupo (remoteJid)
      const chavesAntes = Object.keys(saldoData).length;
      
      // Criamos um novo objeto sem as chaves desse grupo
      const novoSaldoData = Object.fromEntries(
        Object.entries(saldoData).filter(([key]) => !key.startsWith(remoteJid))
      );

      const chavesDepois = Object.keys(novoSaldoData).length;
      const removidos = chavesAntes - chavesDepois;

      if (removidos === 0) {
        return sendReply("✨ ⚠️ Não encontrei nenhum saldo registrado neste grupo para limpar.");
      }

      // 3. Salva o banco de dados atualizado (mantendo os outros grupos intactos)
      fs.writeFileSync(saldoPath, JSON.stringify(novoSaldoData, null, 2), 'utf8');

      await sendReact("✅");

      const mensagem = `
🧹 *LIMPEZA LOCAL CONCLUÍDA* 🧹
------------------------------------------
👑 *AUTORIZAÇÃO:* LEANDRO (DONO)
📉 *ESTADO:* Economia Resetada
📍 *LOCAL:* Apenas este grupo

Todos os *${removidos}* usuários deste grupo voltaram ao saldo zero. Os demais grupos não foram afetados.
------------------------------------------
_O grupo foi limpo com precisão, patrão!_ 💅✨`.trim();

      await sendReply(mensagem);

    } catch (error) {
      console.error("Erro ao resetar grupo:", error);
      await sendReply("✨ ❌ Erro ao tentar limpar os saldos do grupo.");
    }
  },
};