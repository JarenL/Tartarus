pragma solidity >=0.4.22 <0.6.0;

import "./Comment.sol"; 
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Post is Ownable, CloneFactory {
    event CommentCreated (address commentAddress, address targetAddress);

    struct PostInfo {
        string ipfsHash;
        address creator;
        uint time;
        int16 upvotes;
        int16 downvotes;
        mapping(address => bool) voters;
    }  

    PostInfo public postInfo;

    function initialize(string memory _ipfsHash, address _postCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        postInfo.ipfsHash = _ipfsHash;
        postInfo.creator = _postCreator;
        postInfo.time = now;
        postInfo.upvotes = 0;
        postInfo.downvotes = 0;
    }

    function createComment (bytes32 _ipfsHash, address _commentCreator, address _targetAddress, address _cloneComment) 
    public onlyOwner returns(address) {
        address clone = createClone(_cloneComment);
        Comment(clone).initialize(_ipfsHash, _commentCreator, _targetAddress);
        emit CommentCreated(clone, _targetAddress);
        return clone;
    }

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