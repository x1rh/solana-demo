import { analysisTokenHolders, closeATA, monitorTokenPrice, transferSOL } from "./TokenATAClose"

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

    it("test get token balance", () => {
        // 获取指定token的余额
        const tokenAccountBalance = await conn.getTokenAccountBalance(new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"));
        return tokenAccountBalance;
    })

    it("test get token supply", () => {
        // 获取token的供应量
        const supplyInfo = await conn.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
        console.log(`Total supply: ${supplyInfo.value.amount}\n`); 
    })

})

