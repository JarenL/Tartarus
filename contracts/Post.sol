pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address commentAddress);
    //add to postInfo
    // string postTitle
    // string contentHash
    struct PostInfo {
        string ipfsHash;
        address creator;
        uint time;
        mapping(address => bool) comments;
    }  

    PostInfo public postInfo;

    function initialize(string _ipfsHash, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.ipfsHash = _ipfsHash;
        postInfo.creator = _postCreator;
        postInfo.time = now;
    }

    function createComment (string _ipfsHash, address _commentCreator, address _targetAddress, address _cloneComment) 
    public onlyOwner returns(address) {
        require(postInfo.comments[_targetAddress] || _targetAddress == address(this), "Invalid target");
        address clone = createClone(_cloneComment);
        Comment(clone).initialize(_ipfsHash, _commentCreator, _targetAddress);
        postInfo.comments[clone] = true;
        emit CommentCreated(clone);
        return clone;
    }
}