//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../libs/openzeppelin/token/ERC20/ERC20.sol";

contract MiniYak is ERC20 {

    constructor() ERC20("MiniYak", "MYAK") {}

}