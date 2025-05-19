import { Connection, PublicKey } from "@solana/web3.js";
import { AnalysisTokenHolders} from "./TokenHoldersAnalysis";
import { CloseATA } from "./TokenATAClose"
import { GetTokenBalance } from "./TokenBalance";
import { LaunchToken } from "./TokenLaunch";
import { MonitorTokenPrice } from "./TokenPriceMonitor";

describe('token', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    it("test TokenATAClose", () => {
        CloseATA()
    })

    it('test TokenBalance', async() => {
        // 获取指定token的余额
        const tokenAccount = new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT");
        const tokenAccountBalance = await GetTokenBalance(conn, tokenAccount);
        console.log(`token account detail: ${JSON.stringify(tokenAccountBalance)}`);
    })

    it('test TokenHoldersAnalysis', () => {
        AnalysisTokenHolders();
    })

    it("test TokenLaunch", async() => {
        const name = "";
        const symbol = "";
        const decimals = 9;
        const result = await LaunchToken(conn, name, symbol, decimals);
    })

    it("test TokenPriceMonitor", async() => {
        MonitorTokenPrice();
    })

    it("test TokenSupply", async() => {
        // 获取token的供应量
        const supplyInfo = await conn.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
        console.log(`Total supply: ${supplyInfo.value.amount}\n`); 
    })
})

