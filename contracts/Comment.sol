pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Comment is Ownable {
    struct CommentInfo {
        bytes32 comment;
        address creator;
        address target;
        uint time;
    }
    
    CommentInfo public commentInfo;

    function initialize(address _targetAddress, address _creatorAddress, bytes32 _comment) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        commentInfo.comment = _comment;
        commentInfo.creator = _creatorAddress;
        commentInfo.target = _targetAddress;
        commentInfo.time = now;
    }

    function deleteComment(address payable _suicideAddress) external {
        require(msg.sender == owner, "Invalid sender address");
        selfdestruct(_suicideAddress);
    }
}