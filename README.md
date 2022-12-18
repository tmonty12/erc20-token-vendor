# Simple ERC-20 Token Vendor

## Deploying Token Vendor Locally

You first need to clone the repository to your local environment and install all of the packages:

```shell
npm install
```

Then you need to start running a hardhat local network by entering this command into your terminal:

```shell
npx hardhat node
```

After, you need to create an account with Alchemy if you have not already and create an app. You should now have an API key that you will need for later. Then you need to create a .env file in the root directory. In the .env file you need to define the following variables ```REACT_APP_NETWORK, REACT_APP_ALCHEMY_API_KEY, PRIVATE_KEY```.
