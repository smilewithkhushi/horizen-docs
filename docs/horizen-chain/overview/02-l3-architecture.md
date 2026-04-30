---
title: How It Sits on Base (L3 Architecture)
sidebar_label: L3 Architecture
---

# How It Sits on Base (L3 Architecture)

Horizen is an L3 — a chain that settles to an L2 (Base), which in turn settles to Ethereum L1. This layered architecture gives Horizen the best of both worlds: the security of Ethereum and the low fees of Base, while adding privacy-native features at the L3 layer.

## The stack

```
Ethereum L1 (settlement + ultimate security)
    └── Base L2 (OP Stack rollup, high throughput)
            └── Horizen L3 (OP Stack rollup, privacy layer)
```

## Why L3?

Building as an L3 on Base allows Horizen to:

1. **Inherit security** — Horizen's state is ultimately verified on Ethereum via Base.
2. **Stay EVM-compatible** — The execution environment is a near-vanilla EVM. Any Ethereum tool works.
3. **Add features without forking** — The OP Stack's modular design lets Horizen add TEE-based privacy without breaking compatibility.
4. **Benefit from Base's ecosystem** — DeFi liquidity, USDC, and developer tooling from Base are accessible via bridging.

## How transactions flow

1. A user sends a transaction to Horizen's Sequencer.
2. The Sequencer orders and executes transactions locally, then passes batches to the Batcher.
3. The Batcher compresses batches and submits them to Base as calldata or blobs.
4. Full nodes on Horizen replay the data from Base to verify state independently.
5. The Proposer submits state roots to Base; disputes can be raised during a 7-day challenge window.

For the detailed component breakdown, see [System Overview](/horizen-chain/architecture/system-overview).
