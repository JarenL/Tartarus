pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract UserFactory is Ownable {
    event UserCreated (address userAddress, string userName, uint timestamp);  
    mapping (string => address) usernames;
    uint createUserCost = 0;

    function createUser(string _username) public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require((usernames[_username] == 0), "Username taken");
        address newUserAddress = new User();
        usernames[_username] = msg.sender;
        emit UserCreated(newUserAddress, _username, block.timestamp);
    }

    function checkUsernameAvailability(string _username) public view returns(bool) {
        if (usernames[_username] == 0) {
            return true;
        } else {
            return false;
        }
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}