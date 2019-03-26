pragma solidity ^0.5.0;

import "./Comment.sol"; 
import "./Forum.sol"; 
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated(address indexed targetAddress, address commentAddress);
    event CommentDeleted(address indexed targetAddress, address commentAddress);

    struct PostInfo {
        uint16 upvotes;
        uint16 downvotes;
        uint time;
        bytes32 post;
        address creator;
        mapping(address => bool) comments;
        mapping(address => bool) voters;
    }  

    PostInfo public postInfo;

    function initialize(bytes32 _post, address _postCreator) external {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.post = _post;
        postInfo.creator = _postCreator;
        postInfo.time = now;
    }

    function createComment (address _targetAddress, address _commentCreator, bytes32 _comment, address _cloneComment) 
    external onlyOwner returns(address) {
        require(_targetAddress == address(this) || postInfo.comments[_targetAddress], "Invalid comment target address");
        address newCommentAddress = createClone(_cloneComment);
        Comment(newCommentAddress).initialize(_targetAddress, _commentCreator, _comment);
        return newCommentAddress;
    }

    function deletePost(address payable _suicideAddress) external {
        require(msg.sender == owner, "Invalid sender address");
        selfdestruct(_suicideAddress);
    }

    function deleteComment(address _commentAddress, address payable _suicideAddress) external {
        require(msg.sender == owner, "Invalid sender address");
        require(postInfo.comments[_commentAddress], "Comment not found");
        Comment(_commentAddress).deleteComment(_suicideAddress);
    }

    function upvote() external {
        require (!postInfo.voters[msg.sender], "Already voted");
        postInfo.voters[msg.sender] = true;
        postInfo.upvotes += 1;
    }

    function downvote() external {
        require (!postInfo.voters[msg.sender], "Already voted");
        postInfo.voters[msg.sender] = true;
        postInfo.downvotes += 1;
    }

    function getPostCreator() public view returns(address) {
        return postInfo.creator;
    }
}