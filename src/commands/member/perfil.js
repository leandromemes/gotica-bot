const { isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getProfileImageData } = require(`${BASE_DIR}/services/baileys`);

module.exports = {
  name: "perfil",
  description: "Mostra informações de um usuário",
  commands: ["perfil", "profile"],
  usage: `${PREFIX}perfil ou perfil @usuario`,

  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupo.");
    }

    const targetJid = args[0]
      ? args[0].replace(/[@ ]/g, "") + "@s.whatsapp.net"
      : userJid;

    await sendWaitReply("Carregando perfil...");

    try {
      let profilePicUrl;
      let userName;
      let userRole = "Membro";

      try {
        const { profileImage } = await getProfileImageData(socket, targetJid);
        profilePicUrl = profileImage || `${ASSETS_DIR}/images/default-user.png`;

        const contactInfo = await socket.onWhatsApp(targetJid);
        userName = contactInfo[0]?.name || "Usuário Desconhecido";
      } catch (error) {
        errorLog(`Erro ao tentar pegar dados do usuário ${targetJid}: ${JSON.stringify(error, null, 2)}`);
        profilePicUrl = `${ASSETS_DIR}/images/default-user.png`;
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === targetJid);
      if (participant?.admin) userRole = "Administrador";

      // Níveis aleatórios
      const gado = Math.floor(Math.random() * 101);
      const passivo = Math.floor(Math.random() * 101);
      const beleza = Math.floor(Math.random() * 101);
      const protagonismo = Math.floor(Math.random() * 101);
      const pobreza = Math.floor(Math.random() * 101);
      const gostosura = Math.floor(Math.random() * 101);
      const chatice = Math.floor(Math.random() * 101);
      const sebosidade = Math.floor(Math.random() * 101);
      const programa = (Math.random() * 5000 + 1000).toFixed(2);

      const conselhos = [
        "🌟 Conselho: nunca aceite menos do que você merece.",
        "💭 Conselho: evite tretas, beba água e mande memes.",
        "🧠 Conselho: pense duas vezes antes de stalkear seu ex.",
        "🔥 Conselho: se for brilhar, que ofusque os falsos.",
        "💅 Conselho: seja você mesmo, os outros que lutem.",
        "🫠 Conselho: dormir triste não, veja um meme antes.",
        "💣 Conselho: explode coração... mas não no grupo.",
        "🧘 Conselho: respire fundo... e bloqueie quem for tóxico.",
        "😂 Conselho: rir é o melhor remédio (desde que não seja você o meme).",
        "🚀 Conselho: foque no seu progresso, não nos comentários alheios."
      ];

      const conselhoAleatorio = conselhos[Math.floor(Math.random() * conselhos.length)];

      const mensagem = `
👤 *Nome:* @${targetJid.split("@")[0]}
🎖️ *Cargo:* ${userRole}

💰 *Programa:* R$ ${programa}
🐮 *Nível de Gadice:* ${gado}%
🎯 *Nível de Protagonismo:* ${protagonismo}%
💄 *Nível de Gostosura:* ${gostosura}%
💅 *Nível de Beleza:* ${beleza}%
🧼 *Nível de Sebosidade:* ${sebosidade}%
🤐 *Nível de Chatice:* ${chatice}%
🧺 *Nível de Pobreza:* ${pobreza}%
🎱 *Nível de Passividade:* ${passivo}%

${conselhoAleatorio}
`;

      await sendSuccessReact();
      await socket.sendMessage(remoteJid, {
        image: { url: profilePicUrl },
        caption: mensagem,
        mentions: [targetJid],
      });

    } catch (error) {
      console.error(error);
      sendErrorReply("Ocorreu um erro ao tentar verificar o perfil.");
    }
  },
};