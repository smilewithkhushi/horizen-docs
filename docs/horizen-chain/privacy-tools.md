---
title: Privacy Tools
description: "Privacy primitives available on Horizen: VELA for confidential TEE execution and zkVerify for on-chain ZK proof verification."
sidebar_position: 5
---

Horizen supports two privacy primitives. They solve different problems — choosing the right one depends on what your application needs to keep private and how it needs to prove correctness.

## VELA - Confidential Execution

<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/img/vela/vela-hl-banner.png" alt="VELA" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

VELA is a confidential coprocessor. Application logic runs inside TEE hardware enclaves where data is encrypted in memory, inaccessible to any external observer including the host machine and cloud provider. Every computation produces a cryptographic attestation proving the code ran correctly inside a genuine enclave, without revealing the underlying data or intermediate state.

**Use VELA when:**
- Your application processes sensitive inputs that must stay private during computation — confidential balances, sealed bids, private order books, encrypted AI inference
- You need cryptographic proof that specific logic executed correctly without exposing what it executed on
- Compliance or audit requirements demand verifiable rule enforcement without raw data disclosure

→ [What is VELA?](/vela/introduction)

## zkVerify - On-Chain ZK Proof Verification

<div style={{display: 'flex', justifyContent: 'center', margin: '24px 0'}}>
  <img src="/img/tutorials/zkverify.png" alt="zkVerify" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

zkVerify is a purpose-built L1 for verifying ZK proofs. Applications generate proofs off-chain using a ZK proving system, submit them to zkVerify, and receive on-chain verification results consumable by contracts on Horizen or any other EVM-compatible chain, without deploying a custom verifier contract or paying native chain gas costs for proof verification.

**Use zkVerify when:**
- Your application already generates ZK proofs (from a ZK circuit, prover library, or ZK rollup) and needs cheap, fast on-chain verification
- You want to avoid deploying and maintaining chain-specific verifier contracts
- You need to aggregate or batch proof verification across multiple applications

→ [zkVerify Documentation](https://docs.zkverify.io)
