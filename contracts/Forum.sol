pragma solidity >=0.4.22 <0.6.0;

import "./Post.sol"; 
import "./User.sol"; 
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Forum is Ownable, CloneFactory {
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);
    event PostCreated(address postAddress);  
    
    string public name;
    address public creator;
    bytes32 public rules;

    mapping(address => bool) moderators;
    mapping(address => bool) banned;
    mapping(address => bool) posts;

    // todo: forumName => bytes32

    function initialize(string memory _forumName, address _forumCreator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        name = _forumName;
        creator = _forumCreator;
    }

    function createPost(string memory _ipfsHash, address _postCreator, address _clonePost) public onlyOwner returns(address){
        require(!banned[_postCreator], "User is banned from this forum");
        address newPostAddress = createClone(_clonePost);
        Post(newPostAddress).initialize(_ipfsHash, _postCreator);
        posts[newPostAddress] = true;
        emit PostCreated(newPostAddress);
        return newPostAddress;
    }

    function createComment(address _postAddress, address _targetAddress, address _commentCreator, bytes32 _ipfsHash, address _cloneComment) 
    public onlyOwner returns(address) {
        require(!banned[_commentCreator], "User is banned from this forum");
        require(posts[_postAddress], "Post does not exist.");
        Post targetPost = Post(_postAddress);
        address newCommentAddress = targetPost.createComment(_ipfsHash, _commentCreator, _targetAddress, _cloneComment);
        return newCommentAddress;
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