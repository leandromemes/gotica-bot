/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * * dev: leandro rocha
 * * GitHub: https://github.com/leandromemes
 */

import EventEmitter from "events"

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

// Delay padrão de 5 segundos entre processos da fila
const QUEQUE_DELAY = 5 * 1000

export default class Queque extends EventEmitter {
    _queque = new Set()

    constructor() {
        super()
    }

    /**
     * Adiciona um item à fila
     */
    add(item) {
        this._queque.add(item)
    }

    /**
     * Verifica se o item está na fila
     */
    has(item) {
        return this._queque.has(item)
    }

    /**
     * Remove um item da fila
     */
    delete(item) {
        this._queque.delete(item)
    }

    /**
     * Retorna o primeiro item da fila
     */
    first() {
        return [...this._queque].shift()
    }

    /**
     * Verifica se o item é o primeiro da fila
     */
    isFirst(item) {
        return this.first() === item
    }

    /**
     * Retorna o último item da fila
     */
    last() {
        return [...this._queque].pop()
    }

    /**
     * Verifica se o item é o último da fila
     */
    isLast(item) {
        return this.last() === item
    }

    /**
     * Retorna o índice de um item
     */
    getIndex(item) {
        return [...this._queque].indexOf(item)
    }

    /**
     * Retorna o tamanho atual da fila
     */
    getSize() {
        return this._queque.size
    }

    /**
     * Verifica se a fila está vazia
     */
    isEmpty() {
        return this.getSize() === 0
    }

    /**
     * Remove o item atual e emite o evento para o próximo
     */
    unqueue(item) {
        let queque;
        if (item) {
            if (this.has(item)) {
                queque = item
                const isFirst = this.isFirst(item)
                if (!isFirst) {
                    throw new Error('O item não é o primeiro da fila')
                }
            }
        } else {
            queque = this.first()
        }

        if (queque) {
            this.delete(queque)
            this.emit(queque)
        }
    }

    /**
     * Aguarda a vez do item na fila para processar
     */
    waitQueue(item) {
        return new Promise((resolve, reject) => {
            if (this.has(item)) {
                const solve = async (removeQueque = false) => {
                    await delay(QUEQUE_DELAY)
                    if (removeQueque) this.unqueue(item)
                    if (!this.isEmpty()) this.unqueue()
                    resolve()
                }

                if (this.isFirst(item)) {
                    solve(true)
                } else {
                    this.once(item, solve)
                }
            } else {
                reject(new Error('Item não encontrado na fila'))
            }
        })
    }
}