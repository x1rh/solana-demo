import {Commitment, Connection} from "@solana/web3.js"

/** 
 *获取当前slot
 *@param conn solana连接实例
 *@return 当前slot的编号
 */
export async function GetCurrentSlot(
    conn: Connection,
    commitment: Commitment
): Promise<number> {
    try {
        const slot = await conn.getSlot(commitment);
        return slot;
    } catch(err) {
        throw err;
    }
}
