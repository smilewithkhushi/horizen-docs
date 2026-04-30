---
title: Block Explorer
sidebar_position: 3
---

Horizen provides a full block explorer for both mainnet and testnet, powered by Caldera.

| Network | Explorer URL |
| --- | --- |
| Mainnet | https://explorer.horizen.io/ |
| Testnet | https://explorer-testnet.horizen.io/ |

### What you can do with the explorer

- Search transactions by hash, block number, or address
- View contract deployments and verified source code
- Inspect token transfers (ERC-20, ERC-721, ERC-1155)
- Monitor wallet balances and transaction history
- Track internal transactions and event logs

### Verifying a contract

After deploying a contract, navigate to the contract address on the explorer, click the Contract tab, and select "Verify & Publish". You will need:

- The exact compiler version used during compilation
- The optimization settings from your `foundry.toml` or `hardhat.config`
- The flattened source code or Standard JSON input