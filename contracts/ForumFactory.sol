pragma solidity ^0.4.24;

import "./Forum.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ForumFactory is Ownable {
    event ForumCreated(address forumAddress, string forumName, address forumOwner, uint timstamp);  
    mapping (string => address) forums;

    function createForum(string _forumName) public {
        require(forums[_forumName] == 0, "Forum already exists");
        address newForumAddress = new Forum(_forumName);
        forums[_forumName] = newForumAddress;
        emit ForumCreated(newForumAddress, _forumName, msg.sender, block.timestamp);
    }
}