---
title: "Bridge Assets via Stargate"
description: Step-by-step instructions for bridging assets to and from Horizen using the Stargate bridge.
sidebar_position: 3
---

# Stargate Bridge

Stargate is a cross-chain liquidity protocol built on [LayerZero](https://layerzero.network), and serves as the canonical cross-chain bridge for Horizen. It enables native asset transfers between Horizen and 80+ other blockchains without wrapping tokens or using intermediary assets.

ZEN, USDC, and cbBTC are all bridgeable via Stargate using the LayerZero OFT (Omnichain Fungible Token) standard.

:::info
For bridging between **Horizen and Base only**, the [native bridge](https://hub.horizen.io/) may be simpler. Use Stargate when bridging to or from chains beyond Base.
:::


## Supported Tokens

The following tokens are supported on Horizen via Stargate:

| Token | Horizen Contract | Type |
|-------|-----------------|------|
| ZEN | `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` | OFT |
| USDC | `0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f` | OFT |
| cbBTC | `0x68fb5BB8330C0b9d907F50f278143873276ee056` | OFT |

These tokens use the LayerZero OFT standard — they are burned on the source chain and minted on the destination chain, maintaining a single canonical supply across all connected chains.

:::note
ZEN on Horizen and Base share the same OFT contract address (`0x57da2D504bf8b83Ef304759d9f2648522D7a9280`) — this is expected behavior for the OFT standard.
:::



## Bridge via the Stargate UI

### Prerequisites

- A wallet with funds on your source chain (e.g., ETH for gas on Base or Horizen)
- The token you want to bridge

### Steps

1. Go to [stargate.finance](https://stargate.finance)
2. Connect your wallet
3. On the **Transfer** page, select your source chain and token
4. Select **Horizen** as the destination chain (or vice versa)
5. Enter the amount to bridge
6. Review the estimated fee and receive amount
7. Click **Transfer** and confirm the transaction in your wallet

Stargate offers two transfer modes:

- **Simple** — sends assets to your same connected wallet address on the destination chain. Use this for most cases.
- **Advanced** — lets you specify a custom destination address. Use this if you're bridging to a different wallet.

### Fees

Stargate charges a protocol fee of **0.06%** per transfer. You will also pay gas on the source chain. No gas is required on the destination chain.

### Transfer time

Most transfers complete in **under 2 minutes**, depending on source chain finality.


## Slippage

Stargate uses unified liquidity pools. For stable assets like USDC, slippage is typically negligible. You can configure slippage tolerance in **Advanced Settings** on the transfer page.

- **Low slippage (0.1%)** — protects against price changes but may cause the transaction to fail in low-liquidity conditions
- **High slippage (1–3%)** — more likely to succeed but you may receive slightly fewer tokens

For ZEN and cbBTC (OFT standard), slippage does not apply — the burn/mint mechanism guarantees you receive the exact amount minus the protocol fee.



## LayerZero OFT Contract Addresses

For developers integrating token bridging directly, here are the full contract references:

### Mainnet

| Token | Chain | OFT Contract |
|-------|-------|-------------|
| ZEN | Base | OFT Adapter: `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| ZEN | Horizen | OFT: `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` |
| USDC | Base | Lock contract: `0x27a16dc786820b16e5c9028b75b99f6f604b5d26` |
| USDC | Horizen | OFT: `0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f` |
| cbBTC | Base | OFT Adapter: `0x68fb5BB8330C0b9d907F50f278143873276ee056` |
| cbBTC | Horizen | OFT: `0x68fb5BB8330C0b9d907F50f278143873276ee056` |

### Testnet (Base Sepolia ↔ Horizen Testnet)

| Token | Chain | OFT Contract |
|-------|-------|-------------|
| tZEN | Base Sepolia | OFT Adapter: `0x2ead4B0beBD8e54F9B7cC1007DF4c44a27b9a339` |
| tZEN | Horizen Testnet | OFT: `0xb06EC4ce262D8dbDc24Fac87479A49A7DC4cFb87` |
| cbBTC | Base Sepolia | OFT Adapter: `0x5dE29d14E72feb79967596F3Ae57A9BfBA192769` |
| cbBTC | Horizen Testnet | OFT: `0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747` |
