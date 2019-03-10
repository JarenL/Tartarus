pragma solidity ^0.4.24;

import "./Comment.sol"; 
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address indexed commentAddress, address indexed targetAddress);

    struct PostInfo {
        string ipfsHash;
        address creator;
        uint time;
        int32 votes;
        mapping(address => bool) voters;
    }  

    PostInfo public postInfo;

    function initialize(string _ipfsHash, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.ipfsHash = _ipfsHash;
        postInfo.creator = _postCreator;
        postInfo.time = now;
        postInfo.votes = 0;
    }

    function createComment (bytes32 _ipfsHash, address _commentCreator, address _targetAddress, address _cloneComment) 
    public onlyOwner returns(address) {
        address clone = createClone(_cloneComment);
        Comment(clone).initialize(_ipfsHash, _commentCreator, _targetAddress);
        emit CommentCreated(clone, _targetAddress);
        return clone;
    }

    // function getCommentInfo(address _commentAddress) public view returns(bytes32, address, address, uint) {
    //     return (
    //         postInfo.comments[_commentAddress].ipfsHash,
    //         postInfo.comments[_commentAddress].creator,
    //         postInfo.comments[_commentAddress].target,
    //         postInfo.comments[_commentAddress].time
    //     );
    // }

    // todo create separate createComment => comment function
    // todo create upvote / downvote comment functions

    function upvote() public {
        require (!postInfo.voters[msg.sender], "Already voted");
        postInfo.voters[msg.sender] = true;
        postInfo.votes += 1;
    }

    function downvote() public {
        require (!postInfo.voters[msg.sender], "Already voted");
        postInfo.voters[msg.sender] = true;
        postInfo.votes -= 1;
    }
}