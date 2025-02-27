use anchor_lang::prelude::*;

declare_id!("CoJhQiDp2CCRhpEmSS5kGTRRYEGgdLCqVwBoLso3fEU9");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8; 

#[program]   // solana macro 
pub mod favorites {
    use super::*;

    pub fn set_favorites(
        context: Context<SetFavorites>, 
        favorite_number: u64,
        favorite_color: String,
        favorite_hobbies: Vec<String>
    ) -> Result<()> {
        let user = context.accounts.user.key();
        
        msg!("Greeting from {}", context.program_id);
        msg!("user {user}'s favorite number is {favorite_number}, favorite color is {favorite_color}");
        msg!("favorite hobbies is {:?}", favorite_hobbies);

        context.accounts.favorites.set_inner(Favorites{
            number: favorite_number,
            color: favorite_color,
            hobbies: favorite_hobbies,
        });

        Ok(())
    }
}


// #[account] 是一个属性（attribute），用于标记一个结构体作为账户（account）。
// Solana程序（智能合约）中的数据存储是通过账户实现的，#[account] 会为这个结构体自动生成一些必要的实现代码，例如账户的序列化和反序列化逻辑。
// solana的account结构体中有一个data字段，像Favorites这样的结构体被序列化后就会被存在这个data字段中
#[account]   

// derive 是Rust中的一个宏，用于自动为结构体或枚举实现某些 trait（特性） 
// 在Solana的Anchor框架中，InitSpace 可能会计算结构体占用的存储空间，并生成相应的初始化逻辑。 
#[derive(InitSpace)]   
pub struct Favorites {
    pub number: u64,

    #[max_len(64)]  // 设置长度，否则会变成无限长
    pub color: String,

    #[max_len(5,64)]
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
// SetFavorites这个结构体用来定义set_favorites()这个函数的上下文
// 确保传入的账户满足操作的要求（例如账户是否可写、是否需要签名等）。
pub struct SetFavorites<'info> {
    #[account(mut)]  // 在 Solana 中, 如果一个账户需要被修改，必须显式标记为 mut。
    pub user: Signer<'info>,

    #[account(
        init_if_needed,  // 如果 favorites 账户尚未初始化，则自动初始化它
        payer = user,    // 在 Solana 中，创建新账户需要支付租金（rent），payer 指定了支付这笔费用的账户。
        
        // 指定了账户需要分配的存储空间
        // ANCHOR_DISCRIMINATOR_SIZE 是 Anchor 框架内部使用的标识符大小（通常为 8 字节）。 
        // Favorites::INIT_SPACE 是 Favorites 结构体占用的空间，由 #[derive(InitSpace)] 自动计算。
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,  
        
        // seeds 用于生成 PDA（Program Derived Address，程序派生地址）。
        // b"favorites" 是一个字节字符串，作为 PDA 的种子（seed）。
        // user.key().as_ref() 是用户的公钥，作为另一个种子。
        // 通过这两个种子，程序可以生成一个唯一的 PDA，用于标识 favorites 账户。
        seeds = [b"favorites", user.key().as_ref()],
        
        // 随机数
        bump
    )]  
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

