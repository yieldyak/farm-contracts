![Tests](https://github.com/yieldyak/farm-contracts/actions/workflows/test.yml/badge.svg)

# Yield Yak Farm Contracts
Smart contracts for the [Yield Yak](https://yieldyak.com/) farms

## Compiling
To compile the project:
> npm install
> npx hardhat compile

## Tests

To run the tests first you need to run a fork of the mainnet on a separated terminal:
> npx hardhat --network hardhat node

On a separated terminal you can then run the tests
> npx hardhat --network localhost test

All tests should be passing at all times.

To create new tests, refer to the ./test folder.
