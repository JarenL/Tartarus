pragma solidity ^0.5.0;

import "./Post.sol"; 
import "./User.sol"; 
import "./CloneFactory.sol";
pragma solidity ^0.5.0;

contract Forum is Ownable, CloneFactory {
    event PostCreated(address postAddress);
    event PostDeleted(address postAddress);
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);
    event ModeratorCreated(address userAddress);
    event ModeratorRemoved(address userAddress);

    mapping(address => bool) moderators;
    mapping(address => bool) banned;
    mapping(address => bool) posts;

    uint public time;
    bytes32 public name;
    bytes32 public rules;
    address public creator;
    address[] public pinnedPosts;

    function initialize(bytes32 _forumName, address _forumCreator) external {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        name = _forumName;
        time = now;
        creator = _forumCreator;
    }

    function createPost(bytes32 _post, address _postCreator, address _clonePost) external onlyOwner returns(address){
        require(!banned[_postCreator], "User is banned from this forum");
        address newPostAddress = createClone(_clonePost);
        Post(newPostAddress).initialize(_post, _postCreator);
        posts[newPostAddress] = true;
        emit PostCreated(newPostAddress);
        return newPostAddress;
    }

    function deletePost(address _postAddress, address payable _suicideAddress) external {
        require(posts[_postAddress], "Post not found");
        require(msg.sender == Post(_postAddress).getPostCreator() || moderators[msg.sender], "Invalid sender address");
        delete(posts[_postAddress]);
        Post(_postAddress).deletePost(_suicideAddress);
        emit PostDeleted(_postAddress);
    }

    function createComment(address _postAddress, address _targetAddress, address _commentCreator, bytes32 _comment, address _cloneComment) 
    external onlyOwner returns(address) {
        require(!banned[_commentCreator], "User is banned from this forum");
        require(posts[_postAddress], "Post does not exist.");
        address newCommentAddress = Post(_postAddress).createComment(_targetAddress, _commentCreator, _comment, _cloneComment);
        return newCommentAddress;
    }

    function deleteComment(address _postAddress, address _commentAddress, address payable _suicideAddress) external {
        require(msg.sender == Post(_postAddress).getPostCreator() || moderators[msg.sender], "Invalid sender address");
        require(posts[_postAddress], "Post not found");
        Post(_postAddress).deleteComment(_commentAddress, _suicideAddress);
    }

    // function addModerator(address user) external {
    //     require(msg.sender )
    // }

    function banUser(address _userAddress) external onlyOwner {
        require(!banned[_userAddress], "User already banned");
        banned[_userAddress] = true;
    }

    function unBanUser(address _userAddress) external onlyOwner {
        require(banned[_userAddress], "User not banned");
        delete banned[_userAddress];
    }

    function updateRules(bytes32 _rules, address _user) public onlyOwner returns(address) {
        require(moderators[_user], "User not moderator");
        rules = _rules;
    }
}