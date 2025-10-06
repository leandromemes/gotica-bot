/**
 * Funções úteis para trabalhar
 * com dados.
 *
 * @author Dev Gui
 */
const path = require("node:path");
const fs = require("node:fs");
const { PREFIX } = require("../config");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const ANTI_LINK_GROUPS_FILE = "anti-link-groups";
const AUTO_RESPONDER_FILE = "auto-responder";
const AUTO_RESPONDER_GROUPS_FILE = "auto-responder-groups";
const EXIT_GROUPS_FILE = "exit-groups";
const GROUP_RESTRICTIONS_FILE = "group-restrictions";
const INACTIVE_GROUPS_FILE = "inactive-groups";
const MUTE_FILE = "muted";
const ONLY_ADMINS_FILE = "only-admins";
const PREFIX_GROUPS_FILE = "prefix-groups";
const RESTRICTED_MESSAGES_FILE = "restricted-messages";
const WELCOME_GROUPS_FILE = "welcome-groups";
// NOVO ARQUIVO DE GRUPOS DE ECONOMIA
const ECONOMY_GROUPS_FILE = "economy-groups"; 

function createIfNotExists(fullPath, formatIfNotExists = []) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify(formatIfNotExists));
  }
}

// 🚨 CORREÇÃO APLICADA: Agora exporta readJSON
exports.readJSON = (jsonFile, formatIfNotExists = []) => {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);

  createIfNotExists(fullPath, formatIfNotExists);

  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

// 🚨 CORREÇÃO APLICADA: Agora exporta writeJSON
exports.writeJSON = (jsonFile, data, formatIfNotExists = []) => {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`);

  createIfNotExists(fullPath, formatIfNotExists);

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}

exports.activateExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!exitGroups.includes(groupId)) {
    exitGroups.push(groupId);
  }

  exports.writeJSON(filename, exitGroups); // Usando a nova exportação
};

exports.deactivateExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = exitGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  exitGroups.splice(index, 1);

  exports.writeJSON(filename, exitGroups); // Usando a nova exportação
};

exports.isActiveExitGroup = (groupId) => {
  const filename = EXIT_GROUPS_FILE;

  const exitGroups = exports.readJSON(filename); // Usando a nova exportação

  return exitGroups.includes(groupId);
};

exports.activateWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!welcomeGroups.includes(groupId)) {
    welcomeGroups.push(groupId);
  }

  exports.writeJSON(filename, welcomeGroups); // Usando a nova exportação
};

exports.deactivateWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = welcomeGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  welcomeGroups.splice(index, 1);

  exports.writeJSON(filename, welcomeGroups); // Usando a nova exportação
};

exports.isActiveWelcomeGroup = (groupId) => {
  const filename = WELCOME_GROUPS_FILE;

  const welcomeGroups = exports.readJSON(filename); // Usando a nova exportação

  return welcomeGroups.includes(groupId);
};

exports.activateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = inactiveGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  inactiveGroups.splice(index, 1);

  exports.writeJSON(filename, inactiveGroups); // Usando a nova exportação
};

exports.deactivateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!inactiveGroups.includes(groupId)) {
    inactiveGroups.push(groupId);
  }

  exports.writeJSON(filename, inactiveGroups); // Usando a nova exportação
};

exports.isActiveGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = exports.readJSON(filename); // Usando a nova exportação

  return !inactiveGroups.includes(groupId);
};

exports.getAutoResponderResponse = (match) => {
  const filename = AUTO_RESPONDER_FILE;

  const responses = exports.readJSON(filename); // Usando a nova exportação

  const matchUpperCase = match.toLocaleUpperCase();

  const data = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase
  );

  if (!data) {
    return null;
  }

  return data.answer;
};

exports.activateAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!autoResponderGroups.includes(groupId)) {
    autoResponderGroups.push(groupId);
  }

  exports.writeJSON(filename, autoResponderGroups); // Usando a nova exportação
};

exports.deactivateAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = autoResponderGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  autoResponderGroups.splice(index, 1);

  exports.writeJSON(filename, autoResponderGroups); // Usando a nova exportação
};

exports.isActiveAutoResponderGroup = (groupId) => {
  const filename = AUTO_RESPONDER_GROUPS_FILE;

  const autoResponderGroups = exports.readJSON(filename); // Usando a nova exportação

  return autoResponderGroups.includes(groupId);
};

exports.activateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!antiLinkGroups.includes(groupId)) {
    antiLinkGroups.push(groupId);
  }

  exports.writeJSON(filename, antiLinkGroups); // Usando a nova exportação
};

exports.deactivateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = antiLinkGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  antiLinkGroups.splice(index, 1);

  exports.writeJSON(filename, antiLinkGroups); // Usando a nova exportação
};

exports.isActiveAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = exports.readJSON(filename); // Usando a nova exportação

  return antiLinkGroups.includes(groupId);
};

exports.muteMember = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = exports.readJSON(filename, {}); // Usando a nova exportação

  if (!mutedMembers[groupId]) {
    mutedMembers[groupId] = [];
  }

  if (!mutedMembers[groupId]?.includes(memberId)) {
    mutedMembers[groupId].push(memberId);
  }

  exports.writeJSON(filename, mutedMembers); // Usando a nova exportação
};

exports.unmuteMember = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = exports.readJSON(filename, {}); // Usando a nova exportação

  if (!mutedMembers[groupId]) {
    return;
  }

  const index = mutedMembers[groupId].indexOf(memberId);

  if (index !== -1) {
    mutedMembers[groupId].splice(index, 1);
  }

  exports.writeJSON(filename, mutedMembers); // Usando a nova exportação
};

exports.checkIfMemberIsMuted = (groupId, memberId) => {
  const filename = MUTE_FILE;

  const mutedMembers = exports.readJSON(filename, {}); // Usando a nova exportação

  if (!mutedMembers[groupId]) {
    return false;
  }

  return mutedMembers[groupId]?.includes(memberId);
};

exports.activateOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = exports.readJSON(filename, []); // Usando a nova exportação

  if (!onlyAdminsGroups.includes(groupId)) {
    onlyAdminsGroups.push(groupId);
  }

  exports.writeJSON(filename, onlyAdminsGroups); // Usando a nova exportação
};

exports.deactivateOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = exports.readJSON(filename, []); // Usando a nova exportação

  const index = onlyAdminsGroups.indexOf(groupId);
  if (index === -1) {
    return;
  }

  onlyAdminsGroups.splice(index, 1);

  exports.writeJSON(filename, onlyAdminsGroups); // Usando a nova exportação
};

exports.isActiveOnlyAdmins = (groupId) => {
  const filename = ONLY_ADMINS_FILE;

  const onlyAdminsGroups = exports.readJSON(filename, []); // Usando a nova exportação

  return onlyAdminsGroups.includes(groupId);
};

exports.readGroupRestrictions = () => {
  return exports.readJSON(GROUP_RESTRICTIONS_FILE, {}); // Usando a nova exportação
};

exports.saveGroupRestrictions = (restrictions) => {
  exports.writeJSON(GROUP_RESTRICTIONS_FILE, restrictions, {}); // Usando a nova exportação
};

exports.isActiveGroupRestriction = (groupId, restriction) => {
  const restrictions = exports.readGroupRestrictions();

  if (!restrictions[groupId]) {
    return false;
  }

  return restrictions[groupId][restriction] === true;
};

exports.updateIsActiveGroupRestriction = (groupId, restriction, isActive) => {
  const restrictions = exports.readGroupRestrictions();

  if (!restrictions[groupId]) {
    restrictions[groupId] = {};
  }

  restrictions[groupId][restriction] = isActive;

  exports.saveGroupRestrictions(restrictions);
};

exports.readRestrictedMessageTypes = () => {
  return exports.readJSON(RESTRICTED_MESSAGES_FILE, { // Usando a nova exportação
    sticker: "stickerMessage",
    video: "videoMessage",
    image: "imageMessage",
    audio: "audioMessage",
    product: "productMessage",
    document: "documentMessage",
    event: "eventMessage",
  });
};

exports.setPrefix = (groupJid, prefix) => {
  const filename = PREFIX_GROUPS_FILE;

  const prefixGroups = exports.readJSON(filename, {}); // Usando a nova exportação

  prefixGroups[groupJid] = prefix;

  exports.writeJSON(filename, prefixGroups, {}); // Usando a nova exportação
};

exports.getPrefix = (groupJid) => {
  const filename = PREFIX_GROUPS_FILE;

  const prefixGroups = exports.readJSON(filename, {}); // Usando a nova exportação

  return prefixGroups[groupJid] || PREFIX;
};

exports.listAutoResponderItems = () => {
  const filename = AUTO_RESPONDER_FILE;
  const responses = exports.readJSON(filename, []); // Usando a nova exportação

  return responses.map((item, index) => ({
    key: index + 1,
    match: item.match,
    answer: item.answer,
  }));
};

exports.addAutoResponderItem = (match, answer) => {
  const filename = AUTO_RESPONDER_FILE;
  const responses = exports.readJSON(filename, []); // Usando a nova exportação

  const matchUpperCase = match.toLocaleUpperCase();

  const existingItem = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase
  );

  if (existingItem) {
    return false;
  }

  responses.push({
    match: match.trim(),

    answer: answer.trim(),
  });

  exports.writeJSON(filename, responses, []); // Usando a nova exportação

  return true;
};

exports.removeAutoResponderItemByKey = (key) => {
  const filename = AUTO_RESPONDER_FILE;
  const responses = exports.readJSON(filename, []); // Usando a nova exportação

  const index = key - 1;

  if (index < 0 || index >= responses.length) {
    return false;
  }

  responses.splice(index, 1);

  exports.writeJSON(filename, responses, []); // Usando a nova exportação

  return true;
};

// =================================================================
// === FUNÇÕES PARA O SISTEMA DE REAL (ECONOMIA) ===
// =================================================================

exports.activateRealGroup = (groupId) => {
  const filename = ECONOMY_GROUPS_FILE;

  const economyGroups = exports.readJSON(filename); // Usando a nova exportação

  if (!economyGroups.includes(groupId)) {
    economyGroups.push(groupId);
  }

  exports.writeJSON(filename, economyGroups); // Usando a nova exportação
};

exports.deactivateRealGroup = (groupId) => {
  const filename = ECONOMY_GROUPS_FILE;

  const economyGroups = exports.readJSON(filename); // Usando a nova exportação

  const index = economyGroups.indexOf(groupId);

  if (index === -1) {
    return;
  }

  economyGroups.splice(index, 1);

  exports.writeJSON(filename, economyGroups); // Usando a nova exportação
};

exports.isActiveRealGroup = (groupId) => {
  const filename = ECONOMY_GROUPS_FILE;

  const economyGroups = exports.readJSON(filename); // Usando a nova exportação

  // A economia deve estar ativa por padrão se não for um grupo.
  // Se for um grupo, ela deve estar na lista de grupos ativos.
  // Para simplificar, vou assumir que grupos no PV (chat individual) a economia está sempre ativa.
  if (!groupId.includes('@g.us')) {
    return true;
  }

  return economyGroups.includes(groupId);
};