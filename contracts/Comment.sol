pragma solidity >=0.4.22 <0.6.0;

import "./Ownable.sol";

contract Comment is Ownable {
    struct CommentInfo {
        bytes32 ipfsHash;
        address creator;
        address target;
        uint time;
        int32 votes;
        mapping(address => bool) voters;
    }
    
    CommentInfo public commentInfo;

    function initialize(bytes32 _ipfsHash, address _creatorAddress, address _targetAddress) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        commentInfo.ipfsHash = _ipfsHash;
        commentInfo.creator = _creatorAddress;
        commentInfo.target = _targetAddress;
        commentInfo.time = now;
        commentInfo.votes = 0;
    }

    // function getCreator () public view returns(address) {
    //     return commentInfo.creator;
    // }
}

    