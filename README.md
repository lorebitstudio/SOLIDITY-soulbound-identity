# Soulbound Identity Suite – Smart Contract Suite (Developed by Lorebit Studio)

This repository contains a suite of **on-chain identity & reputation smart contracts** developed by **Lorebit Studio** to demonstrate a transparent, non-transferable achievement and reputation system deployed on **Base Sepolia**.

---

## 🎮 Project Overview

This project showcases a robust, fully on-chain identity system using soulbound (non-transferable) NFTs and ERC20 tokens to track user achievements and reputation.

It includes contracts for:

* Awarding **achievements as NFTs** for key milestones.
* Awarding **reputation points as soulbound ERC20 tokens**.
* Preventing transfers of both NFTs & reputation points (soulbound).
* Managing user registration and automatically awarding registration achievements.

---

## 👨‍💻 Lorebit Studio's Role

Lorebit Studio developed all smart contracts, deployment scripts, verification scripts, and testing utilities for this showcase:

* **SoulboundNFT:** Non-transferable ERC721 NFT that records user achievements.
* **SoulboundReputation:** Non-transferable ERC20 token that awards reputation points.
* **UserRegistration:** Contract for user registration that awards an achievement.

---

## 🔨 Contracts Included

| Contract                    | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **SoulboundNFT.sol**        | ERC721 soulbound NFT contract awarding unique achievements per user. |
| **SoulboundReputation.sol** | ERC20 soulbound reputation point system where users rate each other. |
| **UserRegistration.sol**    | Handles user registration and mints a registration achievement.      |

---

## 🧠 Key Features

✅ Soulbound NFTs (non-transferable) to record achievements.  
✅ Soulbound ERC20 reputation points (non-transferable).  
✅ Awards users for their first rating and for registering.  
✅ Prevents self-rating and duplicate ratings.  
✅ Fully verified on Base Sepolia block explorer.  
✅ Uses OpenZeppelin security primitives (Ownable, AccessControl, ReentrancyGuard).  

---

## 🚀 Use Cases

This **Soulbound Identity Suite** architecture is flexible and can be integrated into various on-chain and hybrid systems, such as:

* 🎮 Web3 games — award players for key milestones, leaderboards, or contributions.
* 🛒 Marketplaces — track reputation & contributions of buyers/sellers.
* 🏦 DAOs — measure contributions to governance and community engagement.
* 👨‍🏫 Learning platforms — reward learners with certificates & points for achievements.
* 🧩 Any dApp — where on-chain identity & reputation enhance trust and engagement.

You can adapt the achievement types, reputation mechanisms, and registration flow to fit specific business needs — supporting ERC20, ERC721, ERC1155, or even hybrid on/off-chain logic.

---

## 🌐 Deployments

### 🧪 Testnet – Base Sepolia

**Contracts Owner:**
`0xB94503C6a717BDD677ad9dAB7B450AF86d3Aa3F5`

| Contract                | Address                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **SoulboundNFT**        | [0xc3BAa93807F505dD3adDDAaa29Eb795EE4f8f4f0](https://sepolia.basescan.org/address/0xc3BAa93807F505dD3adDDAaa29Eb795EE4f8f4f0) |
| **SoulboundReputation** | [0x8a72B2205dc5C5a1DD9dD0E8110639ed9e2E6B71](https://sepolia.basescan.org/address/0x8a72B2205dc5C5a1DD9dD0E8110639ed9e2E6B71) |
| **UserRegistration**    | [0xA7842Ac2C2B01f620285294e6c2A0EaF5e8f9acd](https://sepolia.basescan.org/address/0xA7842Ac2C2B01f620285294e6c2A0EaF5e8f9acd) |

---

## 🏗️ Built For

**Lorebit Studio Portfolio Project**
A demonstration of decentralized soulbound identity, reputation, and achievements on an EVM L2 testnet.

---

## 🧑‍💻 Developed By

**Lorebit Studio**
Smart Contract Development • Tokenomics Design • Fullstack Blockchain Engineering

🌐 [lorebitstudio.com](https://lorebitstudio.com)  
✉️ [contact@lorebitstudio.com](mailto:contact@lorebitstudio.com)  

---

## 📄 License

This repository is licensed under the **MIT License**.

---

## ⭐ Usage

This repository is intended for portfolio and showcase purposes.
If you are interested in hiring **Lorebit Studio** or using these contracts commercially, please get in touch!