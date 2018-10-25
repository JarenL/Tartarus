/*
 * action types
 */

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
export const CURRENT_USER_ADDRESS = 'CURRENT_USER_ADDRESS'
export const CURRENT_OWNER_ADDRESS = 'CURRENT_OWNER_ADDRESS'
export const TARTARUS_ADDRESS = 'TARTARUS_ADDRESS'
export const TARTARUS_INSTANCE = 'TARTARUS_INSTANCE'

/*
 * action creators
 */

export function initializeWeb3(web3) {
    return { 
        type: WEB3_INITIALIZED, 
        payload: web3 }
}

export function setCurrentUserAddress(userAddress) {
    return { 
        type: CURRENT_USER_ADDRESS, 
        payload: userAddress }
}

export function setCurrentOwnerAddress(ownerAddress) {
    return { 
        type: CURRENT_OWNER_ADDRESS, 
        payload: ownerAddress }
}

export function setTartarusAddress(tartarusAddress) {
    return { 
        type: TARTARUS_ADDRESS, 
        payload: tartarusAddress }
}

export function setTartarusInstance(tartarusInstance) {
    return { 
        type: TARTARUS_INSTANCE, 
        payload: tartarusInstance }
}
