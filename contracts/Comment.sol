pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 
import "./Post.sol"; 

contract Comment is Ownable {
    struct CommentInfo {
        string comment;
        address creator;
        address post;
        address forum;
        address target;
        uint time;
    }

    CommentInfo public commentInfo;

    constructor(string _commentText, address _commentCreator, address _targetAddress) public {
        commentInfo.comment = _commentText;
        commentInfo.creator = _commentCreator;
        commentInfo.target = _targetAddress;
        commentInfo.time = now;
    }

    function getCreator () public view returns(address) {
        return commentInfo.creator;
    }
}