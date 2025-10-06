const { PREFIX } = require(`${BASE_DIR}/config`);
const { isActiveRealGroup } = require(`${BASE_DIR}/utils/database`);
const fs = require("fs");
const path = require("path");

// CORREÇÃO 1: Nome do arquivo alinhado com o que funciona
const SALDO_FILE = "saldo-real";
const COOLDOWN_FILE = "assaltar-cooldown"; 

// JIDs FIXOS PARA O DONO: Chave mestra do seu sistema de economia
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

// Função para formatar o saldo (consistente com saldo.js e trabalhar.js)
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

  // 2. Define o caminho completo dos arquivos dentro da pasta
  const saldoPath = path.resolve(`${databaseDir}/${SALDO_FILE}.json`);
  const cooldownPath = path.resolve(`${databaseDir}/${COOLDOWN_FILE}.json`);

  // 3. Garante que os arquivos existam
  if (!fs.existsSync(saldoPath)) fs.writeFileSync(saldoPath, JSON.stringify({}));
  if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, JSON.stringify({}));

  return { saldoPath, cooldownPath };
}

module.exports = {
  name: "assaltar",
  description: "Tente roubar dinheiro de um membro aleatório ou leve um esculacho da polícia!",
  commands: ["assaltar", "roubar"],
  usage: `${PREFIX}assaltar`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, sendReply, getGroupMetadata }) => {
    if (!isActiveRealGroup(remoteJid)) {
      return sendReply("⚠️ O modo real não está ativado neste grupo.");
    }

    if (!remoteJid.endsWith("@g.us")) {
      return sendReply("❌ Este comando só pode ser usado em grupos.");
    }

    const { saldoPath, cooldownPath } = getPaths();
    const saldoData = JSON.parse(fs.readFileSync(saldoPath));
    const cooldownData = JSON.parse(fs.readFileSync(cooldownPath));

    // CORREÇÃO 2: Mapeamento de JID para o Dono
    let jidToUse = userJid;
    if (userJid.includes(DONO_PHONE)) {
        jidToUse = TARGET_JID_DONO; 
    }

    // A chave agora usa o JID mapeado para o cooldown
    const userKey = `${remoteJid}-${jidToUse}`; 
    const now = Date.now();
    const tempoDeEspera = 60 * 1000; // 1 minuto

    if (cooldownData[userKey] && now - cooldownData[userKey] < tempoDeEspera) {
      const restante = Math.ceil((tempoDeEspera - (now - cooldownData[userKey])) / 1000);
      return sendReply(`⏳ Espere *${restante} segundos* para tentar assaltar novamente.`);
    }

    cooldownData[userKey] = now;
    // O cooldown é salvo antes da tentativa. Se falhar no roubo, ainda entra em cooldown.
    fs.writeFileSync(cooldownPath, JSON.stringify(cooldownData, null, 2));

    const chance = Math.random(); // 0 a 1

    // 🎲 50% de chance de sucesso
    if (chance <= 0.5) {
      const grupoInfo = await getGroupMetadata(remoteJid);
      
      const membros = grupoInfo.participants
        .map(p => p.id)
        // Filtra o próprio usuário e contas de bot/outros que não são "@s.whatsapp.net"
        // e garante que a chave do Dono seja a LID para que ele não roube de si mesmo se a chave for a LID
        .filter(id => id !== userJid && id !== TARGET_JID_DONO && id.endsWith("s.whatsapp.net"));

      if (membros.length < 1) {
        return sendReply("😕 Não há outros membros para assaltar no grupo.");
      }

      const vitima = membros[Math.floor(Math.random() * membros.length)];
      const vitimaJidParaMencao = vitima.split('@')[0]; 
      
      // A chave da vítima é sempre o JID normal ou a LID se a vítima for o Dono (que não deve ocorrer)
      const vitimaKey = `${remoteJid}-${vitima}`;
      
      // Gera um número aleatório entre R$50 e R$300.
      const valor = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
      const valorFormatado = formatarReal(valor);

      if (!saldoData[vitimaKey]) saldoData[vitimaKey] = 0;
      if (!saldoData[userKey]) saldoData[userKey] = 0; // Usa a chave corrigida do assaltante

      // Garante que a vítima tem saldo para ser roubada
      if (saldoData[vitimaKey] < valor) {
        return sendReply(`🤷 Você tentou assaltar @${vitimaJidParaMencao}, mas ele(a) só tinha *${formatarReal(saldoData[vitimaKey])}*. O assalto falhou!`, [vitima]);
      }

      // 4. Atualiza Saldos
      saldoData[vitimaKey] -= valor;
      saldoData[userKey] += valor; // Usa a chave corrigida do assaltante
      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

      // 5. Envia Sucesso
      return sendReply(
        `🕵️ *Assalto bem-sucedido!*
---------------------------------
Você roubou 💸 *${valorFormatado}* de @${vitimaJidParaMencao}!
Seu novo saldo é: *${formatarReal(saldoData[userKey])}*`, // Usa a chave corrigida
        [vitima]
      );
    }

    // 🚓 Falhou (50% de chance), mensagem da polícia
    const frasesPolicia = [
      "🚨 *Aí é a polícia!* Tentando roubar trabalhador? Vai trabalhar, vagabundo(a)! 😠",
      "👮‍♂️ Você foi flagrado tentando assaltar! Digita !trabalhar e sai dessa vida 😤",
      "🧑‍✈️ Seu CPF já foi anotado... Mais uma tentativa e vai de cana!",
      "🚓 Roubando em grupo? Vai tomar *cadeia digital*!",
      "🚔 Tentativa de furto frustrada! Pegue sua pá e vá trabalhar!"
    ];
    const mensagem = frasesPolicia[Math.floor(Math.random() * frasesPolicia.length)];
    return sendReply(mensagem);
  }
};