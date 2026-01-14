import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";

export default {
  name: "sorteio",
  description: "Realiza um sorteio entre os membros do grupo.",
  commands: ["sorteio", "sortear"],
  usage: `${PREFIX}sorteio nome-do-prêmio`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    remoteJid,
    args,
    sendReply,
    sendText,
    getGroupMetadata,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupos.");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        `Você deve fornecer o nome do prêmio.\n\nExemplo: ${PREFIX}sorteio Um Pix de R$50`
      );
    }

    try {
      // Obtém metadados do grupo
      const groupMetadata = await getGroupMetadata(); 

      // Filtra participantes válidos (apenas pessoas reais)
      const participants = groupMetadata.participants
        .filter((p) => !p.id.endsWith("@g.us") && !p.id.includes("broadcast"))
        .map((p) => p.id);

      if (participants.length === 0) {
        return await sendReply("⚠️ Não foi possível realizar o sorteio. Nenhum participante válido encontrado.");
      }

      // Sorteia um participante aleatório
      const sorteado = participants[
        Math.floor(Math.random() * participants.length)
      ];

      const premio = args.join(" ");

      // Formatação da mensagem
      const mensagem = `🎉 Parabéns @${sorteado.split("@")[0]}, você acaba de ser contemplado(a) como o(a) ganhador(a) do sorteio...\n\n✦ *Prêmio:* ${premio}\n\nEntre em contato com o(a) adm responsável!`;

      // Envia a mensagem com a menção
      await sendText(mensagem, [sorteado]); 

    } catch (error) {
      console.error("Erro no comando !sorteio:", error);
      await sendReply("❌ Ocorreu um erro ao realizar o sorteio.");
    }
  },
};