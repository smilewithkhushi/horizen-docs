---
title: Mainnet Claim Instructions
sidebar_position: 3
---

# Mainnet Claim Instructions

This guide walks you through the process of claiming your ZEND mainchain ZEN tokens on Base. The process has two steps: signing a message with your old ZEND private key, then submitting the claim.

## Who Needs to Claim

Only users with ZEN balances on the **old ZEND Mainchain** need to follow this process. If your funds were on EON, they were automatically migrated to the same address on Base.

## Step 1: Sign a Message

You need to generate a signature using the following message format:

```
ZENCLAIM<destinationAddress>
```

For example:

```
ZENCLAIM0x1B9aCc8d2c9e20aC2e78904e6f123f2D22Dd2A8w
```

There is no space between `ZENCLAIM` and the address. The destination address must be in EIP-55 hex format with the `0x` prefix.

Choose one of the following tools to generate your signature:

### Option A: Sphere Wallet

Use [Sphere Testnet](https://github.com/HorizenOfficial/Sphere_by_Horizen_Testnet/releases/tag/desktop-v1.13.0-testnet) if you have your seed phrase.

1. Open Sphere and import your seed phrase (if not already imported).
2. Verify that your wallet addresses and balances are correct.
3. Click the signature icon in your wallet and enter the message: `ZENCLAIM` followed by your destination address.
4. Click **Create Signature** and copy the result.

### Option B: Ledger Hardware Wallet

Use the [Ledger Signing Tool](https://github.com/HorizenOfficial/horizen-migration-ledger-signing-tool/releases/latest) if your funds are on a Ledger device.

For security, download the tool and run it offline by opening `index.html` locally.

**Prerequisites:**
- Install both the Bitcoin and Horizen apps on your Ledger device.
- Horizen app version must be v2.4.1 or higher.

**Steps:**

1. Connect your Ledger and open the Horizen app. The screen should display "Application is ready".
2. Open the Ledger Signing Tool and click **Connect**.
3. Enter your destination EVM address. The "Message to Sign" field will auto-populate.
4. Enter the derivation path for the ZEN address you are claiming from.

**Finding your derivation path:**

Open Ledger Live, go to your Horizen account, click **Edit Account > Advanced**, and note the `freshAddressPath`. Horizen uses the format:

```
m / 44' / 121' / account' / change / address_index
```

Where `change` is `0` for receiving addresses and `1` for change addresses.

The `freshAddressPath` shows the next unused address. To find your last used address, subtract 1 from the `address_index`.

**Important:** Check all possible addresses to ensure no funds are left behind. Scan backwards from the `freshAddressPath`, checking each `address_index` for both `change = 0` and `change = 1`. Paste each derived ZEN address into the [Horizen Explorer](https://explorer.horizen.io/) to verify balances.

5. Click **Sign Message** and confirm on your Ledger device. Copy the generated signature.

### Option C: Private Key Signing Tool

Use the [Private Key Signing Tool](https://github.com/HorizenOfficial/horizen-migration-signing-tool-private-key/releases/latest) if you have direct access to your private key.

For security, download the tool and run it offline by opening `index.html` locally.

If you only have a seed phrase, derive your private key using [Ian Coleman's BIP39 tool](https://github.com/iancoleman/bip39/releases/tag/0.5.6) (download and use offline, select "ZEN - Horizen" as the coin).

1. Enter your private key and confirm the ZEN address is correct.
2. Enter the destination EVM address. The "Message to Sign" will auto-populate.
3. Click **Sign Message** to generate and copy the signature.

### Option D: CLI Tool

The [CLI tool](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZENCLAIM) provides command-line signing and claiming:

```bash
# Sign a message with a ZEN private key
signmessage

# Verify a signed message against a ZEN address
verifymessage
```

Refer to the [GitHub README](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZENCLAIM) for detailed usage.

## Step 2: Submit the Claim

Once you have a valid signature, submit your claim using one of the following methods.

### Option A: Claim Page (Web Interface)

Use the official claim page at: [https://horizen.io/zenclaim](https://horizen.io/zenclaim)

1. **Connect your wallet** — Click Connect Wallet and choose your provider (e.g., MetaMask). Make sure you are connected to **Base Mainnet**.

   If Base Mainnet is not configured in your wallet, add it manually:

   ```
   Network Name: Base Mainnet
   RPC URL: https://mainnet.base.org
   Chain ID: 8453
   Symbol: ETH
   Block Explorer URL: https://basescan.org
   ```

2. **Import the ZEN token** — Under the Tokens tab in your wallet, select "Import Tokens" and enter:

   ```
   Contract: 0xf43eB8De897Fbc7F2502483B2Bef7Bb9EA179229
   Symbol: ZEN
   ```

3. **Enter your ZEN address** — Input your Horizen transparent address (e.g., from Sphere). The interface will display your available balance. Click **Next**.

4. **Paste your signature and destination address** — Enter the signed message from Step 1 and the destination address where you want to receive ZEN. This should not be an exchange deposit address.

5. **Submit the claim** — Click **Claim** to initiate the transfer.

### Option B: CLI Tool

The CLI tool also supports submitting claims directly:

```bash
# Claim from a transparent ZEN address
claimzenaddress

# Claim from a multisignature ZEN address
claimzenmultisigaddress
```

Refer to the [GitHub README](https://github.com/HorizenOfficial/horizen-migration-cli/tree/1.0.0-ZENCLAIM) for detailed usage and parameters.
