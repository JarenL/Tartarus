pragma solidity ^0.5.2;

import "./Ownable.sol";

contract Tartarus is Ownable {
    event TartarusPaid (uint amount, uint time);
    event AdminCreated (bytes32 user, bytes32 targetUser, bool[] permissions, uint time);
    event AdminUpdated (bytes32 user, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event AdminRemoved (bytes32 user, bytes32 targetUser, uint time);
    event AdminBan (bytes32 user, bytes32 targetUser, uint time);
    event AdminUnban (bytes32 user, bytes32 targetUser, uint time);
    event AdminPaid (bytes32 user, bytes32 targetUser, uint amount, uint time);
    event AdminsPaid (bytes32 user, uint amount, uint time);
    event ModeratorCreated (bytes32 indexed forum, bytes32 user, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event ModeratorUpdated (bytes32 indexed forum, bytes32 userm, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event ModeratorRemoved (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event ModeratorBan (bytes32 user, bytes32 indexed forum, bytes32 targetUser, uint time);
    event ModeratorUnban (bytes32 user, bytes32 indexed forum, bytes32 targetUser, uint time);
    event ModeratorPaid (bytes32 indexed forum, bytes32 user, uint amount, uint time);
    event ModeratorsPaid (bytes32 indexed forum, bytes32 user, uint amount, uint time);
    event UserCreated (bytes32 indexed user, uint time);
    event UserUpdated(bytes32 indexed user, bytes32 newInfo, uint time);
    event UserPaid(bytes32 indexed user, uint amount, uint time);
    event ForumCreated (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumLocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumUnlocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumUpdated (bytes32 user, bytes32 indexed forum, bytes32 newInfo, uint time);
    event ForumTransferred (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event PostCreated (bytes32 indexed forum, bytes32 indexed creator, bytes32 indexed postId, uint time);
    event PostDeleted (bytes32 indexed forum, bytes32 user, bytes32 postId, uint time);
    event PostLocked (bytes32 user, bytes32 indexed forum, bytes32 postId, uint time);
    event PostUnlocked (bytes32 user, bytes32 indexed forum, bytes32 postId, uint time);
    event PostPinned (bytes32 indexed forum, bytes32 user, bytes32 postId, uint time);
    event PostUnpinned (bytes32 indexed forum, bytes32 user, bytes32 postId, uint time);
    event CommentCreated (bytes32 indexed postId, bytes32 indexed creator, bytes32 indexed targetId, bytes32 commentId, uint time);
    event CommentDeleted (bytes32 indexed forumId, bytes32 user, bytes32 postId, bytes32 commentId, uint time);
    event ReportUser (bytes32 targetUser, bytes32 reason, uint time);
    event ReportForum (bytes32 forum, bytes32 reason, uint time);
    event ReportPost (bytes32 indexed _forum, bytes32 _postId, bytes32 reason, uint time);
    event ReportComment (bytes32 indexed _forum, bytes32 _postId, bytes32 _commentId, bytes32 reason, uint time);
    event UpdateFee (bytes32 user, string indexed feeType, uint newFee);

    mapping (bytes32 => Admin) public admins;
    mapping (bytes32 => bool) public banned;
    mapping (bytes32 => User) public users;
    mapping (bytes32 => Forum) public forums;
    bytes32[] adminList;
    bytes32 ownerAccount;
    uint public adminBalance;
    uint public adminWages;
    uint public totalAdminWages;
    uint public createUserCost = 0.03 ether;
    uint public createForumCost = 0.03 ether;
    uint public createPostCost = 0.0003 ether;
    uint public createCommentCost = 0.00003 ether;
    uint public voteCost = 0.00003 ether;
    uint public idNonce;

    struct User {
        bytes32 username;
        bytes32 userInfo;
        address creator;
        uint balance;
    }

    // admin permissions
    // full
    // access
    // config
    // mail
    // users
    // forums
    // posts

    struct Admin {
        bool[] permissions;
        uint wage;
        uint listPointer;
    }

    // mod permissions
    // bool full;
    // bool access;
    // bool config;
    // bool mail;
    // bool flair;
    // bool posts;

    struct Moderator {
        bool[] permissions;
        uint wage;
        uint listPointer;
    }
    
    struct Forum {
        bytes32 name;
        bytes32 forumInfo;
        bytes32 owner;
        uint moderatorWages;
        uint totalModeratorWages;
        uint balance;
        bool locked;
        bytes32[] pinnedPosts;
        bytes32[] moderatorList;
        mapping(bytes32 => Moderator) moderators;
        mapping(bytes32 =>  bool) banned;
        mapping(bytes32 => Post) posts;
        mapping(bytes32 => Comment) comments;
    }

    struct Post {
        bytes32 post;
        bytes32 creator;
        uint16 votes;
        uint16 comments;
        bool locked;
    }

    struct Comment {
        bytes32 comment;
        bytes32 creator;
    }

    constructor(string memory _username) public {
        require(
            validateName(_username),
            "Invalid username"
        );
        owner = msg.sender;
        bytes32 usernameBytes = stringToBytes32(_username);
        User memory newUser;
        newUser.username = usernameBytes;
        newUser.creator = msg.sender;
        users[usernameBytes] = newUser;
        ownerAccount = usernameBytes;
    }

    modifier onlyFee(uint _fee) {
        _feePaid(_fee);
        _;
    }

    function _feePaid(uint _fee) internal view {
        require(
            msg.value >= _fee,
            "Insufficient Eth sent"
        );
    }

    modifier onlyUserVerified(bytes32 _user){
        _userVerified(_user);
        _;
    }

    function _userVerified(bytes32 _user) internal view {
        require(
            users[_user].creator != address(0) &&
            users[_user].creator == msg.sender,
            "User not verified"
        );
    }

    modifier onlyUserExists(bytes32 _user){
        _userExists(_user);
        _;
    }

    function _userExists(bytes32 _user) internal view {
        require(
            users[_user].creator != address(0),
            "User does not exist"
        );
    }

    modifier onlyUserAuthorized(bytes32 _user, bytes32 _forum) {
        _userAuthorized(_user, _forum);
        _;
    }

    function _userAuthorized(bytes32 _user, bytes32 _forum) internal view {
        require(
            !banned[_user] &&
            !forums[_forum].banned[_user],
            "User banned"
        );
    }

    modifier onlyForumExists(bytes32 _forum) {
        _forumExists(_forum);
        _;
    }

    function _forumExists(bytes32 _forum) internal view {
        require(
            forums[_forum].owner != 0 &&
            !forums[_forum].locked,
            "Forum does not exist/locked"
        );
    }

    modifier onlyPostExists(bytes32 _forum, bytes32 _postId) {
        _postExists(_forum, _postId);
        _;
    }

    function _postExists(bytes32 _forum, bytes32 _postId) internal view {
        require(
            forums[_forum].posts[_postId].creator != 0 &&
            !forums[_forum].posts[_postId].locked,
            "Post does not exist/locked"
        );
    }

    modifier onlyCommentExists(bytes32 _forum, bytes32 _commentId) {
        _commentExists(_forum, _commentId);
        _;
    }

    function _commentExists(bytes32 _forum, bytes32 _commentId) internal view {
        require(
            forums[_forum].comments[_commentId].creator != 0,
            "Comment does not exist"
        );
    }

    function validateName(string memory _name) internal pure returns (bool){
        bytes memory b = bytes(_name);
        if(b.length > 21 || b.length < 3) {
            return false;
        }
        for(uint i; i < b.length; i++){
            bytes1 char = b[i];
            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x5F) && //_
                !(char == 0x2D) //-
            ) {
                return false;
            }
        }
        return true;
    }

    function stringToBytes32(string memory _source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(_source, 32))
        }
    }

    function generateId() internal returns(bytes32) {
        idNonce += 1;
        return bytes32(keccak256(abi.encodePacked(idNonce, now, blockhash(block.number - 1))));
    }

    function createUser(string memory _username) public payable onlyFee(createUserCost) {
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
        users[usernameBytes] = newUser;
        emit UserCreated(usernameBytes, now);
    }

    function updateUser(bytes32 _user, bytes32 _userInfo) public onlyUserVerified(_user) {
        users[_user].userInfo = _userInfo;
        emit UserUpdated(_user, _userInfo, now);
    }

    function userWithDraw(bytes32 _user, address payable _withdrawAddress) external onlyUserVerified(_user) {
        _withdrawAddress.transfer(users[_user].balance);
    }

    function createForum(bytes32 _user, string memory _forum, bytes32 _forumInfo)
        public payable onlyUserVerified(_user) onlyFee(createForumCost) {
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
            forums[forumBytes].owner == 0,
            "Forum already exists"
        );
        Forum memory newForum;
        newForum.name = forumBytes;
        newForum.forumInfo = _forumInfo;
        newForum.owner = _user;
        newForum.pinnedPosts = new bytes32[](3);
        forums[forumBytes] = newForum;
        emit ForumCreated(_user, forumBytes, now);
    }

    function lockForum(bytes32 _user, bytes32 _forum)
        public onlyUserVerified(_user) onlyForumExists(_forum){
        require(
            !forums[_forum].locked,
            "Forum locked"
        );
        require(
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        forums[_forum].locked = true;
        emit ForumLocked(_user, _forum, now);
    }

    function unlockForum(bytes32 _user, bytes32 _forum)
        public onlyUserVerified(_user) onlyForumExists(_forum){
        require(
            !forums[_forum].locked,
            "Forum not locked"
        );
        require(
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        forums[_forum].locked = false;
        emit ForumUnlocked(_user, _forum, now);
    }

    function transferForumOwnership(bytes32 _user, bytes32 _forum, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) {
        require(
            forums[_forum].owner == _user ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User not authorized"
        );
        forums[_forum].owner = _targetUser;
        emit ForumTransferred(_forum, _user, _targetUser, now);
    }

    function updateForum(bytes32 _user, bytes32 _forum, bytes32 _forumInfo)
        public onlyUserVerified(_user) onlyForumExists(_forum) {
        require(
            forums[_forum].moderators[_user].permissions[2] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        forums[_forum].forumInfo = _forumInfo;
        emit ForumUpdated(_user, _forum, _forumInfo, now);
    }
    
    function createPost(bytes32 _user, bytes32 _forum, bytes32 _post)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyFee(createPostCost) {
        bytes32 postId = generateId();
        Post memory newPost;
        newPost.post = _post;
        newPost.creator = _user;
        newPost.votes = 0;
        newPost.comments = 0;
        forums[_forum].posts[postId] = newPost;
        payoutPost(_forum, msg.value);
        emit PostCreated(_forum, _user, postId, now);
    }

    function lockPost(bytes32 _user, bytes32 _forum, bytes32 _postId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[6] ||
            isFullAdmin(_user),
            "User not authorized"
        );
        forums[_forum].posts[_postId].locked = true;
        emit PostLocked(_user, _forum, _postId, now);
    }

    function unlockPost(bytes32 _user, bytes32 _forum, bytes32 _postId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            forums[_forum].posts[_postId].locked,
            "Post not locked"
        );
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[6] ||
            isFullAdmin(_user),
            "User not authorized"
        );
        forums[_forum].posts[_postId].locked = false;
        emit PostUnlocked(_user, _forum, _postId, now);
    }

    function deletePost(bytes32 _user, bytes32 _forum, bytes32 _postId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[6] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        delete forums[_forum].posts[_postId];
        emit PostDeleted(_forum, _user, _postId, now);
    }
    
    function getPost(bytes32 _forum, bytes32 _postId)
        public view returns (bytes32 post, bytes32 creator, uint16 votes, uint16 comments, bool locked) {
        post = forums[_forum].posts[_postId].post;
        creator = forums[_forum].posts[_postId].creator;
        votes = forums[_forum].posts[_postId].votes;
        comments = forums[_forum].posts[_postId].comments;
        locked = forums[_forum].posts[_postId].locked;
    }
    
    function getForumPinnedPosts(bytes32 _forum) public view returns (bytes32 post1, bytes32 post2, bytes32 post3) {
        post1 = forums[_forum].pinnedPosts[0];
        post2 = forums[_forum].pinnedPosts[1];
        post3 = forums[_forum].pinnedPosts[2];
    }

    function upvote(bytes32 _forum, bytes32 _user, bytes32 _postId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyPostExists(_forum, _postId) onlyFee(voteCost) {
        forums[_forum].posts[_postId].votes += 1;
        payoutVote(_forum, _postId, msg.value);
    }

    function downvote(bytes32 _forum, bytes32 _user, bytes32 _postId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyPostExists(_forum, _postId) onlyFee(voteCost) {
        forums[_forum].posts[_postId].votes -= 1;
        payoutVote(_forum, _postId, msg.value);
    }

    function createComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _comment, bytes32 _targetId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyPostExists(_forum, _postId) onlyFee(createCommentCost) {
        bytes32 commentId = generateId();
        Comment memory newComment;
        newComment.comment = _comment;
        newComment.creator = _user;
        forums[_forum].comments[commentId] = newComment;
        forums[_forum].posts[_postId].comments += 1;
        payoutComment(_forum, _postId, _targetId, msg.value);
        emit CommentCreated(_postId, _user, _targetId, commentId, now);
    }

    function deleteComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyCommentExists(_forum, _commentId) {
        require(
            admins[_user].permissions[5] ||
            isFullAdmin(_user) ||
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User not authorized"
        );
        delete forums[_forum].comments[_commentId];
        emit CommentDeleted(_forum, _user, _postId, _commentId, now);
    }

    function getComment(bytes32 _forum, bytes32 _commentId) public view returns (bytes32 comment, bytes32 creator) {
        comment = forums[_forum].comments[_commentId].comment;
        creator = forums[_forum].comments[_commentId].creator;
    }

    function reportUser(bytes32 _user, bytes32 _targetUser, bytes32 _reason)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) {
        require(
            !banned[_user],
            "User banned"
        );
        emit ReportUser(_targetUser, _reason, now);
    }

    function reportForum(bytes32 _user, bytes32 _forum, bytes32 _reason)
        public onlyUserVerified(_user) onlyForumExists(_forum) {
        require(
            !banned[_user],
            "User banned"
        );
        emit ReportForum(_forum, _reason, now);
    }

    function reportPost(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _reason)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            !banned[_user],
            "User banned"
        );
        emit ReportPost(_forum, _postId, _reason, now);
    }

    function reportComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId, bytes32 _reason)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyCommentExists(_forum, _commentId) {
        require(
            !banned[_user],
            "User banned"
        );
        emit ReportComment(_forum, _postId, _commentId, _reason, now);
    }

    function isModerator(bytes32 _user, bytes32 _forum) internal view returns(bool) {
        if(forums[_forum].moderatorList.length == 0) return false;
        return (forums[_forum].moderatorList[forums[_forum].moderators[_user].listPointer] == _user);
    }

    function isFullModerator(bytes32 _user, bytes32 _forum) internal view returns(bool) {
        return (forums[_forum].moderators[_user].permissions[0] || forums[_forum].owner == _user);
    }

    function checkModeratorWage(uint _totalWage, uint _wage) internal pure returns(bool) {
        require(_wage >= 0, "Negative wage");
        return (_totalWage + _wage) <= 100;
    }

    function getModerator(bytes32 _user, bytes32 _forum)
        public view  onlyForumExists(_forum) returns(bool fullModerator, bool access, bool config, bool mail, bool flair, bool posts, uint wage) {
        if (_user == forums[_forum].owner) {
            fullModerator = true;
            access = true;
            config = true;
            mail = true;
            flair = true;
            posts = true;
            wage = 100 - forums[_forum].moderatorWages;
        } else {
            fullModerator = forums[_forum].moderators[_user].permissions[0];
            access = forums[_forum].moderators[_user].permissions[1];
            config = forums[_forum].moderators[_user].permissions[2];
            mail = forums[_forum].moderators[_user].permissions[3];
            flair = forums[_forum].moderators[_user].permissions[4];
            posts = forums[_forum].moderators[_user].permissions[5];
            wage = forums[_forum].moderators[_user].wage;
        }
    }
    
    function getModerators(bytes32 _forum) public view onlyForumExists(_forum) returns(bytes32[] memory) {
        bytes32[] memory currentModerators = new bytes32[](forums[_forum].moderatorList.length + 1);
        currentModerators[0] = forums[_forum].owner;
        for (uint i = 1;i < forums[_forum].moderatorList.length + 1; i++) {
            currentModerators[i] = forums[_forum].moderatorList[i];
        }
        return currentModerators;
    }

    function PinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        forums[_forum].pinnedPosts[_postIndex] = _postId;
        emit PostPinned(_forum, _user, _postId, now);
    }

    function UnpinPost(bytes32 _user, bytes32 _forum, uint _postIndex)
        public onlyUserVerified(_user) onlyForumExists(_forum) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        bytes32 currentPost = forums[_forum].pinnedPosts[_postIndex];
        delete forums[_forum].pinnedPosts[_postIndex];
        emit PostUnpinned(_forum, _user, currentPost, now);
    }

    function createModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions, uint _wage)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) onlyUserAuthorized(_targetUser, _forum){
        require(
            !isModerator(_targetUser, _forum),
            "User already moderator"
        );
        require(
            isFullModerator(_forum, _user),
            "User does not have permission"
        );
        require(
            checkModeratorWage((forums[_forum].totalModeratorWages - forums[_forum].moderators[_targetUser].wage), _wage),
            "Wage exceeds budget"
        );
        forums[_forum].moderators[_targetUser].permissions = _permissions;
        forums[_forum].moderators[_targetUser].wage = _wage;
        forums[_forum].moderators[_targetUser].listPointer = forums[_forum].moderatorList.push(_targetUser) - 1;
        emit ModeratorCreated(_forum, _user, _targetUser, _permissions, _wage, now);
    }

    function updateModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions, uint _wage)
        public {
        require(
            !isModerator(_targetUser, _forum),
            "User not moderator"
        );
        require(
            isFullModerator(_forum, _user),
            "User does not have permission"
        );
        require(
            checkModeratorWage((forums[_forum].totalModeratorWages - forums[_forum].moderators[_targetUser].wage), _wage),
            "Wage exceeds budget"
        );
        forums[_forum].moderators[_targetUser].permissions = _permissions;
        forums[_forum].moderators[_targetUser].wage = _wage;
        emit ModeratorUpdated(_forum, _user, _targetUser, _permissions, _wage, now);
    }

    function removeModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) {
        require(
            isModerator(_targetUser, _forum),
            "User not moderator"
        );
        require(
            isFullModerator(_forum, _user) ||
            admins[_user].permissions[5],
            "User does not have permission"
        );
        uint rowToDelete = forums[_forum].moderators[_targetUser].listPointer;
        bytes32 keyToMove = forums[_forum].moderatorList[forums[_forum].moderatorList.length-1];
        forums[_forum].moderatorList[rowToDelete] = keyToMove;
        forums[_forum].moderators[keyToMove].listPointer = rowToDelete;
        forums[_forum].moderatorList.length--;
        delete forums[_forum].moderators[_targetUser];
        emit ModeratorRemoved(_forum, _user, _targetUser, now);
    }

    function moderatorBan(bytes32 _user, bytes32 _targetUser, bytes32 _forum)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) {
        require(
            !forums[_forum].banned[_targetUser],
            "Target banned"
        );
        require(
            forums[_forum].moderators[_user].permissions[1] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        forums[_forum].banned[_targetUser] = true;
        emit ModeratorBan(_user, _forum, _targetUser, now);
    }

    function moderatorUnban(bytes32 _user, bytes32 _targetUser, bytes32 _forum)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) {
        require(
            forums[_forum].banned[_targetUser],
            "Target not banned"
        );
        require(
            forums[_forum].moderators[_user].permissions[1] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        forums[_forum].banned[_targetUser] = false;
        emit ModeratorUnban(_user, _forum, _targetUser, now);
    }

    function isAdmin(bytes32 _user) internal view returns(bool) {
        if(adminList.length == 0) return false;
        return (adminList[admins[_user].listPointer] == _user);
    }

    function isFullAdmin(bytes32 _user) internal view returns(bool) {
        return (admins[_user].permissions[0] || _user == ownerAccount);
    }

    function checkAdminWage(uint _totalWage, uint _wage) internal pure returns(bool) {
        require(_wage >= 0, "Negative wage");
        return (_totalWage + _wage) <= 100;
    }

    function getAdmin(bytes32 _user)
        public view returns(bool fullAdmin, bool access, bool config, bool mail, bool flair, bool forum, bool posts, uint wage) {
        if (_user == ownerAccount) {
            fullAdmin = true;
            access = true;
            config = true;
            mail = true;
            flair = true;
            posts = true;
            forum = true;
            wage = 100 - adminWages;
        } else {
            fullAdmin = admins[_user].permissions[0];
            access = admins[_user].permissions[1];
            config = admins[_user].permissions[2];
            mail = admins[_user].permissions[3];
            flair = admins[_user].permissions[4];
            posts = admins[_user].permissions[5];
            forum = admins[_user].permissions[6];
            wage = admins[_user].wage;
        }
    }
    
    function getAdmins() public view returns(bytes32[] memory) {
        bytes32[] memory currentAdmins = new bytes32[](adminList.length + 1);
        currentAdmins[0] = ownerAccount;
        for (uint i = 1;i < adminList.length + 1; i++) {
            currentAdmins[i] = adminList[i];
        }
        return currentAdmins;
    }

    function createAdmin(bytes32 _user, bytes32 _targetUser, bool[] memory _permissions, uint _wage)
    public onlyUserVerified(_user) onlyUserExists(_targetUser) {
        require(
            !isAdmin(_targetUser),
            "User already admin"
        );
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        admins[_targetUser].permissions = _permissions;
        admins[_targetUser].wage = _wage;
        admins[_targetUser].listPointer = adminList.push(_targetUser) - 1;
        emit AdminCreated(_user, _targetUser, _permissions, now);
    }

    function updateAdmin(bytes32 _user, bytes32 _targetUser, bool[] memory _permissions, uint _wage) public {
        require(
            isAdmin(_targetUser),
            "User not admin"
        );
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        require(
            checkAdminWage((totalAdminWages - admins[_targetUser].wage), _wage),
            "Wage exceeds budget"
        );
        admins[_targetUser].permissions = _permissions;
        admins[_targetUser].wage = _wage;
        emit AdminUpdated(_user, _targetUser, _permissions, _wage, now);
    }

    function removeAdmin(bytes32 _user, bytes32 _targetUser) public onlyUserVerified(_user) onlyUserExists(_targetUser) {
        require(isAdmin(_targetUser), "User not admin");
        require(isFullAdmin(_user), "User does not have permission");
        uint rowToDelete = admins[_targetUser].listPointer;
        bytes32 keyToMove = adminList[adminList.length-1];
        adminList[rowToDelete] = keyToMove;
        admins[keyToMove].listPointer = rowToDelete;
        adminList.length--;
        delete admins[_targetUser];
        emit AdminRemoved(_user, _targetUser, now);
    }

    function adminBan(bytes32 _user, bytes32 _targetUser) public onlyUserVerified(_user) onlyUserExists(_targetUser) {
        require(
            !banned[_targetUser],
            "User is already banned"
        );
        require(
            admins[_user].permissions[1] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        banned[_targetUser] = true;
        emit AdminBan(_user, _targetUser, now);
    }

    function adminUnban(bytes32 _user, bytes32 _targetUser) public onlyUserVerified(_user) onlyUserExists(_targetUser) {
        require(
            banned[_targetUser],
            "User is not banned"
        );
        require(
            admins[_user].permissions[1] ||
            isFullAdmin(_user),
            "User does not have permission"
        );

        banned[_targetUser] = false;
        emit AdminUnban(_user, _targetUser, now);
    }

    function payoutAdmins(bytes32 _user) external onlyUserVerified(_user) {
        require(
            adminBalance >= 0,
            "Balance 0"
        );
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        uint currentAdminBalance = adminBalance;
        uint ownerWage = currentAdminBalance * (100 - adminWages) / 100;
        uint currentAdminWages = currentAdminBalance - ownerWage;
        uint remainderAdminWages = (100 - totalAdminWages) / adminList.length;

        for (uint i = 0; i < adminList.length; i++) {
            uint currentAdminWage = (currentAdminWages * admins[adminList[i]].wage / 100) + remainderAdminWages;
            users[adminList[i]].balance += currentAdminWage;
            emit AdminPaid(_user, adminList[i], currentAdminWage, now);
        }

        users[ownerAccount].balance += ownerWage;
        adminBalance = 0;
        emit AdminsPaid(_user, currentAdminBalance, now);
    }

    function payoutModerators(bytes32 _user, bytes32 _forum) public onlyUserVerified(_user) onlyForumExists(_forum) {
        require(
            forums[_forum].balance >= 0,
            "Forum balance 0"
        );
        require(
            isFullModerator(_forum, _user),
            "User does not have permission"
        );
        uint currentForumBalance = forums[_forum].balance;
        uint ownerWage = currentForumBalance * (100 - forums[_forum].moderatorWages) / 100;
        uint totalModeratorWages = currentForumBalance - ownerWage;
        uint remainderModeratorWages = (100 - forums[_forum].totalModeratorWages) / forums[_forum].moderatorList.length;

        for (uint i = 0; i < forums[_forum].moderatorList.length; i++) {
            uint currentModeratorWage =
                (totalModeratorWages * forums[_forum].moderators[forums[_forum].moderatorList[i]].wage / 100) + remainderModeratorWages;
            users[forums[_forum].moderatorList[i]].balance += currentModeratorWage;
            emit ModeratorPaid(_user, forums[_forum].moderatorList[i], currentModeratorWage, now);
        }

        users[forums[_forum].owner].balance += ownerWage;
        forums[_forum].balance = 0;
        emit ModeratorsPaid(_user, _forum, currentForumBalance, now);
    }

    function payoutPost(bytes32 _forum, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = _value - adminCut;
        adminBalance += adminCut;
        forums[_forum].balance += forumCut;
    }

    function payoutComment(bytes32 _forum, bytes32 _postId, bytes32 _targetId, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = (_value - adminCut) / 2;
        uint postCut = _value - adminCut - forumCut;
        adminBalance += adminCut;
        forums[_forum].balance += forumCut;
        if (_postId == _targetId) {
            users[forums[_forum].posts[_postId].creator].balance += postCut;
        } else {
            users[forums[_forum].comments[_targetId].creator].balance += postCut;
        }
    }

    function payoutVote(bytes32 _forum, bytes32 _postId, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = (_value - adminCut) / 2;
        uint postCut = _value - adminCut - forumCut;
        adminBalance += adminCut;
        forums[_forum].balance += forumCut;
        users[forums[_forum].posts[_postId].creator].balance += postCut;
    }

    function setCreateUserCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) {
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        createUserCost = _newCost;
        emit UpdateFee(_user, "user", createUserCost);
    }
    
    function setCreateForumCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) {
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        createForumCost = _newCost;
        emit UpdateFee(_user, "forum", createForumCost);
    }
    
    function setCreatePostCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) {
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        createPostCost = _newCost;
        emit UpdateFee(_user, "post", createPostCost);
    }
    
    function setCreateCommentCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) {
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        createCommentCost = _newCost;
        emit UpdateFee(_user, "comment", createCommentCost);
    }
    
    function setVoteCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) {
        require(
            isFullAdmin(_user),
            "User does not have permission"
        );
        voteCost = _newCost;
        emit UpdateFee(_user, "vote", voteCost);
    }
}