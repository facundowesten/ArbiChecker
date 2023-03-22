const ethers = require("ethers");
require("dotenv").config();
const fs = require("fs");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallets = require("./wallets.json");
const contract = new ethers.Contract(
  "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9",
  "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"claimableTokens\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
  provider
);
const main = async () => {
  const data = [];
  
  for(let x = 0; x < wallets.length; x++) {
    
    const balance = await contract.claimableTokens(wallets[x].address);
    if (balance > 0) {
      data.push({
        address: wallets[x].address,
        privateKey: wallets[x].privateKey,
        balance: ethers.formatEther(balance),
      });
    }
  }

  console.log(data.length, " calificaron");
  let amount = 0;
  data.forEach(async (wallet) => {
    amount += parseInt(wallet.balance);
  });
  console.log("Amount ", amount);
  fs.writeFileSync("data.json", JSON.stringify(data));
};

main();
