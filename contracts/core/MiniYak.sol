//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../libs/openzeppelin/token/ERC20/ERC20.sol";
import "../libs/openzeppelin/token/ERC20/IPair.sol";
import "../libs/openzeppelin/access/Ownable.sol";
import "../libs/openzeppelin/utils/math/SafeMath.sol";

contract MiniYak is ERC20, Ownable {
    using SafeMath for uint;
    IPair private swapPair;
    bool private swapsEnabled;
    event  Deposit(address indexed dst, uint amount);

    constructor() ERC20("MiniYak", "MYAK") {}
    uint constant internal mini = 1000000;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier swapsAllowed() {
        require( swapsEnabled == true, "Ownable: caller is not the owner");
        require(address(swapPair) != address(0));
        _;
    }

    receive() external payable {
        // only accept AVAX via fallback from the owner when rewards are distributed by masterChef
        assert(msg.sender == owner());
    }

    function wrap() public payable {
        _mint(msg.sender, (msg.value).mul(mini));
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawOwnerOnly(uint amount) public onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    function unwrap(uint amount) public {
        _burn(msg.sender,amount.div(mini));
        payable(msg.sender).transfer(amount.div(mini));
    }

    function assignSwapPair(address pair) public onlyOwner {
        require(address(pair)!= address(0),"Cannot assign to a dead address");
        require(IPair(pair).token0() == address(this) || IPair(pair).token1() == address(this));
        swapPair = IPair(pair);
    }

    function swapFromAVAX(uint amount) public swapsAllowed {
        swapPair.swap(0, amount, msg.sender,  new bytes(0));
    }

    function swapToAVAX(uint amount) public swapsAllowed {
        swapPair.swap(amount, 0, msg.sender,  new bytes(0));
    }

}