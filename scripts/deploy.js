// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'",
    )
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners()
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress(),
  )

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const vendingHelper = await ethers.getContractFactory('VendingHelper')
  const Vending = await vendingHelper.deploy(10000)
  await Vending.deployed()

  console.log('Vending address:', Vending.address)

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(Vending)
}

function saveFrontendFiles(Vending) {
  const fs = require('fs')
  const contractsDir = __dirname + '/../frontend/src/contracts'

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    contractsDir + '/contract-address.json',
    JSON.stringify({ Vending: Vending.address }, undefined, 2),
  )

  const VendingArtifact = artifacts.readArtifactSync('VendingHelper')

  fs.writeFileSync(
    contractsDir + '/Vending.json',
    JSON.stringify(VendingArtifact, null, 2),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
