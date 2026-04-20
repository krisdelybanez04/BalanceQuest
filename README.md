# 🎮 BalanceQuest

BalanceQuest is a mobile-first savings app that gamifies financial discipline by allowing users to lock small amounts of money into time-bound “missions.” Using Soroban smart contracts on Stellar, funds are securely locked and only released with rewards after successful completion, helping users control overspending and build better financial habits.

---
## Live Demo
https://balance-quest-chi.vercel.app/

## 📌 Problem

A 20-year-old student in Quezon City receiving ₱5,000 monthly allowance overspends on food delivery and daily expenses, causing them to run out of money before the next allowance and experience financial stress.

---

## 💡 Solution

BalanceQuest enables a parent to send XLM or USDC to a student’s wallet, where the student locks part of the funds into a time-bound savings mission via a Soroban smart contract, ensuring funds are only released with rewards upon completion—leveraging Stellar’s low-cost, fast, and programmable transactions.

---

## ⚙️ Core Feature (MVP)

- The user selects a savings mission (e.g., “Lock ₱200 for 5 days”)  
- A Soroban smart contract locks the equivalent XLM amount and records the mission state  
- Funds remain inaccessible during the mission duration  
- After completion, the contract automatically releases the locked funds  
- The user receives their savings along with a reward  

---

## 🔗 Stellar Features Used

- XLM / USDC Transfers  
- Soroban Smart Contracts  

---
## 🌐 On-Chain Verification

All contract logic, user interactions, and transactions are publicly verifiable on the Stellar ledger.

<img width="1919" height="953" alt="image" src="https://github.com/user-attachments/assets/d370b70c-0cac-421c-ba00-821d2588e93b" />
https://stellar.expert/explorer/testnet/contract/CAJVCMOL5CGCDFV5VFCGOQKH6PP7ZUSY6G3OA2IWGQJ4NNCQAHLUPTQ4


## 👥 Target Users

Students aged 18–24 in Metro Manila, Cebu, and Davao who rely on weekly or monthly allowances and struggle with overspending, along with young employees managing fixed salaries and OFW family members who want to ensure their remittances are used responsibly.

---

## 🚀 How It Works

User Action → On-chain Action → Result  

The user selects a savings mission and locks a portion of their funds, triggering a Soroban smart contract that records and enforces the lock; during the mission, funds remain inaccessible; once completed, the contract verifies the condition and releases the funds along with a reward back to the user’s wallet.

---

## 🏆 Why This Wins

BalanceQuest solves a real behavioral financial problem—overspending—using actual money movement on Stellar, making it more impactful than simple budgeting apps, while showcasing programmable savings, gamified rewards, and real-world Filipino financial scenarios such as allowance systems and remittances.

---

## ⚡ Optional Edge Features

- AI chatbot for personalized budgeting advice and spending insights  
- Preset saving missions (Food Lock, Commute Lock, Bills First, Exam Week Lock)  
- Dynamic daily budget adjustment based on spending patterns  
- Integration with local cash-in/cash-out anchors for PHP ↔ XLM conversion  

---

## 🌏 Project Constraints

- *Region:* Southeast Asia (SEA)  
- *User Type:* Students  
- *Complexity:* Soroban required, Mobile-first  
- *Theme:* Micropayments · Savings & Lending  

---

## 🛠️ Tech Stack

- Soroban (Stellar Smart Contracts)  
- Rust  
- Stellar SDK  

---

## 🎯 Vision

To transform saving money into an engaging and rewarding experience by combining financial discipline with gamification, helping users build sustainable money habits while leveraging blockchain technology for transparency and trust.
