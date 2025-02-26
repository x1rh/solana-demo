import { getData, getWalletSolanaBalance, parseRawData } from "./getdata"

describe('read data from chain', () => {
    it('get wallet solana balance', () => {
        getWalletSolanaBalance();
    })

    it('get data', () => {
        getData();
    })

    it('parse raw data from tx', () => {
        parseRawData();
    })
})