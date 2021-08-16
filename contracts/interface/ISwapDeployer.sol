// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../libs/openzeppelin/token/ERC20/IERC20.sol";


interface ISwapDeployer {
    event NewSwapPool(
        address indexed deployer,
        address swapAddress,
        IERC20[] pooledTokens
    );

    function deploy(
        address swapAddress,
        IERC20[] memory _pooledTokens,
        uint8[] memory decimals,
        string memory lpTokenName,
        string memory lpTokenSymbol,
        uint256 _a,
        uint256 _fee,
        uint256 _adminFee,
        uint256 _withdrawFee,
        address lpTokenTargetAddress
    ) external returns (address);
}