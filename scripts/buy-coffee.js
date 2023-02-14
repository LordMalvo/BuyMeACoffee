const hre = require("hardhat");

// Devuelve el balance en Ether de una dirección
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.buyer;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Obtener cuentas de ejemplo
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Obtener el contrato y hacer deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed at ", buyMeACoffee.address);

  // Checkear los balances antes de la compra
  console.log("=== Antes de la compra ===");
  const addresses = [owner.address, tipper1.address, tipper2.address, tipper3.address, buyMeACoffee.address];
  await printBalances(addresses);

  // Comprar cafe
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("Pablo","Gracias!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Claudia","Eres el mejor!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Fernando","Crack!", tip);

  // Checkear balances despues de la compra
  console.log("=== Despues de la compra ===");
  await printBalances(addresses);

  // Hacer withdraw
  await buyMeACoffee.connect(owner).withdrawTips();

  // Checkear balances despues de withdraw
  console.log("=== Despues de withdraw ===");
  await printBalances(addresses);

  // Leer los memos
  await printMemos(await buyMeACoffee.connect(owner).getMemos());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });