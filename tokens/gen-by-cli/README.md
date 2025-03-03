```shell
## 在当前目录下生成一个keypair，用来当做token的所有者/铸造者
solana-keygen grind --starts-with own:1

## 指定使用哪个钱包
solana config set --keypair <文件名>.json

## 设置devnet
solana config set --url devnet 

## 检查是否成功设置测试网
solana config get 

## 获取测试网SOL
solana airdrop 

## 生成token的铸币厂地址（mint's address)
solana-keygen grind --starts-with mnt:1

## 创建token
## 使用ownxxx这个钱包调用token2022这个程序，创建一个地址为mntxxx的token
## Token-2022 Program addresss:	TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
## doc: https://spl.solana.com/token-2022 
## 注意替换成自己的mint地址
## 结果：
## https://solscan.io/token/mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK?cluster=devnet
## https://explorer.solana.com/address/mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK?cluster=devnet
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK.json

## 创建一个token的metadata.json文件，存放名字，图片url等内容
## 结果： https://solscan.io/token/mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK?cluster=devnet#metadata
spl-token initialize-metadata mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK 'R' 'R' https://raw.githubusercontent.com/x1rh/solana-demo/refs/heads/main/tokens/gen-by-cli/metadata.json

## 铸造一些给我们的ownxxx钱包
## 先给当前签名的ownxxx的这个钱包创建在这个token中的account
## 结果： 879ymj4XRUMJt3GpYx86HoX5A6YjJt4NaL4f9BURbA3g
spl-token create-account mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK 
## 铸造
## 从token的mint铸造114514个token给当前签名的钱包（对应的PDA）
spl-token mint mntQpF25ZkuUPmTVoS38vj3HnZd4EXwfYiLbXstbPAK 114514 
```
