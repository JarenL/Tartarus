pragma solidity ^0.4.24;

import "./User.sol"; 
import "./Forum.sol"; 
import "./Comment.sol";
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Tartarus is Ownable, CloneFactory {
    event AdminCreated (address adminAddress);
    event ForumCreated(address forumAddress);  
    event UserCreated (address userAddress);  
    
    mapping (string => address) private forums;
    mapping (address => address) private users;
    // mapping (address => bool) private admins;
    uint createUserCost = 0;

    // function createAdmin(address _adminAddress) public onlyOwner {
    //     require(admins[_adminAddress] == 0, "Admin already exists");
    //     admins[_adminAddress] = true;
    //     emit AdminCreated(_adminAddress);
    // }

    address cloneForum;
    address clonePost;
    address cloneComment;
    address cloneUser;

    constructor() public {
        cloneUser = new User();
        cloneForum = new Forum();
        clonePost = new Post();
        cloneComment = new Comment();
    }

    function createForum(string _forumName) public {
        require(users[msg.sender] != address(0), "User account not found");
        require(forums[_forumName] == address(0), "Forum already exists");
        address clone = createClone(cloneForum);
        Forum(clone).initialize(_forumName, users[msg.sender]);
        forums[_forumName] = clone;
        User targetUser = User(users[msg.sender]);
        targetUser.subscribe(clone);
        emit ForumCreated(clone);
    }   

    function createPost(address _forumAddress, string _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        targetForum.createPost(_ipfsHash, users[msg.sender], clonePost);
        // User targetUser = User(users[msg.sender]);
        // targetUser.notifyCreatePost(newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, string _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        targetForum.createComment(_postAddress, _targetAddress, users[msg.sender], _ipfsHash, cloneComment);
        // User targetUser = User(users[msg.sender]);
        // targetUser.notifyCreateComment(newCommentAddress);
        // if (_targetAddress == _postAddress) {
        //     Post targetPost = Post(_targetAddress);
        //     targetUser = User(targetPost.postInfo.creator);
        //     targetUser.notifyCommentReceived(newCommentAddress);
        // } else {
        //     Comment targetComment = Comment(_targetAddress);
        //     targetUser = User(targetComment.getCreator());
        //     targetUser.notifyCommentReceived(newCommentAddress);
        // }
    }

    function createUser() public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require(users[msg.sender] == address(0), "User account not found");
        address clone = createClone(cloneUser);
        User(clone).initialize(msg.sender);
        users[msg.sender] = clone;
        emit UserCreated(clone);
    }

    function authenticateUser() public view returns(address) {
        return users[msg.sender];
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}