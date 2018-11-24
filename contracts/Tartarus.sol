pragma solidity ^0.4.24;

// import "./ForumFactory.sol"; 
// import "./UserFactory.sol"; 
import "./User.sol"; 
import "./Forum.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Tartarus is Ownable {
    event AdminCreated (address adminAddress);
    event ForumCreated(address forumAddress);  
    event UserCreated (address userAddress);  
    
    mapping (string => address) private forums;
    mapping (address => address) private users;
    mapping (address => bool) private admins;
    uint createUserCost = 0;

    function createAdmin(address _adminAddress) public onlyOwner {
        require(admins[_adminAddress] == 0, "Admin already exists");
        admins[_adminAddress] = true;
        emit AdminCreated(_adminAddress);
    }

    function createForum(string _forumName) public {
        require(users[msg.sender] != 0, "User account not found");
        require(forums[_forumName] == 0, "Forum already exists");
        address newForumAddress = new Forum(_forumName, users[msg.sender]);
        forums[_forumName] = newForumAddress;
        notifyUser(users[msg.sender], "subscribe", newForumAddress);
        emit ForumCreated(newForumAddress);
    }

    function createPost(address _forumAddress, string _postTitle) public {
        require(users[msg.sender] != 0, "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newPostAddress = targetForum.createPost(_postTitle, users[msg.sender]);
        notifyUser(users[msg.sender], "post", newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, _commentText) public {
        require(users[msg.sender] != 0, "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newCommentAddress = targetForum.createComment(_commentText, _postAddress, _targetAddress, users[msg.sender]);
        notifyUser(users[msg.sender], "comment", newCommentAddress);
        //notify target owner todo
    }

    function createUser() public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require((users[msg.sender] == 0), "User already exists");
        address newUserAddress = new User(msg.sender);
        users[msg.sender] = newUserAddress;
        emit UserCreated(msg.sender, newUserAddress, block.timestamp);
    }

    function notifyUser(address _userAddress, string _type, address _notificationAddress) internal {
        User targetUser = User(_userAddress);
        if (_type == "subscribe") {
            targetUser.subscribe(_notificationAddress);
        } 
        if (_type == "unsubscribe") {
            targetUser.unsubscribe(_notificationAddress);
        } 

        if (_type == "post") {
            targetUser.notifyCreatePost(_notificationAddress);
        } 

        if (_type == "comment") {
            targetUser.notifyCreateComment(_notificationAddress);
        } 

        if (_type == "commentReceived") {
            targetUser.notifyCommentReceived(_notificationAddress);
        } 
    }

    function authenticateUser() public view returns(address) {
        return users[msg.sender];
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}