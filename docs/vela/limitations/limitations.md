---
title: What's Not Supported Yet
description: "VELA current limitations: local Docker development only (no testnet or mainnet deployment yet), emulated TEE (no hardware attestation in dev), and other unsupported features in the active development phase."
sidebar_position: 1
---

VELA is in active development. The following constraints apply to the current release and will be addressed in upcoming iterations.

### No Production Deployment

VELA is not yet deployed to any testnet or mainnet environment. All development and testing happens locally using Docker.

### Emulated TEE

The local development environment uses an emulated Trusted Execution Environment rather than real hardware enclaves. This means your application logic runs in an isolated container, but does not benefit from hardware-level attestation guarantees.

If you have a working prototype and need access to a dedicated AWS Nitro Enclave instance on Horizen Chain, contact the team directly.

### Single WASM Application Per Environment

Only one WebAssembly application can be deployed into a VELA environment at a time. Multi-app support is on the roadmap.
