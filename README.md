# Tartarus

Ethereum decentralized application built using Ethereum smart contracts. Reddit-like discussion platform. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine to check it up. As of 8/26/2018 only tracks one sport, left drawer not functional.

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
- ```npm run start```
- In Chrome window new page should open

## Important
- Running ```truffle migrate --reset``` required if contract files changed
- Metamask wallets will need to be reset after ```truffle migrate --reset```
- Contract transactions will have metamask popup to confirm transaction. Sometimes pops up in chrome or will have notification on metamask icon.

## Built With

* [Truffle](https://truffleframework.com/truffle) 
* [Drizzle](https://truffleframework.com/blog/drizzle-reactive-ethereum-data-for-front-ends)
* [React](https://reactjs.org/) 

## Authors

* **Jaren Lynch** - [JarenL](https://github.com/JarenL)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 
 - Shout out to Google search

