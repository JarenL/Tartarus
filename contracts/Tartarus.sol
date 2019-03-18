pragma solidity >=0.4.22 <0.6.0;

import "./User.sol"; 
import "./Forum.sol"; 
import "./Comment.sol";
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Tartarus is Ownable, CloneFactory {
    event AdminCreated (address adminAddress);
    event ForumCreated (address forumAddress);  
    event PostCreated (address postAddress);
    event CommentCreated (address commentAddress);
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
        cloneUser = address(new User());
        cloneForum = address(new Forum());
        clonePost = address(new Post());
        cloneComment = address(new Comment());
    }

    function createForum(string memory _forumName) public {
        require(users[msg.sender] != address(0), "User account not found");
        require(forums[_forumName] == address(0), "Forum already exists");
        address clone = createClone(cloneForum);
        Forum(clone).initialize(_forumName, users[msg.sender]);
        forums[_forumName] = clone;
        emit ForumCreated(clone);
    }   

    function createPost(address _forumAddress, string memory _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newPostAddress = targetForum.createPost(_ipfsHash, users[msg.sender], clonePost);
        User targetUser = User(users[msg.sender]);
        targetUser.notifyCreatePost(newPostAddress);
        emit PostCreated(newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, bytes32 _ipfsHash) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newCommentAddress = targetForum.createComment(_postAddress, _targetAddress, users[msg.sender], _ipfsHash, cloneComment);
        User targetUser = User(users[msg.sender]);
        targetUser.notifyCreateComment(newCommentAddress);
        emit CommentCreated(newCommentAddress);
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