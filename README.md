# Blockchain-Based Attendance DApp

A decentralized attendance management system built using **Solidity**, **Hardhat**, and **Ethers.js**, with MetaMask integration for secure and transparent attendance tracking.

## 🚀 Features

- 🎯 Mark attendance using MetaMask wallet  
- 🔒 Tamper-proof and decentralized  
- 💻 Smart contracts deployed on local blockchain (Ganache/Hardhat)  
- 📊 Frontend built with HTML/CSS/JavaScript (No React)

## 🛠️ Tech Stack

| Layer            | Technology         |
|------------------|--------------------|
| Smart Contract   | Solidity, Hardhat  |
| Blockchain       | Ganache (Local)    |
| Frontend         | HTML, CSS, JS      |
| Web3 Integration | Ethers.js, MetaMask |
| Version Control  | Git & GitHub       |

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/PYB05/blockchain-attendance-dapp.git
   cd blockchain-attendance-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile smart contract**
   ```bash
   npx hardhat compile
   ```

4. **Start local blockchain (Ganache or Hardhat node)**

5. **Deploy contract**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

6. **Run frontend**
   - Open `index.html` in your browser
   - Make sure MetaMask is connected to your local blockchain

## 📜 Smart Contract Overview

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attendance {
    mapping(address => bool) public attendance;

    function markAttendance() public {
        require(!attendance[msg.sender], "Already marked");
        attendance[msg.sender] = true;
    }

    function checkAttendance(address _addr) public view returns (bool) {
        return attendance[_addr];
    }
}
```

## 🧠 Future Improvements

- ✅ Store timestamp along with attendance  
- 📤 Deploy to a public testnet 
- 🧾 Add admin panel to view records  
- 🔐 Add role-based access control

## 👨‍💻 Author

- **Prathamesh** ([@PYB05](https://github.com/PYB05))
