import { PublicKey } from "@solana/web3.js";
require("dotenv").config();
const {Connection, Keypair, Publickey} = require("@solana/web3.js");
const { Wallet } = require("@project-serum/anchor");
const { PoolUtils, RAYMint, ClmmKeys } = require("@raydium-io/raydium-sdk-v2");
const BN = require("bn.js");
const bs58 = require("bs58");
const { initSdk, txVersion } = require("./config");
const { isValidClmm } = require("./utils")


// raydium里有两种池子，一种是CLMM，另一种是AMM
export async function RaydiumSwap(

) {
    const conn = new Connection("");
    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || "")));
    const poolId = "";
    const inputMint = new Publickey(RAYMint.toBase58());
    const inputAmount = new BN(100);
    let poolInfo;
    let clmmPoolInfo;
    let tickCache;

    try {
        const raydium = await initSdk();

        // 获取池信息
        const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
        poolInfo = data.poolInfo;
        poolKeys = data.poolKeys;
        clmmPoolInfo = data.computePoolInfo;
        tickCache = data.tickData;

        if(!isValidClmm(poolInfo.programId)) {
            throw new Error("target pool is not a CLMM pool");
        }

        console.log("CLMM Pool Info", clmmPoolInfo);

        // 转换为PublicKey实例，确保在比较时使用PublicKey类型
        const mintAAddress = new PublicKey(poolInfo.mintA.address);
        const mintBAddress = new PublicKey(poolInfo.mintB.address);

        // 验证输入代币是否匹配池中的代币
        if(inputMint.toBase58() !== mintAAddress.toBase58() && inputMint.toBase58() !== mintBAddress.toBase58()) {
            throw new Error("input mint does not match pool");
        }

        const baseIn = inputMint.toBase58() === mintAAddress.toBase58();

        // 检查并创建代币A账户
        let userTokenAccountA = await conn.getTokenAccountsByOwner(wallet.publicKey, {mint: mintAAddress});
        if(userTokenAccountA.length == 0) {
            // 创建 token A的账户
            userTokenAccountA = await createTokenAccount(conn, wallet, mintAAddress);
            console.log("create token A account");
        }

        // 检查并创建代币B账户
        let userTokenAccountB = await conn.getTokenAccountsByOwner(wallet.publicKey, {mint: mintBAddress});
        if(userTokenAccountB.length == 0) {
            // 创建 token B的账户
            userTokenAccountB = await createTokenAccount(conn, wallet, mintBAddress);
        }


        // 计算最小输出量
        const { minAmountOut, remainingAccounts } = await PoolUtils.computeAmountOutFormat({
            poolInfo: clmmPoolInfo,
            tickArrayCache: tickCache[poolId],
            amountIn: inputAmount,
            tokenOut: baseIn ? poolInfo.mintB : poolInfo.mintA,
            slippage: 0.005,
            epochInfo: await raydium.fetchEpochInfo(),
        });
        console.log("minimum amount out: ", minAmountOut.amount.toString());

        // 执行CLMM池的交换
        const { execute, transaction } = await raydium.clmm.swap({
            poolInfo,
            poolKeys,
            inputMint: poolInfo[baseIn ? "mintA" : "mintB"].address,
            amountIn: inputAmount,
            amountOutMin: minAmountOut.amount.raw,
            obervationId: clmmPoolInfo.obervationId,
            ownerInfo: {
                useSOLBalance: true,  // 如果希望使用SOL余额作为支付方式
            },
            remainingAccounts, // 添加代表账户
            txVersion,
            optional: 1000,
            computeBudgetConfig: {
                units: 600000,
                microLamports: 46591,
            },
        });


        console.log("executing transaction...");
        console.log("transaction detail: ", transaction);
        const { txId } = await execute();
        console.log(`transaction success: https://explorer.solana.com/tx/${txId}`);
    } catch(err) {
        console.error("Error during swap: ", err);
    } 
}
