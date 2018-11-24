pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Post.sol"; 
import "./User.sol"; 
import "./Tartarus.sol";

contract Forum is Ownable {
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);
    event PostCreated(address postAddress);  
    event PostDeleted(address postAddress);
    
    string public forumName;
    string public forumCreator;
    string public forumRules;

    mapping(address => bool) banned;
    mapping(address => bool) posts;
    mapping(address => permissions) moderators;

    struct permissions {
        bool banUser;
        bool deletePost;
        bool createMod;
    }

    constructor(string _forumName, address _forumCreator) public {
        forumName = _forumName;
        forumCreator = _forumCreator;        
    }

    function banUser(address _userAddress) public onlyOwner {
        require(banned[_userAddress] == 0, "User already banned");
        banned[_userAddress] = true;
        emit UserBanned(_userAddress);
    }

    function unBanUser(address _userAddress) public onlyOwner {
        require(banned[_userAddress] != 0, "User not banned");
        delete banned[_userAddress];
        emit UserUnbanned(_userAddress);
    }

    function createMod(address _modUserAddress) public onlyOwner {
        //todo
    }

    function removeMod(address _modUserAddress) public onlyOwner {
        //todo
    }

    function createPost(string _postTitle, address _postCreator) public onlyOwner returns(address){
        require(banned[_postCreator] == 0, "User is banned from this forum");
        address newPostAddress = new Post(_postTitle, _postCreator);
        posts[newPostAddress] = true;
        emit PostCreated(newPostAddress);
        return newPostAddress;
    }

    function createComment(string _commentText, address _postAddress, address _targetAddress, address _commentCreator) 
    public onlyOwner returns(address) {
        require(banned[_postCreator] == 0, "User is banned from this forum");
        Post targetPost = Post(_postAddress);
        return targetPost.createComment(_commentText, _commentCreator, _targetAddress);
    }

    function deletePost(address _postAddress) public onlyOwner {
        //todo
    }
}