require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xf7f018c807d9812600da4433f370d4a7ecb292b22faae0626402a641ea77a792", 
        "0x0b0a0f0629ba34543af4e95406148bc55439323a9c6733ba6b54d5a9645a84cb"  
      ],
    },
  },
  solidity: "0.8.18",
};
