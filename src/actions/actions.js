export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'

/*
 * action creators
 */

export default function initializeWeb3(web3) {
    return { type: WEB3_INITIALIZED, payload: web3 }
}