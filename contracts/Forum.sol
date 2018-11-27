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
    
    string public name;
    address public creator;
    string public rules;

    mapping(address => bool) banned;
    mapping(address => bool) posts;
    mapping(address => permissions) moderators;

    struct permissions {
        bool banUser;
        bool deletePost;
        bool createMod;
    }

    function initialize(string _forumName, address _forumCreator) public {
        name = _forumName;
        creator = _forumCreator;
    }

    function createPost(string _postTitle, address _postCreator) public onlyOwner returns(address){
        require(!banned[_postCreator], "User is banned from this forum");
        address newPostAddress = new Post(_postTitle, _postCreator);
        posts[newPostAddress] = true;
        emit PostCreated(newPostAddress);
        return newPostAddress;
    }

    function createComment(string _commentText, address _postAddress, address _targetAddress, address _commentCreator) 
    public onlyOwner returns(address) {
        require(!banned[_commentCreator], "User is banned from this forum");
        require(posts[_postAddress], "Post does not exist.");
        Post targetPost = Post(_postAddress);
        address newComment = targetPost.createComment(_commentText, _commentCreator, _targetAddress);
        return newComment;
    }

    // function deletePost(address _postAddress) public onlyOwner {
    //     //todo
    // }

    // function deleteComment(address _postAddress, address _commentAddress) public onlyOwner {
    //     //todo
    // }

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

    // function createMod(address _modUserAddress) public onlyOwner {
    //     //todo
    // }

    // function removeMod(address _modUserAddress) public onlyOwner {
    //     //todo
    // }
}