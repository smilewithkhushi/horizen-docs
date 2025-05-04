---
title: Horizen Legacy Chain Overview
sidebar_position: 1
---

# Horizen Legacy Chain Overview

Horizen originally operated two chains: the **ZEND Mainchain** (a Bitcoin-like PoW chain) and **EON** (an EVM-compatible sidechain). In 2025, all ZEN balances from both chains were migrated to an [ERC-20 smart contract on Base](https://basescan.org/address/0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229).

Both old chains have been discontinued. All ZEN transfers are now managed on Base via the ERC-20 contract.

**Migration was successfully completed on July 23, 2025.**

## What Was Migrated

### From EON

All Externally Owned Account (EOA) balances were automatically migrated to the same address on Base. EON and Base share the same address format, so users can continue using the same wallet keys.

Amounts staked by forgers or delegators were also migrated and moved to the owner's address on the new chain.

**Not migrated from EON:**
- Smart contract balances
- ZEN locked inside smart contracts
- Stakes delegated by smart contracts

### From ZEND Mainchain

The migration covered all ZEN funds locked in UTXOs of type:
- **PayToPubKeyHash** (single address, used by Sphere Wallet and most non-custodial wallets)
- **PayToScriptHash Multisig** (multisig addresses)

These two types account for an estimated 99% of all UTXOs on the old mainchain.

ZEND users must perform a manual claim because the address formats differ between the old chain (Bitcoin-format) and Base (Ethereum-format). The UTXO structure on ZEND does not track the original key or address, making automatic mapping impossible.

## Migration Process

1. A migration point was fixed on both old chains (specific block heights).
2. Horizen Labs performed dumps of all relevant balances at those heights.
3. Smart contracts were deployed on Base to handle the restore:
   - [ZenToken (ERC-20)](https://basescan.org/token/0xf43eb8de897fbc7f2502483b2bef7bb9ea179229) — the official ZEN token contract with a maximum capped supply of 21 million ZEN
   - [EONBackupVault](https://basescan.org/address/0x1Cc689233837A0b96e1f176d49FC08462f70C47F) — stores EON balances and automatically mints them on Base
   - [ZENDBackupVault](https://basescan.org/address/0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2) — stores ZEND balances and exposes methods for manual claiming
4. Balance data was loaded into the vault contracts via batch transactions.
5. ZEND owners can claim funds by calling methods on the ZENDBackupVault contract.

## Final Block References

The migration point was determined by specific block heights on both chains. These were confirmed by more than 100 subsequent blocks on the mainchain, making a revert infeasible.

| Chain | Final Block Height | Final Block Hash |
|-------|---|---|
| ZEND Mainchain | 1,807,300 | `000000000059963d5021a9c29167878916e476a249ca988dd828bac4a8a3351a` |
| EON | 3,573,401 | `d3e837c2939917f8a676f9a4b626c1024718636740732db05fc6de811a8e32aa` |

## Verifying the Migration

The data loading process was completed by Horizen Labs, but anyone can independently verify the migrated data. The verification involves:

1. Taking a dump of the chain state at the migration height (or downloading the [certified artifacts from GitHub](https://github.com/HorizenOfficial/horizen-migration/tree/main/snapshots/mainnet))
2. Recalculating the cumulative hash locally using the same algorithm
3. Comparing it with the hash stored in the vault smart contracts

The verification tool is available at: [horizen-migration-check](https://github.com/HorizenOfficial/horizen-migration-check)

## Smart Contract Source Code

All migration smart contracts are publicly available: [horizen-migration/erc20-migration/contracts](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts)
