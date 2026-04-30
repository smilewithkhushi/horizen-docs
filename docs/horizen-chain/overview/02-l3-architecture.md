---
title: The L3 Architecture
sidebar_position: 2
---

Horizen Chain is an OP Stack L3 rollup that settles directly onto Base (L2), which in turn settles onto Ethereum (L1).


### The Layered Model

**Ethereum (L1) for Security & Final Settlement** : It is the root of trust. Ethereum provides the cryptographic finality that everything above it inherits.

**Base (L2) for Scalable Execution & Data Availability** : Horizen's settlement surface. Transaction data and state commitments from Horizen are published directly to Base's native data-availability layer.

**Horizen Chain (L3) for Confidential Compute & Privacy Apps** : It is an EVM-compatible rollup using the OP Stack. Horizen inherits Base's scalability and sequencing infrastructure while adding native support for confidential execution through VELA.

**VELA as Confidential Coprocessor** : It sits alongside Horizen Chain as a coprocessor — applications offload sensitive logic to TEE enclaves inside VELA, receive attested encrypted results back, and anchor those results on-chain.

<img src="/img/horizen-chain/l3-architecture.png" alt="L3 Architecture" style={{width: '80%', display: 'block', margin: '0 auto'}} />

### What This Means in Practice

**Horizen inherits Ethereum's security without connecting to it directly.**
By publishing transaction data and state commitments to Base's native DA layer, Horizen's finality guarantees flow up through Base to Ethereum automatically.

**Base handles settlement, disputes, and withdrawals.**
The Horizen Sequencer batches transactions and submits them to Base. The Proposer submits output roots (state commitments) to a contract on Base. All disputes and withdrawals are resolved through Base, not Ethereum directly.

**The OP Stack provides the rollup foundation.**
Horizen uses the same proven framework as Base — the same sequencing model, derivation pipeline, and EVM execution engine with Horizen-specific extensions for confidential compute integration through VELA.

**The chain coordinates. VELA computes privately.**
Applications on Horizen Chain can offload sensitive logic to VELA's TEE enclaves, receive attested encrypted results, and anchor those results on-chain. The Horizen Chain manages state and coordination. VELA handles everything that needs to stay confidential.

