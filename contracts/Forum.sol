pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./PostFactory.sol"; 

contract Forum is Ownable, PostFactory {
    event UserBanned(address userAddress, string banReason);
    event UserUnbanned(address userAddress);

    function banUser(address _userAddress) public onlyOwner {
        emit UserBanned(_userAddress);
    }

    function unBanUser(address _userAddress) public onlyOwner {
        emit UserUnbanned(_userAddress);
    }
}