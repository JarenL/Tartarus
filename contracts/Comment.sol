pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Comment is Ownable {
    struct CommentInfo {
        string ipfsHash;
        address creator;
        address target;
        uint time;
    }
    CommentInfo public commentInfo;

    function initialize(string _ipfsHash, address _creator, address _target) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        commentInfo.ipfsHash = _ipfsHash;
        commentInfo.creator = _creator;
        commentInfo.target = _target;
        commentInfo.time = now;
    }

    // function getCreator () public view returns(address) {
    //     return commentInfo.creator;
    // }
}