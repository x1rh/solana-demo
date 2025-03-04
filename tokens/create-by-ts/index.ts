import "dotenv/config";

import { 
    createMint,
    getOrCreateAssociatedTokenAccount, 
    mintTo,
    transfer
} from "@solana/spl-token";

import {
    createAccountsMintsAndTokenAccounts,
    getExplorerLink,
    getKeypairFromEnvironment,
} from "@solana-developers/helpers";

import { 
    Connection, 
    clusterApiUrl, 
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

// This uses "@metaplex-foundation/mpl-token-metadata@2" to create tokens
import {
    DataV2,
    createCreateMetadataAccountV3Instruction
} from "@metaplex-foundation/mpl-token-metadata";
import { none, createNoopSigner, PublicKey as MplPublicKey, Signer as MplSigner, signerIdentity, Keypair as MplKeypair, createSignerFromKeypair, publicKey, keypairIdentity} from "@metaplex-foundation/umi";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';



async function CreateTokenMint(connection: Connection, signer: Keypair): Promise<PublicKey> {
    console.log(`🔑 token owner's public key is: ${signer.publicKey.toBase58()}`);
    const tokenMintKeypair = Keypair.generate();

    // This is a shortcut that runs:
    // SystemProgram.createAccount
    // token.createInitializeMintInstruction
    // See https://www.soldev.app/course/token-program
    const tokenMint = await createMint(connection, signer, signer.publicKey, null, 2);
    const link = getExplorerLink("address", tokenMint.toString(), "devnet");
    console.log(`✅ Success! Created token mint: ${link}`);   
    return tokenMint;
}

async function CreateTokenMetadata(connection: Connection, tokenMintAccount: PublicKey, signer: Keypair) {
    console.log(`🔑 signer's public key is: ${signer.publicKey.toBase58()}`); 
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");  
    const metadataData: DataV2 = {
        name: "Solana Training Token",
        symbol: "TRAINING",
        // An off-chain link to more information about the token using Metaplex standard for off-chain data
        // We are using a GitHub link here, but in production this content would be hosted on an immutable storage like
        // Arweave / IPFS / Pinata etc
        uri: "https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json",
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
    };
      
    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          tokenMintAccount.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );  
    const metadataPDA = metadataPDAAndBump[0]; 
    const transaction = new Transaction(); 
    const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPDA,
            mint: tokenMintAccount,
            mintAuthority: signer.publicKey,
            payer: signer.publicKey,
            updateAuthority: signer.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: metadataData,
                isMutable: true,
            },
        }
    );   
    transaction.add(createMetadataAccountInstruction);
      
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [signer]
    );   
    
    const transactionLink = getExplorerLink(
        "transaction",
        transactionSignature,
        "devnet"
    );   
    console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`);
      
    const tokenMintLink = getExplorerLink(
        "address",
        tokenMintAccount.toString(),
        "devnet"
    );   
    console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);
}

async function MintToken(connection: Connection, tokenMintAccount: PublicKey, signer: Keypair) {
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
    const recipientAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        tokenMintAccount,
        signer.publicKey
    );
    const transactionSignature = await mintTo(
        connection,
        signer,
        tokenMintAccount,
        recipientAssociatedTokenAccount.address,
        signer,
        10 * MINOR_UNITS_PER_MAJOR_UNITS
    );
    const link = getExplorerLink("transaction", transactionSignature, "devnet");
    console.log(`✅ Success! Mint Token Transaction: ${link}`); 
}

async function TransferToken(connection: Connection, tokenMintAccount: PublicKey, sender: Keypair, recipient: PublicKey) {
    // Our token has two decimal places
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
    console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);
    // Get or create the source and destination token accounts to store this token
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        sender,
        tokenMintAccount,
        sender.publicKey
    );
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        sender,
        tokenMintAccount,
        recipient
    );

    // Transfer the tokens
    const signature = await transfer(
        connection,
        sender,
        sourceTokenAccount.address,
        destinationTokenAccount.address,
        sender,
        1 * MINOR_UNITS_PER_MAJOR_UNITS
    );
    const explorerLink = getExplorerLink("transaction", signature, "devnet");
    console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
}

async function main() {
    const connection = new Connection(clusterApiUrl("devnet"));
    const signer = getKeypairFromEnvironment("SECRET_KEY");

    // create token 
    const tokenMint = await CreateTokenMint(connection, signer);
    // const tokenMint = new PublicKey("2s4uToSWrUC78B5Gyh5YBAQXZKJc8StUDZjyQQvsbDde");
   
    // create token metadata
    await CreateTokenMetadata(connection, tokenMint, signer);

    // mint token 
    await MintToken(connection, tokenMint, signer);

    // transfer
    const sender = signer;
    const recipient = Keypair.generate();
    await TransferToken(connection, tokenMint, signer, recipient.publicKey);
}

main();

