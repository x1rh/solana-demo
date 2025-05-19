import {
  Connection,
  PublicKey,
  Keypair,
  TokenAccountsFilter
} from "@solana/web3.js";
// import { Raydium, PoolUtils, RAYMint, ClmmKeys, ClmmPoolInfo, PoolInfo, TxVersion } from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";
import {isValidClmm} from "./utils";
import { CreateTokenAccount } from "./utils";

import {
    Raydium,
  ApiV3PoolInfoConcentratedItem,
  ClmmKeys,
  ComputeClmmPoolInfo,
  PoolUtils,
  ReturnTypeFetchMultiplePoolTickArrays,
  RAYMint,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2'


// 你需要确保项目中有这个函数
// import { createTokenAccount } from './token-utils';

// raydium里有两种池子，一种是CLMM，另一种是AMM
// swap token A to token B 
export async function RaydiumSwap(
  conn: Connection,
  raydium: Raydium,
  signer: Keypair,
  poolId: string,
  tokenA: string,
  tokenB: string,
  inputAmount: BN,  // token A amount 
): Promise<void> {
    try{ 


  const inputMint = RAYMint.toBase58()
  let poolInfo: ApiV3PoolInfoConcentratedItem
  let poolKeys: ClmmKeys | undefined
  let clmmPoolInfo: ComputeClmmPoolInfo
  let tickCache: ReturnTypeFetchMultiplePoolTickArrays


  if (raydium.cluster === 'mainnet') {
    // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
    // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
    const data = await raydium.api.fetchPoolById({ ids: poolId })
    poolInfo = data[0] as ApiV3PoolInfoConcentratedItem;
    if(!isValidClmm(poolInfo.programId)) {
        throw new Error('target pool is not CLMM pool')
    }
    clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
      connection: raydium.connection,
      poolInfo,
    })
    tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
      connection: raydium.connection,
      poolKeys: [clmmPoolInfo],
    })
  } else {
    const data = await raydium.clmm.getPoolInfoFromRpc(poolId)
    poolInfo = data.poolInfo
    poolKeys = data.poolKeys
    clmmPoolInfo = data.computePoolInfo
    tickCache = data.tickData
  }




// const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(secretKey))); 
// const poolId = "";
//   const inputMint = new PublicKey(RAYMint.toBase58());
//   const inputAmount = new BN(100);
//   let poolInfo: PoolInfo;
//   let clmmPoolInfo: ClmmPoolInfo;
//   let tickCache: any;
//   let poolKeys: ClmmKeys;

//   try {
    // // 获取池信息
    // const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
    // poolInfo = data.poolInfo;
    // poolKeys = data.poolKeys;
    // clmmPoolInfo = data.computePoolInfo;
    // tickCache = data.tickData;

    if (!isValidClmm(poolInfo.programId)) {
      throw new Error("Target pool is not a CLMM pool.");
    }

    console.log("CLMM Pool Info", clmmPoolInfo);

    const mintAAddress = new PublicKey(poolInfo.mintA.address);
    const mintBAddress = new PublicKey(poolInfo.mintB.address);

    if (inputMint !== mintAAddress.toBase58() && inputMint !== mintBAddress.toBase58()) {
      throw new Error("Input mint does not match pool.");
    }

    const baseIn = inputMint === mintAAddress.toBase58();

    // 检查代币A账户
    const tokenAAccounts = await conn.getTokenAccountsByOwner(signer.publicKey, {
      mint: mintAAddress
    } as TokenAccountsFilter);

    let userTokenAccountA = tokenAAccounts.value;
    if (userTokenAccountA.length === 0) {
      await CreateTokenAccount(conn, signer, mintAAddress);
      console.log("Created token A account.");
    }

    // 检查代币B账户
    const tokenBAccounts = await conn.getTokenAccountsByOwner(signer.publicKey, {
      mint: mintBAddress
    } as TokenAccountsFilter);

    let userTokenAccountB = tokenBAccounts.value;
    if (userTokenAccountB.length === 0) {
      await CreateTokenAccount(conn, signer, mintBAddress);
      console.log("Created token B account.");
    }

    const { minAmountOut, remainingAccounts } = await PoolUtils.computeAmountOutFormat({
      poolInfo: clmmPoolInfo,
      tickArrayCache: tickCache[poolId],
      amountIn: inputAmount,
      tokenOut: baseIn ? poolInfo.mintB : poolInfo.mintA,
      slippage: 0.005,
      epochInfo: await raydium.fetchEpochInfo()
    });
    console.log("Minimum amount out:", minAmountOut.amount.toString());

    const { execute, transaction } = await raydium.clmm.swap({
      poolInfo,
      poolKeys,
      inputMint: poolInfo[baseIn ? "mintA" : "mintB"].address,
      amountIn: inputAmount,
      amountOutMin: minAmountOut.amount.raw,
      observationId: clmmPoolInfo.observationId,
      ownerInfo: {
        useSOLBalance: true
      },
      remainingAccounts,
      txVersion: TxVersion.V0,
        // optional: 1000, // set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 465915,
        // },

        // optional: add transfer sol to tip account instruction. e.g sent tip to jito
        // txTipConfig: {
        //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
        //   amount: new BN(10000000), // 0.01 sol
        // },
    });

    console.log("Executing transaction...");
    console.log("Transaction detail:", transaction);
    const { txId } = await execute();
    console.log(`Transaction success: https://explorer.solana.com/tx/${txId}`);
  } catch (err) {
    console.error("Error during swap:", err);
  }
}
