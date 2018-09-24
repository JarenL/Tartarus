pragma solidity ^0.4.24;

import "./Forum.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ForumFactory is Ownable {
    event ForumCreated(address forumAddress, string forumName, address forumOwner, uint timstamp);  

    function createForum(string _forumName) public {
        address newForumAddress = new Forum(_forumName);
        emit ForumCreated(newForumAddress, _forumName, msg.sender, block.timestamp);
    }
}