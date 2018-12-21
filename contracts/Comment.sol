pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Comment is Ownable {
    // struct CommentInfo {
    //     string ipfsHash;
    //     address creator;
    //     uint time;
    // }
    // CommentInfo public commentInfo;

    function initialize() public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        // commentInfo.ipfsHash = _ipfsHash;
        // commentInfo.creator = _commentCreator;
    }

    // function getCreator () public view returns(address) {
    //     return commentInfo.creator;
    // }
}