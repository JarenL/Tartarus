pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "./User.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Post is Ownable {
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

    function createComment (string _commentText, address _commentCreator, address _targetAddress) public onlyOwner returns(address) {
        address newCommentAddress = new Comment(_commentText, _commentCreator, _targetAddress);
        postInfo.comments[newCommentAddress] = true;
        emit CommentCreated(newCommentAddress);
        return newCommentAddress;
    }

    function getCreator () public view returns(address) {
        return postInfo.creator;
    }
}