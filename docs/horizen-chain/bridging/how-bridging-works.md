---
title: How Bridging Works on Horizen
description: "How the native OP Stack bridge works for moving assets to and from Horizen."
sidebar_position: 1
---

## The Native Bridge

The only bridge currently available on Horizen is the **native OP Stack bridge**. It is the canonical, most trust-minimized way to move
assets between Base and Horizen Chain.

| Network | Bridge URL |
| --- | --- |
| Mainnet | `https://hub.horizen.io/` |
| Testnet | `https://hub-testnet.horizen.io/` |

The native bridge relies entirely on the OP Stack's optimistic rollup security model —
the same model that secures Base itself. No third-party protocol is involved in the
bridging path.


## Deposit and WIthdrawal Mechanics

Moving assets in each direction behaves very differently. Understanding this before
you bridge will prevent surprises.

### Deposits : Base → Horizen

Deposits are straightforward and fast. When you deposit from Base to Horizen:

1. Your ETH (or supported asset) is locked in the bridge contract on Base
2. An equivalent amount is minted on Horizen
3. Funds arrive on Horizen **within a few minutes**

There is no challenge window for deposits. Once the transaction is confirmed on Base
and the Horizen Sequencer processes it, your funds are available.

### Withdrawals : Horizen → Base

Withdrawals are a two-step process and take significantly longer due to the
**7-day challenge window** that is a core property of the optimistic rollup model.


<div style={{padding: '24px', borderRadius: '8px', display: 'flex', justifyContent: 'center'}}>
  <img src="/img/horizen-chain/Withdrawalsonhorizen.png" alt="Adding Horizen Testnet to MetaMask" width="520" />
</div>


:::warning 7-Day Withdrawal Window
Withdrawals from Horizen to Base take a minimum of **7 days** to complete.
It is the security mechanism of the optimistic rollup
model. Plan accordingly. Do not initiate a withdrawal if you need your funds on Base
sooner than 7 days from now.
:::

:::note Two Transactions Required
A withdrawal requires **two separate transactions**:
- Transaction 1: Initiate the withdrawal on Horizen (costs gas on Horizen)
- Transaction 2: Claim the funds on Base after 7 days (costs gas on Base)

You must return to `https://hub.horizen.io/` after the 7-day window to complete
the claim. Funds are not automatically sent to your Base wallet.
:::



## What the Bridge Supports

The native bridge currently supports **ETH** between Base and Horizen.

:::note
Additional assets may be available through the bridge UI. Always verify the asset
list directly at `https://hub.horizen.io/` — this documentation reflects the state
at the time of writing and the bridge may be updated independently.
:::



## Trust Model

The native bridge inherits the full security of the OP Stack and Base:

- **Deposits** are secured by Base's smart contracts and finality guarantees
- **Withdrawals** are secured by the 7-day optimistic challenge window — any
  invalid state can be disputed during this period before funds are released
- **No third party** is involved in the bridging path — there is no relayer,
  liquidity provider, or off-chain validator between you and the contracts

This makes the native bridge the most trust-minimized option available. The
tradeoff is the 7-day withdrawal window.
