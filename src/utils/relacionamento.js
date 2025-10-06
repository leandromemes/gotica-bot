// src/utils/relacionamento.js

const { readJSON, writeJSON } = require('./database'); 

const RELACIONAMENTOS_FILE = "relacionamentos"; 
const SALDO_FILE = "economy"; // Nome do arquivo de saldo unificado

// --- Funções Auxiliares ---

// 🚨 GARANTINDO A EXPORTAÇÃO DA FUNÇÃO DE LIMPEZA
exports.cleanJid = (jid) => jid.replace(/:[0-9][0-9]|:[0-9]/g, "");

// --- FUNÇÕES DE SALDO (REAL) ---

exports.formatarReal = (valor) => new Intl.NumberFormat("pt-BR").format(valor);

// 🚨 EXPORTADO CORRETAMENTE E USANDO 'economy'
exports.getSaldoInfo = (userId) => {
    const data = readJSON(SALDO_FILE, {}); 
    const key = exports.cleanJid(userId); 
    
    if (!data.hasOwnProperty(key)) {
        data[key] = 0; 
    }
    
    return { data, saldo: data[key], key };
};

exports.salvarSaldoData = (data) => {
    writeJSON(SALDO_FILE, data, {});
};


// --- FUNÇÕES DE RELACIONAMENTO ---

// 🚨 EXPORTADO CORRETAMENTE
exports.lerRelacionamentos = () => {
    return readJSON(RELACIONAMENTOS_FILE, {});
};

exports.salvarRelacionamentos = (data) => {
    writeJSON(RELACIONAMENTOS_FILE, data, {});
};

// 🚨 EXPORTADO CORRETAMENTE
exports.getRelacionamentoStatus = (groupId, jid) => {
    const cleanedJid = exports.cleanJid(jid); 
    const relacionamentos = exports.lerRelacionamentos();
    const groupRelacionamentos = relacionamentos[groupId] || {};
    
    return groupRelacionamentos[cleanedJid] || null;
};

// 🚨 EXPORTADO CORRETAMENTE
exports.terminarRelacionamento = (groupId, jid) => {
    const cleanedJid = exports.cleanJid(jid); 
    const relacionamentos = exports.lerRelacionamentos();
    const groupRelacionamentos = relacionamentos[groupId] || {};
    const status = groupRelacionamentos[cleanedJid];
    
    if (!status) return null;
    
    const parceiroJid = status.parceiro;

    delete groupRelacionamentos[cleanedJid];
    
    if (parceiroJid && groupRelacionamentos[parceiroJid]) {
        delete groupRelacionamentos[parceiroJid];
    }

    relacionamentos[groupId] = groupRelacionamentos;
    exports.salvarRelacionamentos(relacionamentos);
    
    return parceiroJid;
};