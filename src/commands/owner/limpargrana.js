const { PREFIX } = require(`${BASE_DIR}/config`);
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real"; 

// JIDs FIXOS PARA O DONO (CHECA O JID NORMAL E O JID MESTRE)
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

module.exports = {
  name: "limpargrana",
  description: "Zera os saldos de todos os membros do grupo atual",
  commands: ["limpargrana"],
  usage: `${PREFIX}limpargrana`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ userJid, remoteJid, sendReply }) => {
    
    // CORREÇÃO 2: Checagem de Dono robusta
    const isOwner = userJid.includes(DONO_PHONE) || userJid.includes(TARGET_JID_DONO);
    
    if (!isOwner) {
      return sendReply(
        "🚨 Quem você pensa que é?\n\nEsse comando é exclusivo para o *ser supremo*, meu dono *Leandro*, aquele gostoso 😏❤️"
      );
    }

    // Usando path.resolve para garantir o caminho correto
    const saldoPath = path.resolve(`${BASE_DIR}/database/${SALDO_FILE}.json`); 

    if (!fs.existsSync(saldoPath)) {
      return sendReply("⚠️ Nenhum dado de saldo encontrado ainda.");
    }

    const data = JSON.parse(fs.readFileSync(saldoPath));
    let alterado = false;

    // Lógica para deletar chaves que COMEÇAM com o JID do grupo atual
    for (const key in data) {
      if (key.startsWith(remoteJid)) {
        delete data[key];
        alterado = true;
      }
    }

    if (!alterado) {
      return sendReply("✅ Não havia nenhum saldo para limpar neste grupo.");
    }

    fs.writeFileSync(saldoPath, JSON.stringify(data, null, 2));

    return sendReply(
      "💥 *Saldos Detonados com Sucesso!* 💥\n\nTodos os saldos deste grupo foram zerados.   Assinado: *Leandro*, o destruidor de fortunas! 💸🔥"
    );
  },
};