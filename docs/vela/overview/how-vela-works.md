---
title: How VELA Works (Architecture)
---

# How VELA Works

VELA is a **confidential coprocessor** — it runs application logic in a 
hardware-enforced private environment and returns cryptographically 
attested results back to the chain. Think of it as offloading sensitive 
computation to a locked black box that can prove it ran your code 
correctly, without revealing what happened inside.

The core primitive enabling this is a **Trusted Execution Environment (TEE)**.

---

## What is a TEE?

A Trusted Execution Environment is an isolated region of a processor 
where code and data are protected from everything outside it — including 
the host operating system, hypervisor, and cloud provider. Even someone 
with physical access to the machine cannot read memory inside an active TEE.

Two guarantees a TEE provides:

- **Confidentiality** — data loaded into the enclave is encrypted in memory.
  Nothing outside can read it.
- **Integrity + Attestation** — the TEE produces a signed cryptographic 
  report (an *attestation*) proving exactly which code ran, on which 
  hardware, and that the output was not tampered with.

In VELA's case, the TEE is currently emulated locally via Docker. 
For production-grade deployments, AWS Nitro Enclaves are used.

---

## The Four Components

VELA's architecture has four layers that work together in a closed loop.

### 1. Secure Processor Manager

This is the execution engine. When a dApp submits a confidential request 
on-chain, the Secure Processor Manager:

1. Detects the event emitted by the on-chain smart contract
2. Fetches the dApp's WASM module and its encrypted state from the Data Layer
3. Loads both into the TEE
4. Executes the computation in an isolated environment
5. Re-encrypts all outputs before they leave the enclave
6. Produces a TEE-signed attestation confirming what ran and on what hardware
7. Commits the attested result back to the on-chain contract

Applications are **loaded and unloaded ephemerally** — each execution 
starts from a clean instance. No residual plaintext state persists between runs.

### 2. On-Chain Smart Contracts

Three contracts coordinate the lifecycle of every confidential request:

| Contract | Role |
|---|---|
| `ProcessorEndpoint` | Queues incoming workloads, tracks lifecycle, records attestations |
| `TeeAuthenticator` | Verifies the TEE attestation signature on-chain — proves the output came from verified hardware running authenticated code |
| `AuthorityRegistry` | Manages which entities are permitted to request deanonymization of encrypted data |

Attestations are public and immutably recorded on-chain. The underlying 
data and logic remain encrypted at all times.

### 3. Data Layer

The Data Layer is VELA's encrypted persistence backbone. It stores three 
types of data for each dApp:

- **WASM bytecode** — the executable logic of the application
- **Application state** — encrypted with the TEE key; only the enclave 
  can decrypt and update it
- **Deanonymization reports** — encrypted with an authority's public key 
  for controlled audit access

After every execution, the TEE commits an updated **encrypted state root** 
to the Horizen Chain, forming a verifiable, append-only history of state 
transitions — without ever revealing the underlying data.

Each dApp manages its own isolated encrypted state model. It can be 
structured as a ledger, order book, liquidity pool, or any domain-specific 
data shape — all defined in the WASM logic.

### 4. Authority Service

The Authority Service enables **selective auditability** — the ability 
for designated parties (regulators, compliance officers, auditors) to 
request access to specific encrypted reports, without that access being 
open or unlogged.

When an authorized entity initiates a deanonymization request:

1. The `AuthorityRegistry` validates their credentials on-chain
2. The TEE is invoked to generate a deanonymization report
3. The report is encrypted with the authority's public key — only they 
   can read it
4. The access event is immutably recorded on-chain

This gives you two layers of accountability simultaneously: on-chain 
transparency of *that* access occurred, and cryptographic containment 
of *what* was accessed.



## Execution Lifecycle: End to End


## What VELA Applications Are Written In

VELA applications are compiled to **WebAssembly (WASM)**. This means 
you can write application logic in any language that compiles to WASM —
Go, Rust, AssemblyScript, and others. You don't need to learn a new 
cryptographic circuit language or ZK-specific DSL.

The WASM module defines your application's state transitions, business 
logic, and any compliance rules. The TEE enforces them.



## Current Environment

| Property | Current State |
|---|---|
| TEE hardware | Emulated locally (Docker) |
| Production TEE | AWS Nitro, available on request for prototypes |
| Max WASM apps per environment | 1 |
| Network deployment | Local only — no testnet yet |

For setup instructions, see [Local Environment Setup](./local-environment-setup.md).