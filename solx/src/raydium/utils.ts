import { CLMM_PROGRAM_ID, DEVNET_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

const VALID_PROGRAM_ID = new Set([
    CLMM_PROGRAM_ID.toBase58(), 
    DEVNET_PROGRAM_ID.CLMM.toBase58(),
])

export const isValidClmm = (id: string) => VALID_PROGRAM_ID.has(id)


export async function CreateTokenAccount(
    conn: Connection,
    signer: Keypair,
    mintAddress: PublicKey,
): Promise<PublicKey> {
    return new Promise(() => {});
}