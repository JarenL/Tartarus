pragma solidity ^0.4.24;

import "./Comment.sol"; 

contract CommentFactory {
    event CommentCreated (address commentAddress, address commentOwner, string commentText);  

    function createComment (string _commentText) public {
        address newCommentAddress = new Comment(_commentText);
        emit CommentCreated(newCommentAddress, msg.sender, _commentText);
    }
}