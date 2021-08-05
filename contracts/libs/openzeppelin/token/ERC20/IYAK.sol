// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

interface IYAK is IERC20 {
    function wrap() external payable;
    function withdrawOwnerOnly(uint amount) external;
    function unwrap() external;
    function assignSwapPair(address pair) external;
    function mint(address to) external returns (uint liquidity);
    function sync() external;
}