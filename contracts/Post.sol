pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address commentAddress);

    struct PostInfo {
        string ipfsHash;
        address creator;
        uint time;
        mapping(address => CommentInfo) comments;
    }  

    struct CommentInfo {
        string ipfsHash;
        address creator;
        address target;
        uint time;
    }

    PostInfo public postInfo;

    function initialize(string _ipfsHash, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.ipfsHash = _ipfsHash;
        postInfo.creator = _postCreator;
        postInfo.time = now;
    }

    function createComment (string _ipfsHash, address _commentCreator, address _targetAddress, address _cloneComment) public onlyOwner {
        address clone = createClone(_cloneComment);
        Comment(clone).initialize();
        CommentInfo memory newComment = CommentInfo(_ipfsHash, _commentCreator, _targetAddress, now);
        postInfo.comments[clone] = newComment;
        emit CommentCreated(clone);
    }

    function getComment(address _commentAddress) public view returns(string, address, address, uint) {
        return (
            postInfo.comments[_commentAddress].ipfsHash,
            postInfo.comments[_commentAddress].creator,
            postInfo.comments[_commentAddress].target,
            postInfo.comments[_commentAddress].time
        );
    }
}