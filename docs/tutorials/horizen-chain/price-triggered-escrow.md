---
title: Build a Price-Triggered ETH Escrow
description: Deploy a Stork-powered escrow contract on Horizen that releases ETH when ETH/USD crosses a threshold, then wire it to a Next.js frontend.
sidebar_position: 3
---

# Build a Price-Triggered ETH Escrow

Horizen is an OP Stack L3 with a near-vanilla EVM - any Solidity pattern that works on Ethereum mainnet works here. This tutorial builds **TriggerVault**: an escrow contract that locks ETH and releases it to a recipient when ETH/USD crosses a price threshold, using the Stork pull oracle for on-chain price data.

You'll write the contract, test it against a mock oracle, deploy it to testnet, and build a server-side-safe Next.js frontend with Wagmi.


## Architecture Context

Two concepts govern this dApp's design.

**Pull oracle model.** Stork does not push prices on-chain automatically. Instead, callers fetch a signed price payload from the Stork REST API off-chain and include it as calldata in the transaction that needs the price. The contract passes that payload to `stork.updateTemporalNumericValuesV1()`, which verifies the publisher's ECDSA signature and writes the price. The contract then reads it back with `stork.getTemporalNumericValueV1()`. This means anyone — not just the depositor — can trigger the release, because anyone can fetch a fresh price and submit it.

**Fee model.** Horizen L3 has two fee components:

- **L2 execution fee** — gas used × base fee
- **L1 data fee** — calldata batch cost, appended automatically by the OP Stack

The Stork oracle itself also charges a small per-update fee (`singleUpdateFeeInWei`, query `getUpdateFeeV1` at runtime). On testnet this is 1 wei. Your `triggerCheck` call must forward at least that amount via `msg.value`.

<div style={{padding: '24px 0', display: 'flex', justifyContent: 'center'}}>
  <img src="/tutorials/price_trigger_escrow_architecture.png" alt="TriggerVault architecture: off-chain Stork API → on-chain price update → escrow condition check → ETH release" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>


## Network Reference

For RPC endpoints, chain IDs, explorer, and faucet:

- [Testnet Configuration](/horizen-chain/network/testnet)
- [Mainnet Configuration](/horizen-chain/network/mainnet)



## Step 1: Define the Stork Interface

Stork's on-chain contract is already deployed on Horizen testnet at `0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62`. Define its interface inline — no package required.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStork {
    struct TemporalNumericValue {
        uint64 timestampNs;
        int192 quantizedValue; // price scaled by 1e18
    }

    struct TemporalNumericValueInput {
        TemporalNumericValue temporalNumericValue;
        bytes32 id;
        bytes32 publisherMerkleRoot;
        bytes32 valueComputeAlgHash;
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    function updateTemporalNumericValuesV1(
        TemporalNumericValueInput[] calldata updateData
    ) external payable;

    function getUpdateFeeV1(
        TemporalNumericValueInput[] calldata updateData
    ) external view returns (uint256 feeAmount);

    function getTemporalNumericValueV1(bytes32 id)
        external view returns (TemporalNumericValue memory value);
}
```

Key facts about the Stork data model:

- `quantizedValue` is `int192` scaled to 18 decimals — $3,500 is `3500e18`.
- `timestampNs` is a nanosecond Unix timestamp (`uint64`). It's a 19-digit integer that **exceeds float64 precision**. See [Step 5](#step-5-server-side-price-proxy) for why this matters in JavaScript.
- The ETH/USD asset ID on all networks: `0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160`



## Step 2: Write the Contract

```solidity
// src/TriggerVault.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TriggerVault {
    bytes32 public constant ETH_USD_ID =
        0x59102b37de83bdda9f38ac8254e596f0d9ac61d2035c07936675e87342817160;

    IStork public immutable stork;

    enum Direction { Above, Below }

    struct Escrow {
        address depositor;
        address recipient;
        uint256 amount;
        int256 targetPrice; // USD, 18 decimals
        Direction direction;
        bool active;
    }

    uint256 public nextId;
    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 indexed id, address indexed depositor,
        address indexed recipient, uint256 amount, int256 targetPrice, Direction direction);
    event EscrowReleased(uint256 indexed id, address indexed recipient,
        uint256 amount, int256 triggerPrice);
    event EscrowCancelled(uint256 indexed id, address indexed depositor, uint256 amount);

    error NotDepositor();
    error EscrowNotActive();
    error ConditionNotMet();
    error TransferFailed();
    error ZeroAmount();
    error ZeroAddress();

    constructor(address _stork) {
        stork = IStork(_stork);
    }

    function createEscrow(
        address recipient,
        int256 targetPrice,
        Direction direction
    ) external payable returns (uint256 id) {
        if (msg.value == 0) revert ZeroAmount();
        if (recipient == address(0)) revert ZeroAddress();

        id = nextId++;
        escrows[id] = Escrow({
            depositor: msg.sender,
            recipient: recipient,
            amount: msg.value,
            targetPrice: targetPrice,
            direction: direction,
            active: true
        });

        emit EscrowCreated(id, msg.sender, recipient, msg.value, targetPrice, direction);
    }

    /// @notice Push a fresh Stork price on-chain and release ETH if the condition is met.
    /// @param updateData Signed payload from GET /v1/prices/latest?assets=ETHUSD
    /// @dev msg.value must cover the Stork update fee (query getUpdateFeeV1; 1 wei on testnet).
    function triggerCheck(
        uint256 id,
        IStork.TemporalNumericValueInput[] calldata updateData
    ) external payable {
        Escrow storage e = escrows[id];
        if (!e.active) revert EscrowNotActive();

        stork.updateTemporalNumericValuesV1{value: msg.value}(updateData);

        IStork.TemporalNumericValue memory tv = stork.getTemporalNumericValueV1(ETH_USD_ID);
        int256 currentPrice = int256(tv.quantizedValue);

        bool conditionMet = e.direction == Direction.Above
            ? currentPrice >= e.targetPrice
            : currentPrice <= e.targetPrice;

        if (!conditionMet) revert ConditionNotMet();

        e.active = false;
        uint256 amount = e.amount;
        emit EscrowReleased(id, e.recipient, amount, currentPrice);

        (bool ok,) = e.recipient.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function cancelEscrow(uint256 id) external {
        Escrow storage e = escrows[id];
        if (!e.active) revert EscrowNotActive();
        if (e.depositor != msg.sender) revert NotDepositor();

        e.active = false;
        uint256 amount = e.amount;
        emit EscrowCancelled(id, msg.sender, amount);

        (bool ok,) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function getEscrowsByDepositor(address depositor)
        external view returns (uint256[] memory ids)
    {
        uint256 count;
        for (uint256 i = 0; i < nextId; i++) {
            if (escrows[i].depositor == depositor) count++;
        }
        ids = new uint256[](count);
        uint256 j;
        for (uint256 i = 0; i < nextId; i++) {
            if (escrows[i].depositor == depositor) ids[j++] = i;
        }
    }
}
```

<div style={{padding: '24px 0', display: 'flex', justifyContent: 'center'}}>
  <img src="/tutorials/deposit_sequence.png" alt="Deposit sequence: depositor calls createEscrow → anyone calls triggerCheck with fresh Stork price → vault verifies condition → ETH transferred to recipient" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

Design decisions worth noting:

- `triggerCheck` is **permissionless** — any account can call it. ETH always goes to `e.recipient`, not to the caller, so there's no griefing risk from third-party triggering.
- `msg.value` is forwarded directly to `updateTemporalNumericValuesV1`. Do not hardcode 0 — the Stork fee is a runtime value and may change.
- ETH transfer uses a low-level `call` rather than `transfer` to avoid gas-limit issues with contract recipients.



## Step 3: Test Locally with MockStork

Foundry tests should never hit a live oracle. Use a minimal mock that implements the same interface.

```solidity
// test/TriggerVault.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TriggerVault, IStork} from "../src/TriggerVault.sol";

contract MockStork {
    int192 public price;

    function setPrice(int192 _price) external { price = _price; }

    function updateTemporalNumericValuesV1(
        IStork.TemporalNumericValueInput[] calldata
    ) external payable {}

    function getUpdateFeeV1(
        IStork.TemporalNumericValueInput[] calldata
    ) external pure returns (uint256) { return 0; }

    function getTemporalNumericValueV1(bytes32)
        external view returns (IStork.TemporalNumericValue memory)
    {
        return IStork.TemporalNumericValue({
            timestampNs: uint64(block.timestamp * 1e9),
            quantizedValue: price
        });
    }
}

contract TriggerVaultTest is Test {
    TriggerVault vault;
    MockStork stork;

    address depositor = makeAddr("depositor");
    address recipient = makeAddr("recipient");
    int256 constant TARGET = 3500e18;

    function setUp() public {
        stork = new MockStork();
        vault = new TriggerVault(address(stork));
        vm.deal(depositor, 10 ether);
    }

    function test_triggerReleasesWhenConditionMet() public {
        vm.prank(depositor);
        uint256 id = vault.createEscrow{value: 1 ether}(
            recipient, TARGET, TriggerVault.Direction.Above
        );

        stork.setPrice(int192(3600e18));
        vault.triggerCheck(id, new IStork.TemporalNumericValueInput[](0));

        (,,,,,bool active) = vault.escrows(id);
        assertFalse(active);
        assertEq(recipient.balance, 1 ether);
    }

    function test_triggerRevertsWhenConditionNotMet() public {
        vm.prank(depositor);
        uint256 id = vault.createEscrow{value: 1 ether}(
            recipient, TARGET, TriggerVault.Direction.Above
        );

        stork.setPrice(int192(3000e18));
        vm.expectRevert(TriggerVault.ConditionNotMet.selector);
        vault.triggerCheck(id, new IStork.TemporalNumericValueInput[](0));
    }

    function test_cancelReturnsETH() public {
        vm.prank(depositor);
        uint256 id = vault.createEscrow{value: 1 ether}(recipient, TARGET, TriggerVault.Direction.Above);

        vm.prank(depositor);
        vault.cancelEscrow(id);

        assertEq(depositor.balance, 10 ether);
    }

    function test_cancelRevertsForNonDepositor() public {
        vm.prank(depositor);
        uint256 id = vault.createEscrow{value: 1 ether}(recipient, TARGET, TriggerVault.Direction.Above);

        vm.expectRevert(TriggerVault.NotDepositor.selector);
        vault.cancelEscrow(id);
    }
}
```

Run the suite:

```bash
forge test -vvv
```

Don't deploy until all tests pass. Gas costs ETH on testnet; a broken oracle integration costs more.



## Step 4: Deploy

Write a deploy script so private keys never appear on the command line.

```solidity
// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TriggerVault} from "../src/TriggerVault.sol";

contract DeployScript is Script {
    // Stork oracle on Horizen testnet
    address constant STORK = 0xacC0a0cF13571d30B4b8637996F5D6D774d4fd62;

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        TriggerVault vault = new TriggerVault(STORK);
        console.log("TriggerVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
```

Add the Horizen testnet RPC alias to `foundry.toml`:

```toml
[rpc_endpoints]
horizen_testnet = "https://horizen-testnet.rpc.caldera.xyz/http"
```

Deploy:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url horizen_testnet \
  --broadcast \
  --private-key $PRIVATE_KEY
```

Save the printed address — you'll set it as `NEXT_PUBLIC_CONTRACT_ADDRESS` in your frontend.



## Step 5: Server-Side Price Proxy

The Stork REST API requires an API key. Never expose it client-side. Use a Next.js API route as a server-side proxy.

```typescript
// app/api/stork-price/route.ts
import { NextResponse } from "next/server";

const STORK_API = "https://rest.jp.stork-oracle.network/v1/prices/latest";
const ETH_USD_ASSET = "ETHUSD";

export async function GET() {
  const apiKey = process.env.STORK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "STORK_API_KEY not set" }, { status: 500 });
  }

  const res = await fetch(`${STORK_API}?assets=${ETH_USD_ASSET}`, {
    headers: { Authorization: `Basic ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Stork API error: ${res.status}` }, { status: res.status });
  }

  // IMPORTANT: use res.text() + regex, not res.json().
  // timestampNs is a 19-digit integer. JavaScript's JSON.parse converts it to
  // float64, silently rounding it by up to 215ns. The Stork oracle's ECDSA
  // signature is computed over the exact integer — a rounded value produces
  // a hash mismatch and the oracle reverts with InvalidSignature (0x8baa579f).
  const rawText = await res.text();
  const safeText = rawText.replace(/:(\s*)(-?\d{16,})([,}\]])/g, `:$1"$2"$3`);
  const body = JSON.parse(safeText);

  const entry = body?.data?.[ETH_USD_ASSET];
  if (!entry) {
    return NextResponse.json({ error: "No ETHUSD data in response" }, { status: 502 });
  }

  const sp = entry.stork_signed_price;

  const updateData = [{
    temporalNumericValue: {
      timestampNs: sp.timestamped_signature.timestamp,   // string — preserved precision
      quantizedValue: sp.price,                          // string — preserved precision
    },
    id: sp.encoded_asset_id as `0x${string}`,
    publisherMerkleRoot: sp.publisher_merkle_root as `0x${string}`,
    valueComputeAlgHash: (sp.calculation_alg.checksum.startsWith("0x")
      ? sp.calculation_alg.checksum
      : `0x${sp.calculation_alg.checksum}`) as `0x${string}`,
    r: sp.timestamped_signature.signature.r as `0x${string}`,
    s: sp.timestamped_signature.signature.s as `0x${string}`,
    v: Number(sp.timestamped_signature.signature.v),
  }];

  return NextResponse.json({ updateData });
}
```

The precision requirement is non-negotiable: `timestampNs` and `quantizedValue` must survive JSON serialisation as strings and be converted to `BigInt` on the frontend. Passing rounded integers into `updateTemporalNumericValuesV1` causes `InvalidSignature` — the oracle hashes the exact values before recovering the publisher's signing address.

<div style={{padding: '24px 0', display: 'flex', justifyContent: 'center'}}>
  <img src="/tutorials/price_fetch_sequence.png" alt="Price fetch sequence: frontend requests /api/stork-price → Next.js server fetches Stork REST API → returns updateData with string-preserved BigInt fields" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>


## Step 6: Frontend Integration

### Reading escrows (Wagmi)

```typescript
import { useReadContract } from "wagmi";
import { triggerVaultAbi } from "@/lib/abi";
import { TRIGGER_VAULT_ADDRESS } from "@/lib/contract";

const { data: escrowIds } = useReadContract({
  address: TRIGGER_VAULT_ADDRESS,
  abi: triggerVaultAbi,
  functionName: "getEscrowsByDepositor",
  args: [address],
});
```

### Triggering an escrow

Fetch the signed price, simulate the call to surface revert reasons early, then send it.

```typescript
import { useWriteContract, usePublicClient } from "wagmi";

const { writeContractAsync } = useWriteContract();
const publicClient = usePublicClient();

async function handleTrigger(escrowId: bigint) {
  const res = await fetch("/api/stork-price");
  const { updateData } = await res.json();

  // Convert string fields to BigInt before passing to viem
  const updateDataTyped = updateData.map((d: UpdateDataRaw) => ({
    ...d,
    temporalNumericValue: {
      timestampNs: BigInt(d.temporalNumericValue.timestampNs),
      quantizedValue: BigInt(d.temporalNumericValue.quantizedValue),
    },
  }));

  const callParams = {
    address: TRIGGER_VAULT_ADDRESS,
    abi: triggerVaultAbi,
    functionName: "triggerCheck" as const,
    args: [escrowId, updateDataTyped] as const,
    value: 1n, // Stork oracle fee on testnet: 1 wei
  };

  // Simulate first — surfaces ConditionNotMet, InvalidSignature, InsufficientFee
  // as readable errors before the wallet popup
  if (publicClient) {
    await publicClient.simulateContract({ ...callParams, account: address });
  }

  await writeContractAsync(callParams);
}
```

<div style={{padding: '24px 0', display: 'flex', justifyContent: 'center'}}>
  <img src="/tutorials/onchain_trigger_sequence.png" alt="On-chain trigger sequence: frontend fetches price proxy → converts BigInt fields → simulateContract → writeContractAsync → vault verifies Stork signature → releases ETH" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

Three things to get right in the trigger call:

- **`value: 1n`** — must forward at least `getUpdateFeeV1()` wei to the Stork oracle. Passing 0 reverts with `InsufficientFee (0x025dbdd4)`.
- **BigInt conversion** — `timestampNs` and `quantizedValue` come back from the API route as strings. Convert them with `BigInt()` before passing to viem; viem encodes them as `uint64` and `int192` respectively.
- **`simulateContract` before `writeContractAsync`** — catches `ConditionNotMet` and oracle errors before the wallet confirmation dialog, giving the user a readable error instead of a failed transaction.

### ABI reference

`triggerCheck` takes a `tuple[]` (struct array), not `bytes`. Your ABI entry must match exactly:

```typescript
{
  name: "triggerCheck",
  type: "function",
  inputs: [
    { name: "id", type: "uint256" },
    {
      name: "updateData",
      type: "tuple[]",
      components: [
        {
          name: "temporalNumericValue",
          type: "tuple",
          components: [
            { name: "timestampNs", type: "uint64" },
            { name: "quantizedValue", type: "int192" },
          ],
        },
        { name: "id", type: "bytes32" },
        { name: "publisherMerkleRoot", type: "bytes32" },
        { name: "valueComputeAlgHash", type: "bytes32" },
        { name: "r", type: "bytes32" },
        { name: "s", type: "bytes32" },
        { name: "v", type: "uint8" },
      ],
    },
  ],
  outputs: [],
  stateMutability: "payable",
}
```



## Step 7: Verify on the Explorer

```bash
forge verify-contract $DEPLOYED_ADDRESS src/TriggerVault.sol:TriggerVault \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --constructor-args $(cast abi-encode "constructor(address)" $STORK_ADDRESS)
```

Horizen's explorer is powered by Blockscout. If verification doesn't auto-detect the verifier, it accepts any non-empty API key; add a `customChains` entry to your Hardhat config if using that path.



## Interacting On-Chain (cast)

```bash
# Read the current Stork price stored in the contract
cast call $VAULT "getPrice()(int256)" \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http

# Read a specific escrow
cast call $VAULT "escrows(uint256)((address,address,uint256,int256,uint8,bool))" 0 \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http

# Cancel an escrow (depositor only)
cast send $VAULT "cancelEscrow(uint256)" 0 \
  --rpc-url https://horizen-testnet.rpc.caldera.xyz/http \
  --private-key $PRIVATE_KEY
```


## Event Indexing

<div style={{padding: '24px 0', display: 'flex', justifyContent: 'center'}}>
  <img src="/tutorials/cancel_and_indexing_sequence.png" alt="Cancel and indexing sequence: depositor calls cancelEscrow → vault refunds ETH and emits EscrowCancelled → indexer picks up all three events" style={{maxWidth: '100%', width: '720px', borderRadius: '8px'}} />
</div>

The contract emits three events suitable for indexing with Goldsky or any subgraph-compatible pipeline:

| Event | Fields |
|---|---|
| `EscrowCreated` | `id`, `depositor`, `recipient`, `amount`, `targetPrice`, `direction` |
| `EscrowReleased` | `id`, `recipient`, `amount`, `triggerPrice` |
| `EscrowCancelled` | `id`, `depositor`, `amount` |

All three are indexed with `id` as the primary key, making historical queries efficient without a full table scan.
