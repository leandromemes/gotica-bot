/**
 * Direcionador
 * de comandos.
 *
 * @author Dev Gui
 * @modified para Modo Deus (Leandro)
 */
import { BOT_EMOJI, ONLY_GROUP_ID } from "../config.js";
import {
  DangerError,
  InvalidParameterError,
  WarningError,
} from "../errors/index.js";
import {
  checkPermission,
  hasTypeAndCommand,
  isAdmin,
  isBotOwner,
  isLink,
  verifyPrefix,
} from "../middlewares/index.js";
import { badMacHandler } from "./badMacHandler.js";
import {
  getAutoResponderResponse,
  getPrefix,
  isActiveAntiLinkGroup,
  isActiveAutoResponderGroup,
  isActiveGroup,
  isActiveOnlyAdmins,
  getBlockedCommands, // Adicionado para trava de comandos
} from "./database.js";
import { findCommandImport } from "./index.js";
import { errorLog } from "./logger.js";

/**
 * @param {CommandHandleProps} paramsHandler
 * @param {number} startProcess
 */
export async function dynamicCommand(paramsHandler, startProcess) {
  const {
    commandName,
    fullMessage,
    prefix,
    remoteJid,
    sendErrorReply,
    sendReact,
    sendReply,
    sendWarningReply,
    socket,
    userLid,
    webMessage,
  } = paramsHandler;

  const activeGroup = isActiveGroup(remoteJid);
  const isOwner = isBotOwner({ userLid }); // Verifica se é o Deus (Leandro)

  // --- TRAVA ANTI-LINK (IGNORA SE FOR O DONO) ---
  if (activeGroup && isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userLid) {
      return;
    }

    // Se não for ADM E não for o Dono, remove.
    if (!(await isAdmin({ remoteJid, userLid, socket })) && !isOwner) {
      await socket.groupParticipantsUpdate(remoteJid, [userLid], "remove");

      await sendReply(
        "🚫 *LIXO NO LIXO!* Anti-link ativado. Você foi removido por tentar sujar meu grupo com links. Tchau, gracinha! 👋💅"
      );

      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
        },
      });

      return;
    }
  }

  const { type, command } = await findCommandImport(commandName);

  // --- TRAVA DE COMANDO BLOQUEADO (O DONO IGNORA) ---
  if (activeGroup && !isOwner && commandName) {
    const blockedCmds = getBlockedCommands(remoteJid);
    if (blockedCmds.includes(commandName)) {
      await sendWarningReply(
        `🛑 *COMANDO DESATIVADO!* O comando *${prefix}${commandName}* foi bloqueado neste grupo pelos superiores. Não adianta insistir! 🤫`
      );
      return;
    }
  }

  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  if (activeGroup) {
    if (
      !verifyPrefix(prefix, remoteJid) ||
      !hasTypeAndCommand({ type, command })
    ) {
      if (isActiveAutoResponderGroup(remoteJid)) {
        const response = getAutoResponderResponse(fullMessage);

        if (response) {
          await sendReply(response);
        }
      }

      if (fullMessage.toLocaleLowerCase().includes("prefixo")) {
        await sendReact(BOT_EMOJI);
        const groupPrefix = getPrefix(remoteJid);
        await sendReply(
          `🙄 Esqueceu? O prefixo é: *${groupPrefix}*\nUse *${groupPrefix}menu* e tente não se perder, plebeu!`
        );
      }

      return;
    }

    // --- VERIFICAÇÃO DE PERMISSÃO (MODO DEUS) ---
    if (!(await checkPermission({ type, ...paramsHandler })) && !isOwner) {
      const msgDeboche = type === "owner" 
        ? "🛑 *ALTO LÁ!* Esse comando é restrito ao meu *Dono e Mestre Supremo Leandro*. Você não tem brilho suficiente para tocar nisso! ✨👑"
        : "🤨 *Quem você pensa que é?* Esse comando é sagrado para os ADMs. Você é só mais um plebeu na minha lista... volte para o seu lugar! 🤫";
      
      await sendErrorReply(msgDeboche);
      return;
    }

    // --- MODO SÓ ADM (LIBERADO PARA O DONO) ---
    if (
      isActiveOnlyAdmins(remoteJid) &&
      !(await isAdmin({ remoteJid, userLid, socket })) && 
      !isOwner
    ) {
      await sendWarningReply(
        "💅 *Cof cof...* achei que eu tinha ouvido um ADM falar, mas era só um membro comum. Só os chefes mandam aqui agora!"
      );
      return;
    }
  }

  // --- TRAVA DE GRUPO DESATIVADO (LIBERADO PARA O DONO) ---
  if (!isOwner && !activeGroup) {
    if (
      verifyPrefix(prefix, remoteJid) &&
      hasTypeAndCommand({ type, command })
    ) {
      if (command.name !== "on") {
        await sendWarningReply(
          "🥱 *Que tédio...* Este grupo está desativado. Peça para o dono do grupo me acordar se ele tiver coragem!"
        );
        return;
      }

      if (!(await checkPermission({ type, ...paramsHandler }))) {
        await sendErrorReply(
          "🚫 *ACESSO NEGADO!* Você não tem os privilégios necessários para me dar ordens assim."
        );
        return;
      }
    } else {
      return;
    }
  }

  if (!verifyPrefix(prefix, remoteJid)) {
    return;
  }

  const groupPrefix = getPrefix(remoteJid);

  if (fullMessage === groupPrefix) {
    await sendReact(BOT_EMOJI);
    await sendReply(
      `Sente o peso do meu prefixo! Use *${groupPrefix}menu* para ver o que eu posso fazer por você (se eu estiver a fim). 😘`
    );

    return;
  }

  if (!hasTypeAndCommand({ type, command })) {
    await sendWarningReply(
      `🤔 *Tá inventando comando?* Isso não existe! Use *${groupPrefix}menu* e aprenda a ler as opções disponíveis.`
    );

    return;
  }

  // --- EXECUÇÃO DO COMANDO ---
  try {
    await command.handle({
      ...paramsHandler,
      type,
      startProcess,
    });
  } catch (error) {
    if (badMacHandler.handleError(error, `command:${command?.name}`)) {
      await sendWarningReply(
        "🙄 *Ai, que cansaço...* Erro de sincronização. Tente de novo em alguns segundos."
      );
      return;
    }

    if (badMacHandler.isSessionError(error)) {
      errorLog(
        `Erro de sessão durante execução de comando ${command?.name}: ${error.message}`
      );
      await sendWarningReply(
        "🔌 *Opa!* Tive um apagão aqui. Tente executar o comando novamente."
      );
      return;
    }

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`❌ *Burrice detectada!* Parâmetros errados. ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(`⚠️ *Atenção, mortal:* ${error.message}`);
    } else if (error instanceof DangerError) {
      await sendErrorReply(`🔥 *PERIGO:* ${error.message}`);
    } else if (error.isAxiosError) {
      const messageText = error.response?.data?.message || error.message;
      await sendErrorReply(
        `💥 *API explodiu!* O comando ${command.name} tentou falar com o mundo lá fora e falhou.\n\n📄 *Detalhes*: ${messageText}`
      );
 
   } else {
      errorLog("Erro ao executar comando", error);
      await sendErrorReply(
        `🤦‍♀️ *Que mico!* Ocorreu um erro no comando ${command.name}!\n\n📄 *Detalhes*: ${error.message}`
      );
    }
  }
}