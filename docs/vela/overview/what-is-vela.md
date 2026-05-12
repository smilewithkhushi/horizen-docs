---
title: What is VELA?
description: "Introduction to VELA — Horizen's confidential execution layer using trusted execution environments."
sidebar_position: 1
---

# What is VELA?

VELA is a confidential coprocessor for Web3 applications. It allows developers to run application logic inside Trusted Execution Environments (TEEs), where data is encrypted in memory and computations are cryptographically attested.

No operator, cloud provider, or third party can access the data being processed. At the same time, regulators and auditors can verify compliance through cryptographic proof without requiring access to raw application state.

## Key Properties

**Confidential execution** — Application logic runs inside a TEE. Data is encrypted in memory and inaccessible to the host machine, the cloud provider, or any external observer.

**Cryptographic attestation** — Every computation produces a verifiable attestation that proves the code ran correctly inside a genuine enclave, without revealing the data itself.

**Compliance without exposure** — Authorized parties (auditors, regulators) can verify that specific rules were followed using cryptographic proofs. They do not need access to the underlying data.

**Chain-agnostic** — VELA is not limited to Horizen Chain. It is designed as a coprocessor that can serve applications across multiple EVM-compatible networks.

## How It Fits with Horizen

Horizen Chain is an EVM-native L3 built on Base. VELA extends it by providing the confidential computation layer that the base chain does not offer. Together, they enable applications that are both publicly verifiable and privately executed.

## Current Status

VELA is in active development and open for developer testing. The local development environment runs via Docker with an emulated TEE. For details on getting started, see the [Getting Started](/vela/getting-started/getting-started) section.
