pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract UserFactory is Ownable {
    event UserCreated (address indexed ownerAddress, address userAddress, uint timestamp);  
    mapping (address => address) usernames;
    uint createUserCost = 0;

    function createUser() public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require((usernames[msg.sender] == 0), "Username taken");
        address newUserAddress = new User();
        usernames[msg.sender] = newUserAddress;
        emit UserCreated(msg.sender, newUserAddress, block.timestamp);
    }

    function authenticateUser() public view returns(address) {
        return usernames[msg.sender];
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}