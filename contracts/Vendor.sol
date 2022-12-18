pragma solidity 0.8.17;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MontyToken.sol";

contract Vendor is Ownable {
    MontyToken public montyToken;
    uint256 public constant tokensPerEth = 1000;

    constructor(address tokenAddress) {
        montyToken = MontyToken(tokenAddress);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Need to send ether to receive token");

        uint tokens = msg.value * tokensPerEth;
        montyToken.transfer(msg.sender, tokens);
    }

    function withdraw() public onlyOwner {
        (bool sent,) = payable(owner()).call{ value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function sellTokens(uint256 amount) public {
        montyToken.transferFrom(msg.sender, address(this), amount);
        (bool sent,) = payable(msg.sender).call{ value: (amount / tokensPerEth)}("");
        require(sent, "Failed to send Ether");
    }
}