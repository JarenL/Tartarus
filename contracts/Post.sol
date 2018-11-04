pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "./User.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Post is Ownable {
    event CommentCreated (address parentAddress, address commentAddress, address senderAddress, string commentText, uint timestamp);  

    constructor() public {
        owner = msg.sender;
    }

    function createComment (address _parentAddress, address _parentAddressOwner, string _commentText) public {
        address newCommentAddress = new Comment(_parentAddress);
        User parentUser = User(_parentAddressOwner);
        parentUser.receiveComment(_parentAddress, newCommentAddress, msg.sender, _commentText);
        emit CommentCreated(_parentAddress, newCommentAddress, msg.sender, _commentText, block.timestamp);
    }
}