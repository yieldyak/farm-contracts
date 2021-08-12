![Tests](https://github.com/yieldyak/farm-contracts/actions/workflows/test.yml/badge.svg)

# Yield Yak Farm Contracts
Smart contracts for the [Yield Yak](https://yieldyak.com/) farms

## Compiling
To compile the project:
```bash
> npm install
> npx hardhat compile
```
## Tests

To run the tests first you need to run a fork of the mainnet on a separated terminal:
```bash
> npx hardhat --network hardhat node
```

On a separated terminal you can then run the tests
```bash
> npx hardhat --network localhost test
```
All tests should be passing at all times.

To create new tests, refer to the ./test folder.

## Contracts

### Main Net
```bash
MiniYak: 0xf7e9Fa54F7C988d985Bb9F3034691c72fbf705cA
```
### Fuji
```bash
MiniYak: 0xb3Cae31c087af06Ec1dE2cdBBE296B42E68B9d5d
```