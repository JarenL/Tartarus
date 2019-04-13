pragma solidity ^0.5.2;

// import "./User.sol"; 
// import "./Forum.sol"; 
// import "./UserFactory.sol";
// import "./ForumFactory.sol";
import "./Ownable.sol";

contract Tartarus is Ownable {
    event ForumCreated (bytes32 forum);  
    event PostCreated (bytes32 indexed forum, bytes32 indexed creator, bytes32 postId);
    event CommentCreated (bytes32 indexed postId, bytes32 indexed creator, bytes32 indexed targetId, bytes32 commentId);
    event ReportUser (bytes32 _user, bytes32 reason);
    event ReportForum (bytes32 _forum, bytes32 reason);
    event ReportPost (bytes32 indexed _forum, bytes32 _postId, bytes32 reason);
    event ReportComment (bytes32 indexed _forum, bytes32 _postId, bytes32 _commentId, bytes32 reason);

    mapping (bytes32 => Admin) public admins;
    mapping (bytes32 => bool) public banned;
    mapping (bytes32 => User) public users;
    mapping (bytes32 => Forum) public forums;
    mapping (bytes32 => Post) public posts;
    mapping (bytes32 => Comment) public comments;

    struct Admin {
        bool ban;
        bool setCost;
        bool editAdmin;
        bool deleteComment;
        bool deletePost;
        bool deleteForum;
    }

    struct Moderator {
        bool ban;
        bool editInfo;
        bool editModerator;
        bool editPinned;
        bool deletePost;
    }

    struct User {
        bytes32 username;
        address creator;
        uint time;
    }
    
    struct Forum {
        bytes32 name;
        bytes32 rules;
        bytes32 description;
        bytes32 creator;
        uint time;
        bytes32[] pinnedPosts;
        mapping(bytes32 => Moderator) moderators;
        mapping(bytes32 =>  bool) banned;
    }

    struct Post {
        bytes32 post;
        bytes32 creator;
        int32 votes;
        uint time;
    }

    struct Comment {
        bytes32 comment;
        bytes32 creator;
        bytes32 target;
        uint time;
    }

    uint public transactionCost = 0;
    uint public createUserCost = 0;

    constructor(bytes32 _user) public {
        owner = msg.sender;
        createUser(_user);
        Admin memory newAdmin;
        newAdmin.ban = true;
        newAdmin.setCost = true;
        newAdmin.editAdmin = true;
        newAdmin.deleteComment = true;
        newAdmin.deletePost = true;
        newAdmin.deleteForum = true;
        admins[_user] = newAdmin;
    }

    modifier userVerified(bytes32 _user){
        require(
            users[_user].creator != address(0) &&
            users[_user].creator == msg.sender, 
            "User not verified"
        );
        _;
    }

    modifier userExists(bytes32 _user){
        require(
            users[_user].creator != address(0), 
            "User does not exist"
        );
        _;
    }

    modifier userUnbanned(bytes32 _user, bytes32 _forum) {
        require(
            !banned[_user] &&
            !forums[_forum].banned[_user], 
            "User banned"
        );
        _;
    }

    modifier forumExists(bytes32 _forum) {
        require(
            forums[_forum].creator != 0, 
            "Forum does not exist"
        );
        _;
    }

    modifier postExists(bytes32 _postId) {
        require(
            posts[_postId].creator != 0, 
            "Post does not exist"
        );
        _;
    }

    modifier commentExists(bytes32 _commentId) {
        require(
            comments[_commentId].creator != 0, 
            "Comment does not exist"
        );
        _;
    }

    function createUser(bytes32 _username) public payable {
        require(
            msg.value >= createUserCost, 
            "Insufficient Eth Sent"
        );
        // require(
        //     validateName(_username), 
        //     "Invalid username"
        // );
        require(
            users[_username].creator == address(0), 
            "Username already exist"
        );
        User memory newUser;
        newUser.username = _username;
        newUser.creator = msg.sender;
        newUser.time = now;
        users[_username] = newUser;
    }

    // function validateName(bytes32 _name) public pure returns (bool){
    //     bytes memory name = abi.encodePacked(_name);
    //     if(name.length > 20 || name.length < 3) {
    //         return false;
    //     }
    //     for(uint i; i < name.length; i++){
    //         bytes1 char = name[i];
    //         if(
    //             !(char >= 0x30 && char <= 0x39) && //9-0
    //             !(char >= 0x41 && char <= 0x5A) && //A-Z
    //             !(char >= 0x61 && char <= 0x7A) //a-z
    //             // !(char == 0x2E) //.
    //         ) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    function createForum(bytes32 _user, bytes32 _forum, bytes32 _rules, bytes32 _description) 
    public userVerified(_user) {
        require(
            !banned[_user],
            "User banned"
        );
        require(
            forums[_forum].creator == 0,
            "Forum already exists"
        );
        Forum memory newForum;
        newForum.name = _forum;
        newForum.rules = _rules;
        newForum.description = _description;
        newForum.creator = _user;
        newForum.time = now;
        forums[_forum] = newForum;
        emit ForumCreated(_forum);
    }   

    function deleteForum(bytes32 _user, bytes32 _forum) 
    public userVerified(_user) forumExists(_forum){
        require(
            admins[_user].deleteForum ||
            forums[_forum].creator == _user,
            "User does not have permission"
        );
        delete forums[_forum];
    }   

    function createPost(bytes32 _user, bytes32 _forum, bytes32 _post) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) {
        bytes32 postId = keccak256(abi.encodePacked(now, _post, _forum));
        Post memory newPost;
        newPost.post = _post;
        newPost.creator = _user;
        newPost.time = now;
        posts[postId] = newPost;
        emit PostCreated(_forum, _user, postId);
    }

    function deletePost(bytes32 _user, bytes32 _forum, bytes32 _postId) 
    public userVerified(_user) forumExists(_forum) postExists(_postId) {
        require(
            admins[_user].deletePost ||
            forums[_forum].moderators[_user].deletePost ||
            posts[_postId].creator == _user,
            "User does not have permission"
        );
        delete posts[_postId];
    }

    function pinPost(bytes32 _user, bytes32 _forum, bytes32 _postId) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) {
        require(
            forums[_forum].moderators[_user].editPinned,
            "User does not have permission"
        );
        forums[_forum].pinnedPosts.push(_postId);
    }

    function unpinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex) 
    public userVerified(_user) forumExists(_forum) postExists(_postId) {
        require(
            forums[_forum].moderators[_user].editPinned,
            "User does not have permission"
        );
        forums[_forum].pinnedPosts[_postIndex] = forums[_forum].pinnedPosts[forums[_forum].pinnedPosts.length - 1];
        forums[_forum].pinnedPosts.length--;    
    }

    function upvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) {
        posts[_postId].votes += 1;
    }

    function downvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) {
        posts[_postId].votes -= 1;
    }

    function createComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _comment, bytes32 _targetId) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) {
        require(
            posts[_targetId].creator != 0 || 
            comments[_targetId].creator != 0, 
            "Target does not exist"
        );
        bytes32 commentId = keccak256(abi.encodePacked(now, _comment, _postId));
        Comment memory newComment;
        newComment.comment = _comment;
        newComment.creator = _user;
        newComment.target = _targetId;
        newComment.time = now;
        emit CommentCreated(_postId, _user, commentId, _targetId);
    }

    function deleteComment(bytes32 _user, bytes32 _forum, bytes32 _commentId) 
    public userVerified(_user) forumExists(_forum) commentExists(_commentId) {
        require(
            admins[_user].deleteComment ||
            forums[_forum].moderators[_user].deletePost ||
            comments[_commentId].creator == _user,
            "User does not have permission"
        );
        delete comments[_commentId];
    }

    function createModerator(
        bytes32 _user,
        bytes32 _forum,
        bytes32 _targetUser, 
        bool _ban, 
        bool _editInfo, 
        bool _editModerators, 
        bool _deletePost) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) userUnbanned(_targetUser, _forum) {
        require(
            forums[_forum].moderators[_user].editModerator,
            "User does not have permission"
        );
        Moderator memory newModerator;
        newModerator.ban = _ban;
        newModerator.editInfo = _editInfo;
        newModerator.editModerator = _editModerators;
        newModerator.deletePost = _deletePost;
        forums[_forum].moderators[_user] = newModerator;
    }

    function removeModerator(bytes32 _user, bytes32 _targetUser, bytes32 _forum) 
    public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editModerator,
            "User does not have permission"
        );
        delete forums[_forum].moderators[_targetUser];
    }

    function setForumRules(bytes32 _user, bytes32 _forum, bytes32 _rules) 
    public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editInfo,
            "User does not have permission"
        );
        forums[_forum].rules = _rules;
    }
    
    function setForumDescription(bytes32 _user, bytes32 _forum, bytes32 _description) 
    public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editInfo,
            "User does not have permission"
        );
        forums[_forum].description = _description;
    }

    function banUserForum(bytes32 _user, bytes32 _targetUser, bytes32 _forum) 
    public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
        require(
            !forums[_forum].banned[_targetUser], 
            "Target user already banned"
        );
        require(
            forums[_forum].moderators[_user].ban,
            "User does not have permission"
        );
        forums[_forum].banned[_targetUser] = true;
    }

    function unbanUserForum(bytes32 _user, bytes32 _targetUser, bytes32 _forum) 
    public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
        require(
            forums[_forum].banned[_targetUser], 
            "Target user not banned"
        );
        require(
            forums[_forum].moderators[_user].ban,
            "User does not have permission"
        );
        forums[_forum].banned[_targetUser] = false;
    }

    function reportUser(bytes32 _user, bytes32 _targetUser, bytes32 _reason) 
    public userVerified(_user) userExists(_targetUser) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportUser(_user, _reason);
    }

    function reportForum(bytes32 _user, bytes32 _forum, bytes32 _reason) 
    public userVerified(_user) forumExists(_forum) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportForum(_forum, _reason);
    }

    function reportPost(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _reason) 
    public userVerified(_user) forumExists(_forum) postExists(_postId) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportPost(_forum, _postId, _reason);
    }

    function reportComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId, bytes32 _reason) 
    public userVerified(_user) forumExists(_forum) commentExists(_commentId) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportComment(_forum, _postId, _commentId, _reason);
    }

    function createAdmin(
        bytes32 _user,
        bytes32 _targetUser, 
        bool _ban,
        bool _setCost,
        bool _editAdmin,
        bool _deletePost,
        bool _deleteComment,
        bool _deleteForum
        ) 
        public userVerified(_user) userExists(_targetUser) {
        require(
            admins[_user].editAdmin, "User does not have permission"
        );
        // require(admins[users[_username]], "Target user is not admin"); ???
        Admin memory newAdmin;
        newAdmin.ban = _ban;
        newAdmin.setCost = _setCost;
        newAdmin.editAdmin = _editAdmin;
        newAdmin.deleteComment = _deleteComment;
        newAdmin.deletePost = _deletePost;
        newAdmin.deleteForum = _deleteForum;
        admins[_targetUser] = newAdmin;
    }  

    function removeAdmin(bytes32 _user, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) {
        require(
            admins[_user].editAdmin, "User does not have permission"
        );
        // require(admins[users[_username]], "Target user is not admin"); ???
        delete admins[_user];
    }

    function banUserTartarus(bytes32 _user, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) {
        require(
            admins[_user].ban, "User does not have permission"
        );
        require(
            !banned[_targetUser], 
            "User is already banned"
        );
        banned[_targetUser] = true;
    }

    function unbanUserTartarus(bytes32 _user, bytes32 _targetUser)
        public userVerified(_user) userExists(_targetUser) {
        require(
            admins[_user].ban, "User does not have permission"
        );
        require(
            banned[_targetUser], 
            "User is not banned"
        );
        banned[_targetUser] = false;
    }

    function setCreateUserCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        createUserCost = _newCost;
    }

    function setTransactionCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        transactionCost = _newCost;
    }
}