pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Comment is Ownable {
    struct CommentInfo {
        string ipfsHash;
        address creator;
    }

    CommentInfo public commentInfo;

    function initialize(string _ipfsHash, address _commentCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        commentInfo.ipfsHash = _ipfsHash;
        commentInfo.creator = _commentCreator;
    }

    function getCreator () public view returns(address) {
        return commentInfo.creator;
    }
}