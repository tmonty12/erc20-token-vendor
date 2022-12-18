pragma solidity 0.8.17;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MontyToken is ERC20 {
    constructor() ERC20("Monty", "MTY") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}