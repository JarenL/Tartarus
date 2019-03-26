pragma solidity ^0.5.0;

import "./User.sol"; 
import "./Post.sol"; 
import "./Forum.sol"; 
import "./Comment.sol";
import "./CloneFactory.sol";
import "./Ownable.sol";

contract Tartarus is Ownable, CloneFactory {
    event ForumCreated (address forumAddress);  
    event PostCreated (address indexed forumAddress, address indexed creatorAddress, address postAddress);
    event CommentCreated (address indexed forumAddress, address indexed postAddress, address indexed creatorAddress, address commentAddress);
    event MessageSent (address indexed targetAddress, address indexed senderAddress, string messageText);

    mapping (address => bool) public admins;
    mapping (address => bool) public banned;
    mapping (bytes32 => address) public users;
    mapping (bytes32 => address) public forums;

    uint public transactionCost = 0;
    uint public createUserCost = 0;
    address cloneForum;
    address clonePost;
    address cloneComment;
    address cloneUser;

    constructor() public {
        cloneForum = address(new Forum());
        clonePost = address(new Post());
        cloneComment = address(new Comment());
        cloneUser = address(new User());
    }

    // function createAdmin(string memory _admin) public onlyOwner {
    //     require(usernames[_admin] != address(0), "User account not found");
    //     require(admins[_admin], "Admin already exists");
    //     admins[_admin] = true;
    // }  

    function createForum(bytes32 _forumName) external {
        require(forums[_forumName] == address(0), "Forum already exists");
        require(users[User(msg.sender).username()] != address(0), "User not found");
        require(!banned[msg.sender], "User banned");
        address clone = createClone(cloneForum);
        Forum(clone).initialize(_forumName, msg.sender);
        forums[_forumName] = clone;
        emit ForumCreated(clone);
    }   

    function createPost(address _forumAddress, bytes32 _post) external {
        require(users[User(msg.sender).username()] != address(0), "User not found");
        Forum targetForum = Forum(_forumAddress);
        address newPostAddress = targetForum.createPost(_post, msg.sender, clonePost);
        emit PostCreated(_forumAddress, msg.sender, newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, bytes32 _comment) external {
        require(users[User(msg.sender).username()] != address(0), "User not found");
        Forum targetForum = Forum(_forumAddress);
        address newCommentAddress = targetForum.createComment(_postAddress, _targetAddress, msg.sender, _comment, cloneComment);
        emit CommentCreated(_forumAddress, _postAddress, msg.sender, newCommentAddress);
    }

    function createUser(bytes32 _username) external payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require(users[_username] == address(0), "Username already exists");
        // require(validateName(_username), "Invalid username");
        address clone = createClone(cloneUser);
        User(clone).initialize(msg.sender, _username);
        users[_username] = clone;
    }

    function setUserCreationCost(uint _newCost) external onlyOwner {
        createUserCost = _newCost;
    }

    // function validateName(bytes32 _forumName) internal pure returns (bool){
    //     if(_forumName.length > 20 || _forumName.length < 3) {
    //         return false;
    //     }
    //     for(uint i; i<_forumName.length; i++){
    //         bytes1 char = _forumName[i];
    //         if(
    //             !(char >= 0x30 && char <= 0x39) && //9-0
    //             !(char >= 0x41 && char <= 0x5A) && //A-Z
    //             !(char >= 0x61 && char <= 0x7A) && //a-z
    //             !(char == 0x2E) //.
    //         ) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
}