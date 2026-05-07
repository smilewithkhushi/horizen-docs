---
title: VELA vs. Regular Smart Contracts
---

# VELA vs. Smart Contracts

Both smart contracts and VELA let you execute application logic 
on-chain. The difference is **who can see what's happening**.

Understanding this distinction is the most important decision you'll 
make when building on Horizen.


### The Core Difference

A standard EVM smart contract executes on every node in the network. 
Every node sees every input, every state variable, every output. 
This is what makes blockchains trustless — verification is universal 
and public. But it also means **your application has no secrets**.

VELA executes inside a TEE — a hardware-enforced private enclave. 
Only the enclave sees the inputs and intermediate state. What gets 
committed on-chain is an encrypted state root and a cryptographic 
attestation proving the computation was correct. **Verification is 
preserved. Privacy is added.**



### Side-by-Side Comparison

| Property | Smart Contract | VELA |
|---|---|---|
| Execution environment | EVM (all nodes) | TEE (single attested enclave) |
| Input visibility | Public | Private (encrypted) |
| State visibility | Public | Private (encrypted state root on-chain) |
| Output visibility | Public | Configurable (encrypted or selectively disclosed) |
| Verifiability | Consensus-based (all nodes re-execute) | Attestation-based (TEE proof) |
| Auditability | Anyone can read state | Authorized parties only, via Authority Service |
| Trust model | Trustless — trust the code | Trust the hardware vendor + the code |
| Language | Solidity / Vyper | Any WASM-compatible language (Go, Rust, etc.) |
| Composability | Native EVM composability | Interacts with Horizen Chain; results anchored on-chain |
| Performance overhead | Near-native EVM | Near-native (TEE adds minimal overhead vs. ZK/FHE) |



### The Trust Trade-off


Smart contracts are **trustless** — you trust math since every node independently verifies every 
computation and there is no single point of trust.

VELA with TEEs introduces a **hardware trust assumption**. You are 
trusting that:
- The CPU manufacturer (e.g., AWS Nitro) implemented the enclave correctly
- The attestation mechanism has not been compromised
- The TEE has not been subject to undisclosed vulnerabilities (side-channel 
  attacks are a known research area for TEE hardware)

This is a meaningful trade-off. TEEs are the pragmatic choice today 
because ZK-based alternatives that could eliminate this trust assumption 
are not yet fast enough for production workloads. VELA's roadmap 
progressively moves toward pure cryptographic guarantees (ZK, FHE) as 
those primitives mature.



### When to Use a Smart Contract

- Application state is intentionally public (token balances, governance 
  votes, AMM pools)
- You need native EVM composability with other protocols on Horizen or Base
- Your business logic has no confidentiality requirements
- You need maximum trustlessness with no hardware assumptions



### When to Use VELA

- User inputs, positions, or balances must not be visible to other users 
  or operators (e.g., a private order book, sealed-bid auction)
- Your application handles personally identifiable information or 
  regulated data
- You need selective auditability — a regulator or compliance officer 
  should be able to verify activity, but competitors should not
- Application logic itself is proprietary and should not be readable 
  on-chain
- You're building AI inference, credential verification, or any 
  computation over private data


### Can You Use Both Together?

Yes, and this is often the right architecture.

A common pattern: You can use a **smart contract** for the public coordination 
layer (settling transactions, managing token flows, emitting events) 
and **VELA** for the private computation layer (executing sensitive logic, 
managing encrypted state). The VELA component commits attested results 
to the smart contract, which settles them publicly.

This lets you preserve EVM composability for the parts of your 
application that should be transparent, while protecting the parts 
that shouldn't.