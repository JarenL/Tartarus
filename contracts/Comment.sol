pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 
import "./Post.sol"; 

contract Comment is Ownable {
    Post parentPost;

    constructor(address _postAddress) public {
        parentPost = Post(_postAddress);
        owner = msg.sender;
    }

    function createReply(string _replyText) public {
        parentPost.createComment(address(this), owner, _replyText);
    }
}