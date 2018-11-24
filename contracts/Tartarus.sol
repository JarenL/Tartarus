pragma solidity ^0.4.24;

// import "./ForumFactory.sol"; 
// import "./UserFactory.sol"; 
import "./User.sol"; 
import "./Forum.sol"; 
import "./Comment.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Tartarus is Ownable {
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

    function createForum(string _forumName) public {
        require(users[msg.sender] != address(0), "User account not found");
        require(forums[_forumName] != address(0), "Forum already exists");
        address newForumAddress = new Forum(_forumName, users[msg.sender]);
        forums[_forumName] = newForumAddress;
        User targetUser = User(users[msg.sender]);
        targetUser.subscribe(newForumAddress);
        emit ForumCreated(newForumAddress);
    }

    function createPost(address _forumAddress, string _postTitle) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newPostAddress = targetForum.createPost(_postTitle, users[msg.sender]);
        User targetUser = User(users[msg.sender]);
        targetUser.notifyCreatePost(newPostAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, string _commentText) public {
        require(users[msg.sender] != address(0), "User account not found");
        Forum targetForum = Forum(_forumAddress);
        address newCommentAddress = targetForum.createComment(_commentText, _postAddress, _targetAddress, users[msg.sender]);
        User targetUser = User(users[msg.sender]);
        targetUser.notifyCreateComment(newCommentAddress);
        if (_targetAddress == _postAddress) {
            Post targetPost = Post(_targetAddress);
            targetUser = User(targetPost.getCreator());
            targetUser.notifyCommentReceived(newCommentAddress);
        } else {
            Comment targetComment = Comment(_targetAddress);
            targetUser = User(targetComment.getCreator());
            targetUser.notifyCommentReceived(newCommentAddress);
        }
    }

    function createUser() public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require(users[msg.sender] == address(0), "User account not found");
        address newUserAddress = new User(msg.sender);
        users[msg.sender] = newUserAddress;
        emit UserCreated(newUserAddress);
    }

    function authenticateUser() public view returns(address) {
        return users[msg.sender];
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}