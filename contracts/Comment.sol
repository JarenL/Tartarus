pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 
import "./Post.sol"; 

contract Comment is Ownable {
    string comment;
    address creator;
    address target;

    constructor(string _commentText, address _commentCreator, address _targetAddress) public {
        comment = _commentText;
        creator = _commentCreator;
        target = _targetAddress;
    }
}