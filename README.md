# Simple ERC-20 Token Vendor

## Deployed Token Vendor

Check out the deploys Token Vendor [here](https://main.d2zy2j2csg7hde.amplifyapp.com/).

It can only be used on desktop web and requires using a Metamask wallet or WalletConnect compatible wallet.

Check out the deployed Token contract [here](https://goerli.etherscan.io/address/0xD11Fe938D3C4B9eE189C5FE978B41c3002a31335).

Check out the deployed Vendor contract [here](https://goerli.etherscan.io/address/0x4Fc5eAa3677A84443C1a8F29400a045276641551).

## Deploying Token Vendor Locally

You first need to clone the repository to your local environment and install all of the packages:

```shell
npm install
```

Then you need to start running a hardhat local network by entering this command into your terminal:

```shell
npx hardhat node
```

After, you need to create an account with Alchemy if you have not already and create an app. You should now have an API key that you will need for later. Then you need to create a .env file in the root directory. In the .env file you need to define the following variables ```REACT_APP_NETWORK, REACT_APP_ALCHEMY_API_KEY, PRIVATE_KEY```. ```REACT_APP_NETWORK``` will be defined as ```localhost```, ```REACT_APP_ALCHEMY_API_KEY``` will be defined as your Alchemy API key and ```PRIVATE_KEY``` can be defined as any of the private keys from the accounts that the hardhat node generated. It should look like the following:

```shell
REACT_APP_NETWORK=localhost
REACT_APP_ALCHEMY_API_KEY=<your_api_key>
PRIVATE_KEY=701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82
```

You then need to deploy the contracts:

```shell
npx hardhat run ./scripts/deploy.js --network localhost
```

The scripts should have deployed the MontyToken contract and Vendor contract. You then need to define the variables ```REACT_APP_LOCALHOST_TOKEN_ADDRESS``` and ```REACT_APP_LOCALHOST_VENDOR_ADDRESS``` with the addresses that have been outputted in the terminal.

Finally, you just need to run the React frontend:

```shell
npm start ".env"
```
