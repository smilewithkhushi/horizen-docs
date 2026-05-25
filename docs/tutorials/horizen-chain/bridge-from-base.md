---
title: Bridge Assets from Base to Horizen
description: "Step-by-step guide to bridging assets from Base to Horizen."
---

# Bridge Assets from Base to Horizen

> **If you just want to move tokens between chains:** use the bridge UI at `https://horizen.hub.caldera.xyz/` — connect wallet, pick direction, done.
>
> This tutorial is for developers who need to **trigger bridge operations programmatically** from a script or smart contract, understand the finality guarantees their application depends on, or build a frontend that wraps the bridge lifecycle.


## Two Mechanisms. Different Contracts. Different Guarantees.

Horizen is an OP Stack L3 that settles on Base. Bridging is not one thing — it's two separate systems with different trust models that happen to move assets between the same chains:

**Which one to use in your dApp:**

- Your contract on Horizen needs to receive ETH from Base → **OP Stack deposit**
- Your contract on Horizen needs to send ETH back to Base without the user waiting 7 days → **Stargate V2**
- You're building a dApp that handles ZEN, USDC, or cbBTC cross-chain → **LayerZero OFT**
- You're building a withdrawal flow and can tolerate the wait → **OP Stack withdrawal** (more trust-minimized)

---

## Confirmed Token Addresses

Every address below is verified from the Horizen documentation. The OFT pattern means some addresses are shared between Base and Horizen — the same contract handles both ends.

| Token | Network | Address | Role |
|---|---|---|---|
| ZEN | Base Mainnet | `0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229` | ERC-20 |
| ZEN | Base Mainnet | `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` | OFT Adapter |
| ZEN | Horizen Mainnet | `0x57da2D504bf8b83Ef304759d9f2648522D7a9280` | OFT |
| tZEN | Base Sepolia | `0x107fdE93838e3404934877935993782F977324BB` | ERC-20 |
| tZEN | Base Sepolia | `0x2ead4B0beBD8e54F9B7cC1007DF4c44a27b9a339` | OFT Adapter |
| tZEN | Horizen Testnet | `0xb06EC4ce262D8dbDc24Fac87479A49A7DC4cFb87` | OFT |
| USDC | Base Mainnet | `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913` | ERC-20 |
| USDC | Base Mainnet | `0x27a16dc786820b16e5c9028b75b99f6f604b5d26` | Lock contract |
| USDC | Horizen Mainnet | `0xDF7108f8B10F9b9eC1aba01CCa057268cbf86B6c` | ERC-20 on Horizen |
| USDC | Horizen Mainnet | `0x3a1293Bdb83bBbDd5Ebf4fAc96605aD2021BbC0f` | OFT |
| cbBTC | Base Mainnet | `0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf` | ERC-20 |
| cbBTC | Base Mainnet | `0x68fb5BB8330C0b9d907F50f278143873276ee056` | OFT Adapter |
| cbBTC | Horizen Mainnet | `0x68fb5BB8330C0b9d907F50f278143873276ee056` | OFT |
| cbBTC | Base Sepolia | `0xcbb7c0006f23900c38eb856149f799620fcb8a4a` | ERC-20 |
| cbBTC | Base Sepolia | `0x5dE29d14E72feb79967596F3Ae57A9BfBA192769` | OFT Adapter |
| cbBTC | Horizen Testnet | `0x06DA6bDD2aB23447af5162ab0975edDA7E8d3747` | OFT |



## Chain Config (Viem)

Viem has first-class OP Stack support. Define both chains once — every code sample below uses these:

```typescript
import { defineChain } from "viem";
import { base, baseSepolia } from "viem/chains";

export const horizen = defineChain({
  id: 26514,
  name: "Horizen",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://horizen.calderachain.xyz/http"] },
    public:  { http: ["https://horizen.calderachain.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Horizen Explorer",
      url: "https://horizen.calderaexplorer.xyz/",
    },
  },
  sourceId: base.id, // Horizen settles on Base (L2)
});

export const horizenTestnet = defineChain({
  id: 2651420,
  name: "Horizen Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://horizen-testnet.rpc.caldera.xyz/http"] },
    public:  { http: ["https://horizen-testnet.rpc.caldera.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Horizen Testnet Explorer",
      url: "https://horizen-testnet.explorer.caldera.xyz/",
    },
  },
  sourceId: baseSepolia.id,
});
```

---

## Part 1 — OP Stack Native Bridge

### The Deposit Flow (Base → Horizen)

Deposits go through the `L2StandardBridge` on Base. The sequencer monitors Base for `TransactionDeposited` events and includes them in the next Horizen batch. No waiting — the deposit is reflected on Horizen within a few minutes.

The mechanics: when you call the bridge on Base, the calldata is included in the next batch submitted to Base's DA layer. Horizen's derivation pipeline fetches it, reconstructs the deposit transaction, and applies it to state. The user never has to do anything on the Horizen side.

**Programmatic ETH deposit using Viem:**

```typescript
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  type Account,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { publicActionsL1, walletActionsL1 } from "viem/op-stack";

// ⚠️ The L1StandardBridge address is specific to Horizen's OP Stack deployment.
// Retrieve it from: https://docs.horizen.io
// It is deployed on Base (acting as L1 relative to Horizen L3).
const HORIZEN_L1_BRIDGE = "0x<L1StandardBridge_on_Base>"; // fetch from docs

const account: Account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
}).extend(publicActionsL1());

const baseWalletClient = createWalletClient({
  chain: base,
  transport: http(),
  account,
}).extend(walletActionsL1());

async function depositEth(amountEth: string, recipient: `0x${string}`) {
  const amount = parseEther(amountEth);

  // Estimate L2 gas for the deposit transaction
  const gas = await basePublicClient.estimateDepositTransactionGas({
    account,
    to: recipient,
    value: amount,
    targetChain: horizen, // your defineChain config
  });

  const hash = await baseWalletClient.depositTransaction({
    to: recipient,
    value: amount,
    gas,
    targetChain: horizen,
  });

  console.log(`Deposit submitted on Base: ${hash}`);
  console.log(`Watch on Base explorer: https://basescan.org/tx/${hash}`);

  // Wait for Base confirmation
  const receipt = await basePublicClient.waitForTransactionReceipt({ hash });
  console.log(`Confirmed in Base block ${receipt.blockNumber}`);
  console.log("Deposit will appear on Horizen within a few minutes.");
}
```

> **`depositTransaction` vs the Standard Bridge:** `depositTransaction` calls `OptimismPortal.depositTransaction` directly, which is lower-level and works for ETH. For ERC-20 deposits, use the `L2StandardBridge` interface which handles the token lock/mint pattern. The bridge contract address must be retrieved from official Horizen deployment docs — it's deployed on Base and specific to Horizen's rollup configuration.

---

### The Withdrawal Lifecycle (Horizen → Base)

This is where OP Stack gets interesting — and where most developers underestimate the complexity.

A withdrawal is **a three-transaction, three-party process that spans 7 days**. The timeline:

```
Day 0   [Horizen] initiate withdrawal → withdrawal hash included in state
        ↓
        Proposer submits Horizen state root to L2OutputOracle on Base
        ↓
Day 0+  [Base] proveWithdrawalTransaction → anchors the withdrawal to a finalized output
        ↓
        7-day challenge window opens
        ↓
Day 7+  [Base] finalizeWithdrawalTransaction → funds released via OptimismPortal
```

Neither Step 2 nor Step 3 happens automatically. **Your application or user must return to Base and submit these transactions.** This is not a flaw — it's the fault-proof security model working as designed. Any party can challenge an invalid state root during the 7-day window.

**Step 1: Initiate the withdrawal on Horizen**

```typescript
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { walletActionsL2 } from "viem/op-stack";
import { horizen } from "./chains"; // your defineChain config

const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

const horizenWalletClient = createWalletClient({
  chain: horizen,
  transport: http("https://horizen.calderachain.xyz/http"),
  account,
}).extend(walletActionsL2());

async function initiateWithdrawal(amountEth: string, recipient: `0x${string}`) {
  const hash = await horizenWalletClient.initiateWithdrawal({
    account,
    to: recipient,
    value: parseEther(amountEth),
  });

  console.log(`Withdrawal initiated on Horizen: ${hash}`);
  console.log(`Explorer: https://horizen.calderaexplorer.xyz/tx/${hash}`);

  // Save this hash — you need it for the prove step on Base (7+ days later)
  return hash;
}
```

**Step 2: Prove the withdrawal on Base (after state root is proposed)**

You can only prove after the Proposer has submitted a state root to Base's `L2OutputOracle` that includes your withdrawal transaction. Viem handles the Merkle proof construction:

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { publicActionsL2, walletActionsL1 } from "viem/op-stack";
import { horizen } from "./chains";

const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const horizenPublicClient = createPublicClient({
  chain: horizen,
  transport: http("https://horizen.calderachain.xyz/http"),
}).extend(publicActionsL2());

const baseWalletClient = createWalletClient({
  chain: base,
  transport: http(),
  account,
}).extend(walletActionsL1());

async function proveWithdrawal(withdrawalTxHash: `0x${string}`) {
  // Fetch the withdrawal receipt from Horizen
  const receipt = await horizenPublicClient.getTransactionReceipt({
    hash: withdrawalTxHash,
  });

  // Build the withdrawal proof (Merkle inclusion proof against the output root)
  const { output, withdrawal } = await horizenPublicClient.getWithdrawal({
    hash: withdrawalTxHash,
  });

  const proveHash = await baseWalletClient.proveWithdrawal({
    output,
    withdrawal,
    targetChain: horizen,
  });

  console.log(`Withdrawal proved on Base: ${proveHash}`);
  console.log("Wait 7 days, then call finalizeWithdrawal.");
  return proveHash;
}
```

**Step 3: Finalize the withdrawal on Base (after the 7-day window)**

```typescript
async function finalizeWithdrawal(withdrawalTxHash: `0x${string}`) {
  // Check that the withdrawal is ready to finalize
  const status = await horizenPublicClient.getWithdrawalStatus({
    hash: withdrawalTxHash,
    targetChain: horizen,
    chain: base,
  });

  // Possible statuses: "waiting-to-prove" | "ready-to-prove" |
  //                    "waiting-period" | "ready-to-finalize" | "finalized"
  console.log(`Current status: ${status}`);

  if (status !== "ready-to-finalize") {
    console.log("Not yet ready. Check back after the challenge window.");
    return;
  }

  const { withdrawal } = await horizenPublicClient.getWithdrawal({
    hash: withdrawalTxHash,
  });

  const finalHash = await baseWalletClient.finalizeWithdrawal({
    withdrawal,
    targetChain: horizen,
  });

  console.log(`Withdrawal finalized: ${finalHash}`);
  console.log("Funds are now on Base.");
}
```

**Polling withdrawal status in a frontend:**

```typescript
// Poll every 60 seconds until ready to finalize
async function pollUntilFinalizable(withdrawalTxHash: `0x${string}`) {
  while (true) {
    const status = await horizenPublicClient.getWithdrawalStatus({
      hash: withdrawalTxHash,
      targetChain: horizen,
      chain: base,
    });

    console.log(`[${new Date().toISOString()}] Status: ${status}`);

    if (status === "ready-to-finalize") break;
    if (status === "finalized") {
      console.log("Already finalized.");
      break;
    }

    await new Promise((r) => setTimeout(r, 60_000));
  }
}
```

The status progression is linear: `waiting-to-prove` → `ready-to-prove` → `waiting-period` → `ready-to-finalize` → `finalized`. Store the withdrawal tx hash in your database — users need to return days later, and you need to be able to resume the flow.

---

## Part 2 — LayerZero OFT (ZEN, USDC, cbBTC)

ZEN, USDC, and cbBTC use LayerZero's OFT standard for cross-chain transfers. The mechanics differ from the OP Stack bridge: there are no waiting periods, no prove/finalize steps. A message is sent on the source chain, relayed by LayerZero's DVN network, and executed on the destination chain. Settlement is typically seconds.

The OFT Adapter pattern means ZEN's OFT Adapter on Base (`0x57da2D504bf8b83Ef304759d9f2648522D7a9280`) and ZEN's OFT on Horizen share the same address — the contract is omnichain-aware and handles both lock/burn and mint/release depending on which chain it's called from.

### Install dependencies

```bash
npm install ethers @layerzerolabs/lz-v2-utilities
```

### Step 1 — Approve the OFT Adapter (ERC-20 tokens only)

The OFT Adapter calls `transferFrom` on the underlying ERC-20, so approval is required before `send()`. This is a one-time approval per session (or set to `MaxUint256` for a standing approval):

```typescript
import { ethers } from "ethers";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

const BASE_RPC = "https://mainnet.base.org";

// ZEN on Base Mainnet
const ZEN_ERC20   = "0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229";
const ZEN_ADAPTER = "0x57da2D504bf8b83Ef304759d9f2648522D7a9280";

async function approveOftAdapter(
  privateKey: string,
  amountWei: bigint
) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const signer   = new ethers.Wallet(privateKey, provider);
  const zen      = new ethers.Contract(ZEN_ERC20, ERC20_ABI, signer);

  const current = await zen.allowance(signer.address, ZEN_ADAPTER);
  if (current >= amountWei) {
    console.log("Allowance sufficient, skipping approve.");
    return;
  }

  const tx = await zen.approve(ZEN_ADAPTER, amountWei);
  await tx.wait();
  console.log(`Approved ${ethers.formatEther(amountWei)} ZEN to OFT Adapter`);
}
```

### Step 2 — Quote the LayerZero fee

LayerZero charges a small native fee (in ETH on Base) for message delivery. Always quote immediately before sending — don't cache it:

```typescript
// LayerZero V2 OFT — minimal ABI for send + quote
const OFT_ABI = [
  `function quoteSend(
    (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD,
     bytes extraOptions, bytes composeMsg, bytes oftCmd) sendParam,
    bool payInLzToken
  ) external view returns ((uint256 nativeFee, uint256 lzTokenFee) msgFee)`,

  `function send(
    (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD,
     bytes extraOptions, bytes composeMsg, bytes oftCmd) sendParam,
    (uint256 nativeFee, uint256 lzTokenFee) fee,
    address refundAddress
  ) external payable returns (
    (bytes32 guid, uint64 nonce, (uint256 nativeFee, uint256 lzTokenFee) fee) msgReceipt,
    (uint256 amountSentLD, uint256 amountReceivedLD) oftReceipt
  )`,
];

// ⚠️ LayerZero endpoint IDs are NOT EVM chain IDs.
// Look up the correct values at:
// https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
// The EVM chain IDs for reference (do NOT use as LZ endpoint IDs):
//   Base Mainnet:    8453
//   Horizen Mainnet: 26514
const HORIZEN_LZ_EID = 0; // PLACEHOLDER — replace with the actual endpoint ID

async function quoteOftSend(
  signer: ethers.Signer,
  recipientAddress: string,
  amountWei: bigint
) {
  const oft = new ethers.Contract(ZEN_ADAPTER, OFT_ABI, signer);

  const sendParam = {
    dstEid:       HORIZEN_LZ_EID,
    to:           ethers.zeroPadValue(recipientAddress, 32), // bytes32
    amountLD:     amountWei,
    minAmountLD:  (amountWei * 995n) / 1000n, // 0.5% slippage
    extraOptions: "0x",
    composeMsg:   "0x",
    oftCmd:       "0x",
  };

  const [msgFee] = await oft.quoteSend(sendParam, false);
  return { sendParam, msgFee };
}
```

### Step 3 — Send

```typescript
async function sendZenToHorizen(
  privateKey: string,
  recipientAddress: string,
  amountWei: bigint
) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const signer   = new ethers.Wallet(privateKey, provider);
  const oft      = new ethers.Contract(ZEN_ADAPTER, OFT_ABI, signer);

  // 1. Approve
  await approveOftAdapter(privateKey, amountWei);

  // 2. Quote
  const { sendParam, msgFee } = await quoteOftSend(signer, recipientAddress, amountWei);
  console.log(`LZ native fee: ${ethers.formatEther(msgFee.nativeFee)} ETH`);

  // 3. Send — the nativeFee is paid as msg.value
  const tx = await oft.send(
    sendParam,
    { nativeFee: msgFee.nativeFee, lzTokenFee: 0n },
    signer.address, // excess fee refund address
    { value: msgFee.nativeFee }
  );

  console.log(`Send tx (Base): ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);
  console.log(`Track cross-chain: https://layerzeroscan.com/tx/${tx.hash}`);
}
```

### Listening for the OFT receipt on Horizen

The destination OFT contract emits `OFTReceived` when tokens arrive. Listen for it on Horizen:

```typescript
const OFT_RECEIVED_ABI = [
  "event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)",
];

const horizenProvider = new ethers.JsonRpcProvider(
  "https://horizen.calderachain.xyz/http"
);
const ZEN_OFT_HORIZEN = "0x57da2D504bf8b83Ef304759d9f2648522D7a9280";

const oft = new ethers.Contract(ZEN_OFT_HORIZEN, OFT_RECEIVED_ABI, horizenProvider);

// One-time listener
oft.once("OFTReceived", (guid, srcEid, toAddress, amountReceived) => {
  console.log(`ZEN arrived on Horizen:`);
  console.log(`  GUID:     ${guid}`);
  console.log(`  To:       ${toAddress}`);
  console.log(`  Amount:   ${ethers.formatEther(amountReceived)} ZEN`);
});
```

---

## Part 3 — What About Custom ERC-20 Tokens?

If you deployed your own ERC-20 on Horizen and want to bridge it programmatically:

**OP Stack native bridge** works out of the box for any ERC-20, but requires a matching token contract on Base that implements the `IOptimismMintableERC20` interface. The standard bridge mints on the destination and burns/locks on the source. You'd need to deploy and register a paired token on Base.

**LayerZero OFT** lets you make any ERC-20 omnichain by wrapping it in an OFT contract. Deploy an `OFT` (if deploying fresh) or `OFTAdapter` (if wrapping an existing token) on both chains. See the [LayerZero OFT Quickstart](https://docs.layerzero.network/v2/developers/evm/oft/quickstart).

Neither path is trivial. For a new project, design it as an OFT from day one rather than retrofitting.

---

## Finality Reference

| Bridge Path | Deposit (→ Horizen) | Withdrawal (→ Base) |
|---|---|---|
| OP Stack Native | ~2–5 min (sequencer inclusion) | 7 days (challenge window) + prove + finalize |
| Stargate V2 / LZ OFT | Seconds (LZ message relay) | Seconds (LZ message relay) |

The 7-day window is not configurable by applications — it is the OP Stack's core security parameter. Plan your UX accordingly. If your application cannot impose a 7-day withdrawal wait on users, route through LayerZero OFT.
