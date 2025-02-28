import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import {startAnchor, BankrunProvider} from "solana-bankrun"
import {Voting} from '../target/types/voting'
import { BN, Program } from "@coral-xyz/anchor";

const IDL = required('../target/idl/voting.json');
const PUPPET_PROGRAM_ID = new PublicKey(""); 


describe('voting', () => {
  // use solana-bankrun
  // Configure the client to use the local cluster. 
  //const provider = anchor.AnchorProvider.env()
  //anchor.setProvider(provider)
  //const payer = provider.wallet as anchor.Wallet
  // const program = anchor.workspace.Voting as Program<Voting>
  //const votingKeypair = Keypair.generate()

  test("bankrun", async() => {
	const context = await startAnchor("", [{name: "voting", programId: PUPPET_PROGRAM_ID}], []);
  	const provider = new BankrunProvider(context);	
	const votingProgram = new Program<Voting>(
		IDL,
		provider,	
	);

	// 通过构造PDA来寻找地址
        const [pollAddress] = PublicKey.findProgramAddressSync(
        	[Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
        	puppetProgram.programId
    	);

	
	await votingProgram.methods.initializePoll(
        	new anchor.BN(1),
        	new anchor.BN(0),
        	new anchor.BN(1759508293),
        	"test-poll",
        	"description",
    	).rpc();

    	const pollAccount = await votingProgram.account.pollAccount.fetch(pollAddress);
    	console.log(pollAccount);
  }
})


describe('Voting', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Voting as Program<Voting>;

  it('initializePoll', async () => {

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods.initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(1759508293),
        "test-poll",
        "description",
    )
    .rpc();

    console.log('Your transaction signature', tx);
  });

  it('initialize candidates', async () => {
    const pollIdBuffer = new anchor.BN(1).toArrayLike(Buffer, "le", 8)

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollIdBuffer],
      program.programId
    );

    const smoothTx = await program.methods.initializeCandidate(
      new anchor.BN(1),
      "smooth",
    ).accounts({
      pollAccount: pollAddress
    })
    .rpc();

    const crunchyTx = await program.methods.initializeCandidate(
      new anchor.BN(1),
      "crunchy",
    ).accounts({
      pollAccount: pollAddress
    })
    .rpc();

    console.log('Your transaction signature', smoothTx);
  });

  it('vote', async () => {

    const tx = await program.methods.vote(
      new anchor.BN(1),
      "smooth",
    )
    .rpc();

    console.log('Your transaction signature', tx);
  });
});
