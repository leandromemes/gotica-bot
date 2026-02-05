/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { getContentType, generateForwardMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';

global.delete = global.delete || [];

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (isAdmin) return;
    if (!m.isGroup) return;
    if (m.key.fromMe) return;

    let chat = global.db.data.chats[m.chat];

    if (chat.delete) {
        if (global.delete.length > 500) global.delete = [];
        if (m.type !== 'protocolMessage' && m.key && m.message) global.delete.push({ key: m.key, message: m.message });
        
        if (m?.message?.protocolMessage) {
            let msg = global.delete.find((index) => index.key.id === m.message.protocolMessage.key.id);

            if (msg) {
                // Função de tradução e descriptografia das mensagens do sistema
                function _0x4e77(_0x10965d,_0x5c129d){const _0x5b579d=_0x5b57();return _0x4e77=function(_0x4e771b,_0x45b1fb){_0x4e771b=_0x4e771b-0x7b;let _0x98d78a=_0x5b579d[_0x4e771b];return _0x98d78a;},_0x4e77(_0x10965d,_0x5c129d);}const _0x52e081=_0x4e77;
                
                // Mensagem traduzida: "Este usuário eliminou uma mensagem."
                let avisoAntidelete = '《✧》Este usuário apagou uma mensagem.'; 
                
                let quoted = {
                    'key': msg.key,
                    'message': {
                        'extendedTextMessage': {
                            'text': avisoAntidelete
                        }
                    }
                };

                await sendMessageForward(msg, {
                    'client': conn,
                    'from': m.chat,
                    'isReadOneView': true,
                    'viewOnce': false,
                    'quoted': quoted
                });

                let index = global.delete.indexOf(msg);
                if (index !== -1) global.delete.splice(index, 1);
            }
        }
    }
}

// FUNÇÃO DE ENCAMINHAMENTO (MANTIDA ORIGINAL DA RUBY)
async function sendMessageForward(_0x5075e6, _0xe8662f = {}) {
    const _1725fb = _0x2ff9;
    let _0x549adc = getContentType(_0x5075e6.message),
        _0x57c0ec = await generateForwardMessageContent(_0x5075e6, { 'forwardingScore': true }),
        _0x2941be = getContentType(_0x57c0ec);

    if (_0xe8662f.caption) {
        if (_0x2941be === 'conversation') _0x57c0ec[_0x2941be] = _0xe8662f.caption;
        else _0x2941be === 'extendedTextMessage' ? _0x57c0ec[_0x2941be].text = _0xe8662f.caption : _0x57c0ec[_0x2941be]['caption'] = _0xe8662f.caption;
    }

    _0xe8662f['isReadOneView'] && (_0x57c0ec[_0x2941be].viewOnce = _0xe8662f['viewOnce']);
    _0x57c0ec[_0x2941be].contextInfo = {
        ..._0x5075e6.message[_0x549adc].contextInfo || {},
        ..._0xe8662f.mentions ? { 'mentionedJid': _0xe8662f['mentions'] } : _0x57c0ec[_0x2941be].contextInfo || {},
        'isForwarded': _0xe8662f.forward || true,
        'remoteJid': _0xe8662f.remote || null
    };

    let _0x29c7ad = await generateWAMessageFromContent(_0xe8662f.from, _0x57c0ec, {
        'userJid': _0xe8662f.client.user.id,
        'quoted': _0xe8662f['quoted'] || _0x5075e6
    });

    return await _0xe8662f.client.relayMessage(_0xe8662f.from, _0x29c7ad.message, { 'messageId': _0x29c7ad.key.id }), _0x29c7ad;
}

function _0x2ff9(_0x55a7be, _0x40a04e) {
    const _0x2af13f = ['24CQATUJ', 'mentions', 'text', '1664036fTUfit', 'message', '80395NhhBFs', 'user', 'contextInfo', '22650LXSmhY', 'viewOnce', '1774392nWWVRE', 'from', '1VSbOYv', 'conversation', 'key', '181990dgcOvR', '1264725FBHtYt', 'relayMessage', 'forward', 'client', 'caption', '729PGSAtl', '796058AooNAX', '200sUCmHg', '6bOqzYt', 'extendedTextMessage', 'remote'];
    _0x2ff9 = function (a, b) { return _0x2af13f[a - 0x17e]; };
    return _0x2ff9(_0x55a7be, _0x40a04e);
}

function _0x5b57() {
    const _0x145e57 = ['528572kOzxBi', 'indexOf', 'chat', '2901750iRqkFo', '12009186xBEwlH', 'key', '5719866BXHcHQ', '3272496tbXhtd', '8YCiDge', '681132RNoSzk', '5eIXutQ', '《✧》Este usuário apagou uma mensagem.', 'delete', '6268339JgtdET'];
    _0x5b57 = function () { return _0x145e57; };
    return _0x5b57();
}