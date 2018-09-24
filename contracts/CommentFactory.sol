pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract CommentFactory is Ownable {
    event CommentCreated (address parentAddress, address commentAddress, address senderAddress, string commentText, uint timestamp);  

    function createComment (address _parentAddress, address _parentAddressOwner, string _commentText) public {
        address newCommentAddress = new Comment(_parentAddress);
        User parentUser = User(_parentAddressOwner);
        parentUser.receiveComment(_parentAddress, newCommentAddress, msg.sender, _commentText);
        emit CommentCreated(_parentAddress, newCommentAddress, msg.sender, _commentText, block.timestamp);
    }
}