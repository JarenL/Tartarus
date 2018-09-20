pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract User is Ownable {
    event SubscribeForum (address forumAddress, string forumName, address userAddress); 
    event UnsubscribeForum (address forumAddress, string forumName, address userAddress); 
    event Notify (address parentPostAddress, address replyPostAddress);

    function notify(string _username) public payable {
        require((usernames[_username] == 0), "Username taken");
        address newUserAddress = new User(_username);
        userNames[_username] = msg.sender;
        emit UserCreated(newUserAddress, username);
    }

    function checkUsernameAvailability(string _userName) public returns(bool) {
        if (usernames[_username] == 0) {
            return true;
        } else {
            return false;
        }

    }

    function changeCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}