pragma solidity ^0.5.2;

import "./Ownable.sol";

contract Tartarus is Ownable {
    event AdminCreated (bytes32 user, bytes32 targetUser);
    event AdminRemoved (bytes32 user, bytes32 targetUser);
    event ModeratorCreated (bytes32 indexed forum, bytes32 user, bytes32 targetUser);
    event ModeratorRemoved (bytes32 indexed forum, bytes32 user, bytes32 targetUser);
    event UserCreated (bytes32 user);
    event UserBanned (bytes32 user);
    event UserForumBanned (bytes32 indexed forum, bytes32 user);
    event ForumCreated (bytes32 forum);  
    event ForumDeleted (bytes32 forum);
    event ForumRulesEdited (bytes32 indexed forum, bytes32 oldRules, bytes32 newRules);
    event ForumDescriptionEdited (bytes32 indexed forum, bytes32 oldDescription, bytes32 newDescription);
    event PostCreated (bytes32 indexed forum, bytes32 indexed creator, bytes32 postId);
    event PostDeleted (bytes32 indexed forum, bytes32 postId);
    event PostPinned (bytes32 indexed forum, bytes32 postId);
    event PostUnpinned (bytes32 indexed forum, bytes32 postId);
    event CommentCreated (bytes32 indexed postId, bytes32 indexed creator, bytes32 indexed targetId, bytes32 commentId);
    event CommentDeleted (bytes32 indexed forumId, bytes32 postId, bytes32 commentId);
    event ReportUser (bytes32 user, bytes32 reason);
    event ReportForum (bytes32 forum, bytes32 reason);
    event ReportPost (bytes32 indexed _forum, bytes32 _postId, bytes32 reason);
    event ReportComment (bytes32 indexed _forum, bytes32 _postId, bytes32 _commentId, bytes32 reason);

    mapping (bytes32 => Admin) public admins;
    mapping (bytes32 => bool) public banned;
    mapping (bytes32 => User) public users;
    mapping (bytes32 => Forum) public forums;
    mapping (bytes32 => Post) public posts;
    mapping (bytes32 => Comment) public comments;
    uint public createUserCost = 0.03 ether;
    uint public createForumCost = 0.03 ether;
    uint public createPostCost = 0.0003 ether;
    uint public createCommentCost = 0.0001 ether;
    uint public voteCost = 0.0001 ether;
    uint public nonce = 0;
    
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
        bool editPost;
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
        bytes32 title;
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

    constructor(string memory _username) public {
        owner = msg.sender;
        require(
            validateName(_username), 
            "Invalid username"
        );
        bytes32 usernameBytes = stringToBytes32(_username);
        User memory newUser;
        newUser.username = usernameBytes;
        newUser.creator = msg.sender;
        newUser.time = now;
        users[usernameBytes] = newUser;
        
        Admin memory newAdmin;
        newAdmin.ban = true;
        newAdmin.setCost = true;
        newAdmin.editAdmin = true;
        newAdmin.deleteComment = true;
        newAdmin.deletePost = true;
        newAdmin.deleteForum = true;
        admins[usernameBytes] = newAdmin;
        
        emit UserCreated(usernameBytes);
        emit AdminCreated(usernameBytes, usernameBytes);
    }
    
    modifier requiresFee(uint fee) {
        require(
            msg.value >= fee, 
            "Insufficient Eth sent"
        );
        _;
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

    function validateName(string memory _name) public pure returns (bool){
        bytes memory b = bytes(_name);
        if(b.length > 21 || b.length < 3) {
            return false;
        }
        for(uint i; i < b.length; i++){
            bytes1 char = b[i];
            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x5F) //_
            ) {
                return false;
            }
        }
        return true;
    }
    
    function stringToBytes32(string memory _source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(_source, 32))
        }
    }
    
    function generateId() public returns(bytes32) {
        nonce += 1;
        return bytes32(keccak256(abi.encodePacked(nonce, now, blockhash(block.number - 1))));
    }
    
    function createUser(string memory _username) public payable requiresFee(createUserCost) {
        require(
            validateName(_username), 
            "Invalid username"
        );
        bytes32 usernameBytes = stringToBytes32(_username);
        require(
            users[usernameBytes].creator == address(0), 
            "Username already exist"
        );
        User memory newUser;
        newUser.username = usernameBytes;
        newUser.creator = msg.sender;
        newUser.time = now;
        users[usernameBytes] = newUser;
        emit UserCreated(usernameBytes);
    }

    function createForum(bytes32 _user, string memory _forum, bytes32 _rules, bytes32 _description) 
    public payable userVerified(_user) requiresFee(createForumCost) {
        require(
            !banned[_user],
            "User banned"
        );
        require(
            validateName(_forum), 
            "Invalid forum name"
        );
        bytes32 forumBytes = stringToBytes32(_forum);
        require(
            forums[forumBytes].creator == 0,
            "Forum already exists"
        );
        Forum memory newForum;
        newForum.name = forumBytes;
        newForum.rules = _rules;
        newForum.description = _description;
        newForum.creator = _user;
        newForum.time = now;
        newForum.pinnedPosts = new bytes32[](3);
        forums[forumBytes] = newForum;
        
        Moderator memory newModerator;
        newModerator.ban = true;
        newModerator.editInfo = true;
        newModerator.editModerator = true;
        newModerator.editPost = true;
        forums[forumBytes].moderators[_user] = newModerator;
        
        emit ForumCreated(forumBytes);
        emit ModeratorCreated(forumBytes, _user, _user);
    }   

    function deleteForum(bytes32 _user, bytes32 _forum) 
    public userVerified(_user) forumExists(_forum){
        require(
            admins[_user].deleteForum ||
            forums[_forum].creator == _user,
            "User does not have permission"
        );
        delete forums[_forum];
        emit ForumDeleted(_forum);
    }   

    function createPost(bytes32 _user, bytes32 _forum, bytes32 _title, bytes32 _post) 
    public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) requiresFee(createPostCost) {
        bytes32 postId = generateId();
        Post memory newPost;
        newPost.title = _title;
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
            forums[_forum].moderators[_user].editPost ||
            posts[_postId].creator == _user,
            "User does not have permission"
        );
        delete posts[_postId];
        emit PostDeleted(_forum, _postId);
    }

    function pinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex) 
    public userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) {
        require(
            forums[_forum].moderators[_user].editPost,
            "User does not have permission"
        );
        forums[_forum].pinnedPosts[_postIndex] = _postId;
        emit PostPinned(_forum, _postId);
    }

    function unpinPost(bytes32 _user, bytes32 _forum, uint _postIndex) 
    public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editPost,
            "User does not have permission"
        );
        emit PostUnpinned(_forum, forums[_forum].pinnedPosts[_postIndex]);
        delete forums[_forum].pinnedPosts[_postIndex];    
    }

    function upvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
    public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) requiresFee(voteCost) {
        posts[_postId].votes += 1;
    }

    function downvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
    public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) requiresFee(voteCost) {
        posts[_postId].votes -= 1;
    }

    function createComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _comment, bytes32 _targetId) 
    public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_postId) requiresFee(createCommentCost) {
        require(
            posts[_targetId].creator != 0 || 
            comments[_targetId].creator != 0, 
            "Target does not exist"
        );
        bytes32 commentId = generateId();
        Comment memory newComment;
        newComment.comment = _comment;
        newComment.creator = _user;
        newComment.target = _targetId;
        newComment.time = now;
        comments[commentId] = newComment;
        emit CommentCreated(_postId, _user, _targetId, commentId);
    }

    function deleteComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId) 
    public userVerified(_user) forumExists(_forum) commentExists(_commentId) {
        require(
            admins[_user].deleteComment ||
            forums[_forum].moderators[_user].editPost ||
            comments[_commentId].creator == _user,
            "User does not have permission"
        );
        delete comments[_commentId];
        emit CommentDeleted(_forum, _postId, _commentId);
    }

    function createModerator(
        bytes32 _user,
        bytes32 _forum,
        bytes32 _targetUser, 
        bool _ban, 
        bool _editInfo, 
        bool _editModerators,
        bool _editPost) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) userUnbanned(_targetUser, _forum) {
        require(
            forums[_forum].moderators[_user].editModerator,
            "User does not have permission"
        );
        Moderator memory newModerator;
        newModerator.ban = _ban;
        newModerator.editInfo = _editInfo;
        newModerator.editModerator = _editModerators;
        newModerator.editPost = _editPost;
        forums[_forum].moderators[_user] = newModerator;
        emit ModeratorCreated(_forum, _user, _targetUser);
    }

    function removeModerator(bytes32 _user, bytes32 _targetUser, bytes32 _forum) 
    public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editModerator,
            "User does not have permission"
        );
        delete forums[_forum].moderators[_targetUser];
        emit ModeratorRemoved(_forum, _user, _targetUser);
    }

    function setForumRules(bytes32 _user, bytes32 _forum, bytes32 _rules) 
    public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editInfo,
            "User does not have permission"
        );
        emit ForumRulesEdited(_forum, forums[_forum].rules, _rules);
        forums[_forum].rules = _rules;
    }
    
    function setForumDescription(bytes32 _user, bytes32 _forum, bytes32 _description) 
    public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].editInfo,
            "User does not have permission"
        );
        emit ForumDescriptionEdited(_forum, forums[_forum].description, _description);
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
        emit UserForumBanned(_forum, _user);
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

        Admin memory newAdmin;
        newAdmin.ban = _ban;
        newAdmin.setCost = _setCost;
        newAdmin.editAdmin = _editAdmin;
        newAdmin.deleteComment = _deleteComment;
        newAdmin.deletePost = _deletePost;
        newAdmin.deleteForum = _deleteForum;
        admins[_targetUser] = newAdmin;
        emit AdminCreated(_user, _targetUser);
    }  

    function removeAdmin(bytes32 _user, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) {
        require(
            admins[_user].editAdmin, "User does not have permission"
        );
        delete admins[_targetUser];
        emit AdminRemoved(_user, _targetUser);
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
        emit UserBanned(_user);
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
    
    function setCreateForumCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        createForumCost = _newCost;
    }
    
    function setCreatePostCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        createPostCost = _newCost;
    }
    
    function setCreateCommentCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        createCommentCost = _newCost;
    }
    
    function setVoteCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            admins[_user].setCost, 
            "User does not have permission"
        );
        voteCost = _newCost;
    }
}