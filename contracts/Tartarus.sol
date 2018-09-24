pragma solidity ^0.4.24;

import "./ForumFactory.sol"; 
import "./UserFactory.sol"; 

contract Tartarus is ForumFactory, UserFactory {
    event AdminCreated (address adminAddress);

    function createAdmin(address _adminAddress) public onlyOwner {
        emit AdminCreated(_adminAddress);
    }
}