---
title: ZEN Token Migration Guide
sidebar_position: 2
---

# ZEN Token Migration Guide

This page explains how the ZEN token migration works at a technical level, including the smart contract architecture and the available claim methods for ZEND mainchain users.

## Who Needs to Claim

- **EON users** — No action required. Balances were automatically migrated to the same address on Base.
- **ZEND mainchain users** — A manual claim is required because the address formats differ (Bitcoin-format on ZEND vs. Ethereum-format on Base).

## Smart Contract Architecture

The migration uses a set of interconnected contracts deployed on Base:

### ZenToken (ERC-20)

The official ERC-20 contract representing ZEN on Base. It has a maximum capped supply of 21 million ZEN (matching the old mainchain cap). Minting authority is granted only to the vault contracts.

| | |
|---|---|
| Address on Base | [0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229](https://basescan.org/address/0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229) |
| Source code | [ZenToken.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/ZenToken.sol) |

### EONBackupVault

Stores EON balances and automatically distributes them to the same addresses on Base. Data was loaded in batches using the `batchInsert` method, and distribution was performed via multiple calls to `distribute`.

| | |
|---|---|
| Address on Base | [0x1Cc689233837A0b96e1f176d49FC08462f70C47F](https://basescan.org/address/0x1Cc689233837A0b96e1f176d49FC08462f70C47F) |
| Source code | [EONBackupVault.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/EONBackupVault.sol) |

### ZENDBackupVault

Stores ZEND balances and exposes methods for manual claiming. During data loading, the contract minted corresponding ZEN values to itself. When a user claims successfully, the ZEN amount is transferred from the contract to the specified destination address.

Claiming is only enabled after the cumulative hash verification is complete, confirming data integrity.

| | |
|---|---|
| Address on Base | [0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2](https://basescan.org/address/0x1Ee188bDf19eBF04B73Ab6FFcec2a864cd4774F2) |
| Source code | [ZendBackupVault.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/ZendBackupVault.sol) |

### LinearTokenVesting

A contract that locks ERC-20 tokens and releases them to a predefined beneficiary on a linear schedule. The number of intervals and time between each interval are configurable. An admin address (subject to off-chain DAO voting) can modify the beneficiary or vesting parameters.

| | |
|---|---|
| Source code | [LinearTokenVesting.sol](https://github.com/HorizenOfficial/horizen-migration/blob/main/erc20-migration/contracts/LinearTokenVesting.sol) |

## Claim Methods

All claim methods are called on the ZENDBackupVault contract. After a successful claim, the following event is emitted:

```solidity
event Claimed(address destAddress, bytes20 zenAddress, uint256 amount)
```

### claimP2PKH (Standard Addresses)

This is the most common claim type, used for Pay-to-PubKey-Hash UTXOs (Sphere Wallet and most non-custodial wallets).

```solidity
function claimP2PKH(
    address destAddress,
    bytes memory hexSignature,
    PubKey calldata pubKey
) public
```

**Parameters:**

- `destAddress` — The destination address on Base to receive the claimed ZEN. Can be any address (does not need to match the transaction sender).
- `hexSignature` — ECDSA/Secp256k1 signature generated with the private key associated with the UTXOs. The signed message must be: `"ZENCLAIM" + destAddress` (destAddress in EIP-55 hex form with `0x` prefix, no spaces).
- `pubKey` — The uncompressed public key associated with the private key used for signing. Composed of two `bytes32` fields representing the x and y components.

### claimP2SH (Multisig Addresses)

For Pay-to-Script-Hash multisig UTXOs.

```solidity
function claimP2SH(
    address destAddress,
    bytes[] memory hexSignatures,
    bytes memory script,
    PubKey[] calldata pubKeys
) public
```

**Parameters:**

- `destAddress` — Destination address on Base.
- `hexSignatures[]` — List of ECDSA/Secp256k1 signatures from the multisig private keys. The signed message must be: `"ZENCLAIM" + zen_multisig_address + destAddress` where `zen_multisig_address` is the hex representation of the multisig address (base58check decoded, leading 2 bytes removed, prepended with `0x`). The array length must equal the total number of signatures accepted by the script. Missing signatures should be set to empty bytes. Example for 2-of-3 with signatures A and C: `[SigA, 0x, SigC]`.
- `script` — The full UTXO redeem script.
- `pubKeys` — List of uncompressed public keys matching the script order. Missing keys should have both x and y set to `bytes32(0)`.

### claimDirect (Pre-arranged Single Address)

For users who cannot generate a signed message. Requires that the user moved their ZEN to a deterministically generated address on ZEND **before** the migration.

```solidity
function claimDirect(address baseDestAddress) public
```

The target ZEND address is derived from the Base destination address:

1. Calculate SHA256 hash of the `baseDestAddress` hex
2. Calculate RIPEMD-160 hash of the SHA256 output
3. Prepend `0x2089` (mainnet) or `0x2098` (testnet)
4. Encode in Base58

```javascript
const createHash = require('create-hash')
const bs58check = require('bs58check')

const prefix = '2089'
const baseDestAddress = // Base address without '0x' prefix

const ZENDTransferAddress = bs58check.encode(
  Buffer.from(
    prefix +
    createHash('rmd160').update(
      createHash('sha256').update(
        Buffer.from(baseDestAddress, 'hex')
      ).digest()
    ).digest('hex'),
  'hex')
)
```

### claimDirectMultisig (Pre-arranged Multisig)

Similar to `claimDirect`, but uses a 1-of-2 multisig P2SH address where one public key is derived from the Base destination address. This allows the user to retain control of their funds on ZEND using their owned key.

```solidity
function claimDirectMultisig(bytes memory script, address baseDestAddress) public
```

The multisig address is generated by creating a 1-of-2 multisig where the second public key is: `"02" + SHA256(baseDestAddress hex)`.

```javascript
const zencashjs = require('zencashjs')
const createHash = require('create-hash')

const baseDestAddress = // Base address without '0x' prefix
const directMultisigPubKey1 = // Any owned public key
const directMultisigPubKey2 = "02" + createHash('sha256')
  .update(Buffer.from(baseDestAddress, 'hex')).digest('hex')

const multisigScript = zencashjs.address.mkMultiSigRedeemScript(
  [directMultisigPubKey1, directMultisigPubKey2], 1, 2
)
const zenDirectMultisigAddress = zencashjs.address.multiSigRSToAddress(multisigScript)
```

## Data Integrity

The migration uses a cumulative hash as a fingerprint of the loaded data. For a list of `[address, balance]` tuples ordered alphabetically by address:

```
cumulative_hash = 0x000...000
for each tuple:
    cumulative_hash = keccak256(cumulative_hash, tuple.address, tuple.value)
```

This hash was calculated off-chain, stored in the smart contract, and recalculated during data loading to confirm correctness. Claiming is only enabled once the on-chain hash matches the expected value.

Third parties can independently verify this using the [horizen-migration-check](https://github.com/HorizenOfficial/horizen-migration-check) tool.
