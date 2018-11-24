pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "./User.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Post is Ownable {
    event CommentCreated (address commentAddress);

    struct PostInfo {
        string title;
        address creator;
    }

    PostInfo public postInfo;

    mapping(address => bool) comments;

    constructor(string _postTitle, address _postCreator) public {
        postInfo.title = _postTitle;
        postInfo.creator = _postCreator;
    }

    function createComment (string _commentText, address _commentCreator, address _targetAddress) public onlyOwner returns(address) {
        address newCommentAddress = new Comment(_commentText, _commentCreator, _targetAddress);
        comments[newCommentAddress] = true;
        emit CommentCreated(newCommentAddress);
        return newCommentAddress;
    }

    function getCreator () public view returns(address) {
        return postInfo.creator;
    }
}