//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../libs/openzeppelin/token/ERC20/ERC20.sol";
import "../libs/openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "../libs/openzeppelin/utils/math/Math.sol";

contract MiniYak is ERC20 {
    using SafeERC20 for IERC20;
    constructor() ERC20("MiniYAK", "mYAK") {}
    address public YAK = 0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7;

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     */
    function decimals() public pure override returns (uint8) {
        return 12;
    }

    /**
     * @notice moons Yak to mini Yak (mints mini Yak )
     * @param amount amount of YAK that will be mooned
     * @param to address of caller or the address to which miniYAK would be transferred to
     */
    function moon(uint amount, address to) external {
        uint mint_amount = Math.min(amount, IERC20(YAK).balanceOf(msg.sender));
        IERC20(YAK).safeTransferFrom(msg.sender,address(this),mint_amount);
        _mint(to, mint_amount);
    }

    /**
     * @notice unmoons mini Yak to Yak and burns mini Yak
     * @param amount amount of miniyak
     * @param to address of caller or the address to which YAK would be transferred to
     */
    function unmoon(uint amount, address to) external {
        uint burn_amount = Math.min(amount, this.balanceOf(msg.sender));
        _burn(msg.sender, burn_amount);
        IERC20(YAK).safeTransfer(to, burn_amount);
    }
}