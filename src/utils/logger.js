/**
 * Logs
 *
 * @author Dev Leandro
 */
import pkg from "../../package.json" with { type: "json" };

export function sayLog(message) {
  console.log("\x1b[36m[GÓTICA BOT | TALK]\x1b[0m", message);
}

export function inputLog(message) {
  console.log("\x1b[30m[GÓTICA BOT | INPUT]\x1b[0m", message);
}

export function infoLog(message) {
  console.log("\x1b[34m[GÓTICA BOT | INFO]\x1b[0m", message);
}

export function successLog(message) {
  console.log("\x1b[32m[GÓTICA BOT | SUCCESS]\x1b[0m", message);
}

export function errorLog(message) {
  console.log("\x1b[31m[GÓTICA BOT | ERROR]\x1b[0m", message);
}

export function warningLog(message) {
  console.log("\x1b[33m[GÓTICA BOT | WARNING]\x1b[0m", message);
}

export function bannerLog() {
  // Arte ASCII escrita: G O T I C A
  console.log(`\x1b[35m
   ┏┓┏┓┏┳┓┳┏┓┏┓
   ┃┓┃┃ ┃ ┃┃ ┣┫
   ┗┛┗┛ ┻ ┻┗┛┛┗\x1b[0m`);
  console.log(`\x1b[36m   --- GÓTICA BOT BY LEANDRO ---\x1b[0m`);
  console.log(`\x1b[36m🤖 Versão: \x1b[0m${pkg.version}\n`);
}