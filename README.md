
# MiniYak
MiniYak is an ERC-20 compliant token. The contract logic is immutable and includes no ability to mint tokens, burn tokens or otherwise change supply.
```YAML
    Name: Mini Yak
    Symbol: mYAK
    Decimals: 12
    Address: 0xdDAaAD7366B455AfF8E7c82940C43CEB5829B604
    Max Total supply: 10,000,000,000 mYAK(bound by Yak Token)
```
Mini Yak has two important methods, moon and unmoon, moon transform Yak Token into MiniYak at the same rate, but since MiniYak has less decimals, the amount of MiniYak you'll get is 6 orders of magnitude higher. Unmoon does the opposite, it takes MiniYak and gives the correct amount of Yak Token back. No loss in the process, the conversion is 1:1.

The token also exists in the Fuji network at `0xf8Af852F04077Aa372BCA5e844365ed7623b577f`.

## MiniYak stable farm

The MiniYak Stable Farm is deployed using Gondola's implementation, details below:
```YAML
    TxID: 0xd115245a6049ee28ed7ce68ca01584efb67977c7bd1c77231d652c75550ad342
    Swap: 0x9a5E33180D809A69d9cCc0f153D1a45D9149d258
    LPToken: 0x79F8768216FC1697FF4D04c4F3a3034FbC0B6d52
```

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
