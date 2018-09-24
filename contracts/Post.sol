pragma solidity ^0.4.24;

import "./CommentFactory.sol"; 

contract Post is CommentFactory {
    constructor () public {
        owner = msg.sender;
    }
}