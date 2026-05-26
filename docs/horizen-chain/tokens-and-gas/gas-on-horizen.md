---
title: Gas on Horizen (ETH)
description: "How gas fees work on Horizen including L2 execution and L1 data fee components."
sidebar_position: 1
---

Gas on Horizen Chain is paid in ETH, the same as on Base and Ethereum mainnet. There is no separate gas token, so if you can use MetaMask on Base, the experience on Horizen is identical.

How gas fees work on an L3:
Every transaction on Horizen has two fee components:

- **L3 execution fee** — the cost of running your transaction on Horizen itself. This is calculated the same way as on any EVM chain: `gas used × gas price`.
- **L1 data fee** — a small additional fee that covers the cost of publishing your transaction data to Base. This is calculated automatically by the OP Stack and added to your total transaction cost. You do not set it manually since it is visible in the transaction receipt as a separate line item.

In practice, fees on Horizen are very low. As an L3 on Base, Horizen benefits from Base's already-low data costs, with the L1 data fee typically being a small fraction of the total transaction cost.

Getting ETH on Horizen:
1. **Testnet:** Use the faucet at [https://horizen-testnet.hub.caldera.xyz/](https://horizen-testnet.hub.caldera.xyz/).
2. **Mainnet:** Bridge ETH from Base to Horizen via [https://hub.horizen.io/](https://hub.horizen.io/).