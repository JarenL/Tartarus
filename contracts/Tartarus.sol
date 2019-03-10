pragma solidity ^0.4.24;

import "./User.sol"; 
import "./Forum.sol"; 
import "./Comment.sol";
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Tartarus is Ownable, CloneFactory {
    event AdminCreated (address adminAddress);
    event ForumCreated(address forumAddress);  
    event PostCreated(address forumAddress, address postAddress);
    event CommentCreated(address forumAddress, address postAddress, address commentAddress);
    event UserCreated (address userAddress);  
    
    mapping (string => address) private forums;
    mapping (address => bool) private forumList;
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

    function createForum(string _forumName) public returns(address) {
        require(users[msg.sender] != address(0), "User account not found");
        require(forums[_forumName] == address(0), "Forum already exists");
        address clone = createClone(cloneForum);
        Forum(clone).initialize(_forumName, users[msg.sender]);
        forums[_forumName] = clone;
        emit ForumCreated(clone);
        return clone;
    }   

    function createPost(address _forumAddress, string _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newPostAddress = targetForum.createPost(_ipfsHash, users[msg.sender], clonePost);
        User targetUser = User(users[msg.sender]);
        targetUser.notifyCreatePost(newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, bytes32 _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        // address newCommentAddress = targetForum.createComment(_postAddress, _targetAddress, users[msg.sender], _ipfsHash, cloneComment);
        targetForum.createComment(_postAddress, _targetAddress, users[msg.sender], _ipfsHash, cloneComment);
        
        //todo notify user of new comment, (commentHash, postAddress)
        // User targetUser = User(users[msg.sender]);
        // targetUser.notifyCreateComment(newCommentAddress);
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