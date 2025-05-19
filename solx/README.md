## intro
```shell
npx jest
```

## source 
https://github.com/ChainBuff/solana-web3js 


## 功能
- 计算账户所有token的总价值
- 查找账户在okx上的挂单
- 查找账户在jup上的挂单
- 获取leader
- 接入raydium的swap
- 区分token是从哪个平台发射的
- 查找某个token流动性最多的平台
- lp做市
- 最后的lp为什么不能拿出来：https://solscan.io/account/C8GZzbLSYQfbacnkiFm8J35JrpKh2b4dYEJ2JuTFhjmq
- 灵感来源（https://pumpportal.fun/data-api/real-time）
    - subscribeNewToken对于令牌创建事件。
    - subscribeTokenTrade针对特定代币进行的所有交易。
    - subscribeAccountTrade针对特定账户进行的所有交易。
    - subscribeMigration用于订阅代币迁移事件。
- 发布pumpfun的token
    - https://pumpportal.fun/creation