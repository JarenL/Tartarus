pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./PostFactory.sol"; 

contract Forum is PostFactory {
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);

    string forumName;

    constructor(string _forumName) public {
        forumName = _forumName;
        owner = msg.sender;
    }

    function banUser(address _userAddress) public onlyOwner {
        emit UserBanned(_userAddress);
    }

    function unBanUser(address _userAddress) public onlyOwner {
        emit UserUnbanned(_userAddress);
    }
}