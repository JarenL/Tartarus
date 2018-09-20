pragma solidity ^0.4.24;

import "./Forum.sol"; 

contract ForumFactory {
    event ForumCreated(address forumAddress, string forumName, address forumOwner);  

    function createForum(string _forumName) public {
        address newForumAddress = new Forum(_forumName);
        emit ForumCreated(newForumAddress, forumName, msg.sender);
    }
}