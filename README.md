# Tartarus

Ethereum decentralized application built using Ethereum smart contracts. Reddit-like discussion platform. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine to check it up. 

### Prerequisites

What things you need to run this application:

- Web3 compatible browser
- Ganache (or other TestRPC tool)
- Truffle

### Installing

Install NodeJS & NPM:
- Follow instructions https://www.npmjs.com/get-npm

Install Ganache:
- Follow instructions http://truffleframework.com/ganache/

Install Truffle:
- Follow instructions https://truffleframework.com/truffle

You need web3 compatible browser:
- Install MetaMask (Chrome or Firefox): https://metamask.io/

## How to Run
- After cloning repo, go to local Tartarus directory
- ```truffle compile```
- ```truffle migrate --reset```
- Last line of your terminal will say "Tartarus: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf" (address will be different). Copy and paste this address into line 65 of App.js (current line as of 10/24/2018)
- ```npm run start```
- In Chrome window new page should open

## Important
- Running ```truffle migrate --reset``` required if contract files changed
- Metamask wallets will need to be reset after ```truffle migrate --reset```
- Contract transactions will have metamask popup to confirm transaction. Sometimes pops up in chrome or will have notification on metamask icon.

## Built With

* [Truffle](https://truffleframework.com/truffle) 
* [React](https://reactjs.org/) 
* [Redux](https://redux.js.org/)

## Authors

* **Jaren Lynch** - [JarenL](https://github.com/JarenL)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 
 - Shout out to Google search

