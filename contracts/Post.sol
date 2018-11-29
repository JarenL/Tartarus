pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address commentAddress);

    struct PostInfo {
        string ipfsHash;
        address creator;
        mapping(address => bool) comments;
    }

    PostInfo public postInfo;

    function initialize(string _ipfsHash, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.ipfsHash = _ipfsHash;
        postInfo.creator = _postCreator;
    }

    function createComment (string _ipfsHash, address _commentCreator, address _cloneComment) 
    public onlyOwner returns(address) {
        address clone = createClone(_cloneComment);
        Comment(clone).initialize(_ipfsHash, _commentCreator);
        postInfo.comments[clone] = true;
        emit CommentCreated(clone);
        return clone;
    }

    function getCreator () public view returns(address) {
        return postInfo.creator;
    }
}