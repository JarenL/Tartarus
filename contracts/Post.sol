pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address commentAddress);

    struct PostInfo {
        string title;
        address creator;
        address forum;
        uint time;
        mapping(address => bool) comments;
    }

    PostInfo public postInfo;

    function initialize(string _postTitle, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.title = _postTitle;
        postInfo.creator = _postCreator;
        postInfo.time = now;
        postInfo.forum = address(msg.sender);
    }

    function createComment (string _commentText, address _commentCreator, address _targetAddress, address _cloneComment) 
    public onlyOwner returns(address) {
        address clone = createClone(_cloneComment);
        Comment(clone).initialize(_commentText, _commentCreator, _targetAddress);
        postInfo.comments[clone] = true;
        emit CommentCreated(clone);
        return clone;
    }

    function getCreator () public view returns(address) {
        return postInfo.creator;
    }
}