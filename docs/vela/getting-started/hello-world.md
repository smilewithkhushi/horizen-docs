---
title: "Hello World: Your First Confidential App"
sidebar_position: 3
---

This guide walks you through deploying the VELA example application — 
a private transfer app — and running your first confidential transaction. 
By the end you will have deposited ETH into an encrypted account inside 
the TEE and verified your private balance.

> **Prerequisites:** Complete [Local Environment Setup](./local-environment-setup.md) 
> and have `docker compose up` running before proceeding.

---

## What You're Deploying

The example application (`vela-nova`) is a private account-based ledger 
running entirely inside the TEE. Balances, transfers, and transaction 
history are all encrypted — external observers see only attested state 
roots on-chain, not the underlying data.

It supports four operations: `deposit`, `privatetransfer`, `withdraw`, 
and `deanonymize` (for authorized auditors).

---

## Step 1: Download the Artifacts

Go to the [`vela-nova` v0.1.0 release page](https://github.com/HorizenOfficial/vela-nova/releases/tag/v0.1.0) 
and download two files:

- `payment_app.wasm` — the compiled WASM module you'll deploy into the TEE
- `nova-linux` — the CLI wallet for interacting with the app

Make `nova-linux` executable:

```bash
chmod +x nova-linux
```

---

## Step 2: Configure the Wallet

Copy the wallet config template:

```bash
cp wallet.conf.template wallet.conf
```

Open `wallet.conf` and set the following values to connect to 
your local environment:

```
rpcUrl=http://localhost:8545
ProcessorAddress=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
TeeAuthenticatorAddress=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AuthorityServiceURL=http://localhost:8081
SubgraphURL=http://localhost:8000/subgraphs/name/hcce
```

These are the deterministic contract addresses deployed by the 
local `deployer` service. They will be the same on every fresh 
environment.

---

## Step 3: Set Your Keys

You need two keys: a secp256k1 key for signing on-chain transactions, 
and a P-521 key for private communication with the TEE.

**secp256k1 key** — use one of the Anvil default account private keys. 
These are printed in the `chain` service logs and are pre-funded 
with 1000 ETH. Add it to `wallet.conf`:

```
keySecp256k1=<anvil-private-key>
```

**P-521 key** — generate a fresh key pair:

```bash
./nova-linux generatekeys
```

Copy the output into `wallet.conf`:

```
keyP521=<generated-p521-key>
```

The P-521 key is used for ECDH-encrypted communication between your 
client and the TEE. The TEE uses your registered public key to encrypt 
all events it sends back to you — only your private key can decrypt them.

---

## Step 4: Deploy the WASM Application

```bash
./nova-linux deployapp \
  --wasm /absolute/path/to/payment_app.wasm \
  --max-value-fee "100 wei"
```

What happens under the hood:

1. The wallet uploads `payment_app.wasm` to the Authority Service (`POST /deploy/upload`)
2. An on-chain deploy request is submitted to `ProcessorEndpoint`
3. The Processor Manager picks up the request and forwards the WASM artifact to the Executor inside the TEE
4. The TEE verifies the WASM fingerprint (SHA-256) against the on-chain descriptor before loading the module
5. The application is assigned `applicationId: 1`

> **Role requirement:** The account you're using must have the 
> `DEPLOYER_ROLE` on `ProcessorEndpoint`. The Anvil default accounts 
> have this pre-granted in the local dev environment.

---

## Step 5: Register Your User

Before you can interact with the app, register your P-521 public key 
on-chain. This tells the TEE which key to use when encrypting events 
back to you:

```bash
./nova-linux registeruser
```

---

## Step 6: Run Your First Private Transaction

Check your public balance (starts at zero):

```bash
./nova-linux getpublicbalance
```

Deposit 1 ETH into your private account inside the TEE:

```bash
./nova-linux deposit -a "1 ETH"
```

The deposit is submitted as an on-chain transaction. The Processor 
Manager detects it, routes it to the Executor, which credits your 
encrypted account inside the TEE and emits an encrypted event 
confirming the operation. Only your P-521 key can decrypt it.

Verify your private balance:

```bash
./nova-linux getprivatebalance
```

If you see `1 ETH` reflected in your private balance, 
the full stack is working correctly.

---

## Full Command Reference

```bash
./nova-linux generatekeys          # Generate a P-521 key pair
./nova-linux deployapp             # Deploy a WASM application
./nova-linux registeruser          # Register your P-521 key on-chain
./nova-linux getpublicbalance      # Query on-chain balance
./nova-linux deposit -a "1 ETH"    # Deposit into private account
./nova-linux getprivatebalance     # Query encrypted TEE balance
./nova-linux privatetransfer       # Transfer between private accounts
./nova-linux help                  # Full command reference
```

---

## What to Build Next

The `vela-nova` source at [`v0.1.0`](https://github.com/HorizenOfficial/vela-nova) 
is a reference implementation. It shows you the complete structure 
of a VELA WASM application: state design, the four required exports 
(`deploy`, `load_module`, `deposit`, `process_request`), event 
emission, and error handling.

To build your own application, start there and replace the business 
logic with your own.
