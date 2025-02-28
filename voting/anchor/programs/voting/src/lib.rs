#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voting {
    use super::*;
    
    pub fn initialize_poll(
        ctx: Context<InitializePollCtx>, 
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_stop: u64
    ) -> Result<()> {
       let poll = &mut ctx.accounts.poll_account;
       poll.poll_id = poll_id;
       poll.description = description;
       poll.poll_start = poll_start;
       poll.poll_stop = poll_stop;

        Ok(())
    }

    pub fn initialize_poll_candidate(
        ctx: Context<InitializePollCandidateCtx>,
        poll_id: u64,
        poll_candidate: String,
    ) -> Result<()> {
        ctx.accounts.candidate_account.name = poll_candidate;
        ctx.accounts.poll_account.poll_option_index += 1;
        Ok(())
    }

    pub fn vote(
        ctx: Context<VoteCtx>,
        poll_id: u64,
        candidate: String,
    ) -> Result<()> {
        let candidate_account = &mut ctx.accounts.candidate_account;
        let current_time = Clock::get()?.unix_timestamp;

        if current_time > (ctx.accounts.poll_account.poll_stop as i64) {
            return Err(ErrorCode::VotingEnded.into());
        }

        if current_time < (ctx.accounts.poll_account.poll_start as i64) {
            return Err(ErrorCode::VotingNotStarted.into());
        }

        candidate_account.vote_cnt += 1;
        Ok(())
    }
}


#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    pub poll_id: u64,

    #[max_len(64)]
    pub description: String,
    pub poll_start: u64,
    pub poll_stop: u64,
    pub poll_option_index: u64,
}


#[account]
#[derive(InitSpace)]
pub struct CandidateAccount {
    #[max_len(32)]
    pub name: String,
    pub vote_cnt: u64,
}


#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePollCtx<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + PollAccount::INIT_SPACE, 
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate: String)]
pub struct InitializePollCandidateCtx<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub poll_account: Account<'info, PollAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + CandidateAccount::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate.as_ref()],
        bump,
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate: String)]
pub struct VoteCtx<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, PollAccount>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate.as_ref()],
        bump)]
    pub candidate_account: Account<'info, CandidateAccount>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("voting has not started yet")]
    VotingNotStarted,
    
    #[msg("voting has endded")]
    VotingEnded,
}
