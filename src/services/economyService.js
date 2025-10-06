// src/services/economyService.js

const fs = require('fs');
const path = require('path');

// Caminho CORRIGIDO para o nosso arquivo de banco de dados
// Sai da pasta 'services', sai da pasta 'src', e então entra na pasta 'database'
const dbPath = path.join(__dirname, '..', '..', 'database', 'economy.json');

/**
 * Lê os dados do arquivo economy.json
 * @returns {Object} Os dados da economia
 */
function readDatabase() {
  try {
    if (!fs.existsSync(dbPath)) {
        // Se o arquivo não existe, cria ele com um objeto vazio
        fs.writeFileSync(dbPath, '{}', 'utf8');
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler o banco de dados da economia:", error);
    return {};
  }
}

/**
 * Escreve os dados no arquivo economy.json
 * @param {Object} data Os dados para salvar
 */
function writeDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Erro ao escrever no banco de dados da economia:", error);
  }
}

/**
 * Pega os dados de um usuário. Se não existir, cria um novo registro.
 * @param {string} userId O ID do usuário (ex: '5521999999999@s.whatsapp.net')
 * @returns {{balance: number}} Os dados do usuário
 */
function getUser(userId) {
  const db = readDatabase();
  if (!db[userId]) {
    // Se o usuário não existe no banco de dados, cria um registro padrão
    db[userId] = {
      balance: 0,
    };
    writeDatabase(db);
  }
  return db[userId];
}

/**
 * Atualiza o saldo de um usuário.
 * @param {string} userId O ID do usuário
 * @param {number} amount A quantidade para adicionar (pode ser negativa para remover)
 * @returns {{balance: number}} Os dados atualizados do usuário
 */
function updateBalance(userId, amount) {
  const db = readDatabase();
  // Garante que o usuário exista antes de tentar atualizar
  if (!db[userId]) {
    getUser(userId); // Isso cria o usuário com saldo 0
    db = readDatabase(); // Re-lê o banco de dados agora com o novo usuário
  }

  db[userId].balance += amount;

  writeDatabase(db);
  return db[userId];
}

/**
 * Pega todos os usuários para o ranking.
 * @returns {Array<{userId: string, balance: number}>}
 */
function getAllUsers() {
    const db = readDatabase();
    return Object.entries(db).map(([userId, data]) => ({
        userId,
        ...data,
    }));
}

module.exports = {
  getUser,
  updateBalance,
  getAllUsers,
};
