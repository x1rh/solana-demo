import { analysisTokenHolders, closeATA, monitorTokenPrice, transferSOL } from "./token"

describe('token', () => {
    it('transfer sol', () => {
        transferSOL();
    })

    it('monitor token price', () => {
        monitorTokenPrice();
    })

    it('close ATA', () => {
        closeATA();
    })

    it('analysis token holders', () => {
        analysisTokenHolders();
    })
})

