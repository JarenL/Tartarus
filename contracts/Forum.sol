pragma solidity ^0.4.24;

import "./Post.sol"; 
import "./User.sol"; 
import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Forum is Ownable, CloneFactory {
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);
    event PostCreated(address postAddress);  
    event PostDeleted(address postAddress);
    
    string public name;
    address public creator;
    string public rules;

    mapping(address => bool) banned;
    //todo in front end check if post exists in mapping
    mapping(address => bool) posts;
    mapping(address => permissions) moderators;

    struct permissions {
        bool banUser;
        bool deletePost;
        bool createMod;
    }

    function initialize(string _forumName, address _forumCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        name = _forumName;
        creator = _forumCreator;
    }

    function createPost(string _ipfsHash, address _postCreator, address _clonePost) public onlyOwner returns(address){
        require(!banned[_postCreator], "User is banned from this forum");
        address clone = createClone(_clonePost);
        Post(clone).initialize(_ipfsHash, _postCreator);
        posts[clone] = true;
        emit PostCreated(clone);
        return clone;
    }

    function createComment(address _postAddress, address _targetAddress, address _commentCreator, string _ipfsHash, address _cloneComment) 
    public onlyOwner {
        require(!banned[_commentCreator], "User is banned from this forum");
        require(posts[_postAddress], "Post does not exist.");
        Post targetPost = Post(_postAddress);
        targetPost.createComment(_ipfsHash, _commentCreator, _targetAddress, _cloneComment);
    }

    function banUser(address _userAddress) public onlyOwner {
        require(!banned[_userAddress], "User already banned");
        banned[_userAddress] = true;
        emit UserBanned(_userAddress);
    }

    function unBanUser(address _userAddress) public onlyOwner {
        require(banned[_userAddress], "User not banned");
        delete banned[_userAddress];
        emit UserUnbanned(_userAddress);
    }
}