pragma solidity ^0.5.2;

import "./Ownable.sol";

contract Tartarus is Ownable {
    event TartarusPaid (uint amount, uint time);
    event AdminCreated (bytes32 user, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event AdminUpdated (bytes32 user, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event AdminRemoved (bytes32 user, bytes32 targetUser, uint time);
    event AdminBan (bytes32 user, bytes32 targetUser, uint time);
    event AdminUnban (bytes32 user, bytes32 targetUser, uint time);
    event AdminPaid (bytes32 user, bytes32 targetUser, uint amount, uint time);
    event ModeratorCreated (bytes32 indexed forum, bytes32 user, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event ModeratorUpdated (bytes32 indexed forum, bytes32 userm, bytes32 targetUser, bool[] permissions, uint wage, uint time);
    event ModeratorRemoved (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event ModeratorBan (bytes32 user, bytes32 indexed forum, bytes32 targetUser, uint time);
    event ModeratorUnban (bytes32 user, bytes32 indexed forum, bytes32 targetUser, uint time);
    event ModeratorPaid (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint amount, uint time);
    event UserCreated (bytes32 indexed user, uint time);
    event UserUpdated(bytes32 indexed user, bytes32 newInfo, uint time);
    event UserWithdraw(bytes32 indexed user, uint amount, uint time);
    event ForumCreated (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumLocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumUnlocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumUpdated (bytes32 user, bytes32 indexed forum, bytes32 newInfo, uint time);
    event ForumTransferred (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event PostCreated (bytes32 indexed forum, bytes32 indexed creator, bytes32 indexed postId, uint time);
    event PostDeleted (bytes32 indexed forum, bytes32 user, bytes32 postId, uint time);
    event UserVoted (bytes32 indexed forum, bytes32 indexed user, bytes32 indexed contentId, uint time);
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
    bytes32 public ownerAccount;
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
        uint userBalance;
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
        uint lastPaid;
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
        uint lastPaid;
        uint listPointer;
    }
    
    struct Forum {
        bytes32 name;
        bytes32 forumInfo;
        bytes32 owner;
        uint totalModeratorWages;
        uint forumBalance;
        bool locked;
        bytes32[] pinnedPosts;
        bytes32[] moderatorList;
        mapping(bytes32 => Moderator) moderators;
        mapping(bytes32 =>  bool) banned;
        mapping(bytes32 => Post) posts;
        mapping(bytes32 => Comment) comments;
        mapping(bytes32 => uint) upvotes;
        mapping(bytes32 => uint) downvotes;
        mapping(bytes32 => uint) commentCount;
        mapping(bytes32 => bool) postLocked;
        mapping(bytes32 => mapping(bytes32 => bool)) upvoted;
        mapping(bytes32 => mapping(bytes32 => bool)) downvoted;
    }

    struct Post {
        bytes32 post;
        bytes32 creator;
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

    function isAdmin(bytes32 _user) public view returns(bool) {
        if (adminList.length != 0) {
            return (
                adminList[admins[_user].listPointer] == _user ||
                ownerAccount == _user
            );
        } else {
            return ownerAccount == _user;
        }
        
    }

    modifier onlyAdminAuthorized(bytes32 _user, uint _permissionIndex) {
        _isAdminAuthorized(_user, _permissionIndex);
        _;
    }

    function _isAdminAuthorized(bytes32 _user, uint _adminIndex) internal view {
        require(
            _user == ownerAccount ||
            admins[_user].permissions[0] ||
            admins[_user].permissions[_adminIndex],
            "Not admin"
        );
    }
    
    function isModerator(bytes32 _user, bytes32 _forum) public view returns(bool) {
        if (forums[_forum].moderatorList.length != 0) {
            return (
                forums[_forum].moderatorList[forums[_forum].moderators[_user].listPointer] == _user ||
                forums[_forum].owner == _user
            );
        } else {
            return forums[_forum].owner == _user;
        }
        
    }

    modifier onlyModeratorAuthorized(bytes32 _user, bytes32 _forum, uint _moderatorIndex, uint _adminIndex) {
        _isModeratorAuthorized(_user, _forum, _moderatorIndex, _adminIndex);
        _;
    }

    function _isModeratorAuthorized(bytes32 _user, bytes32 _forum, uint _moderatorIndex, uint _adminIndex) internal view {
        require(
            forums[_forum].owner == _user ||
            forums[_forum].moderators[_user].permissions[0] ||
            forums[_forum].moderators[_user].permissions[_moderatorIndex] ||
            _user == ownerAccount ||
            admins[_user].permissions[0] ||
            admins[_user].permissions[_adminIndex],
            "User not authorized"
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
            !forums[_forum].postLocked[_postId],
            "Post does not exist/locked"
        );
    }
    
    modifier onlyNotVoted(bytes32 _forum, bytes32 _user, bytes32 _contentId) {
        _notVoted(_forum, _user, _contentId);
        _;
    }
    
    function _notVoted(bytes32 _forum, bytes32 _user, bytes32 _contentId) internal view {
        require(
            !forums[_forum].upvoted[_contentId][_user] && !forums[_forum].downvoted[_contentId][_user],
            "User already voted"
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

    modifier onlyWithinBudget(uint _currentTotal, uint _newWage) {
        _checkBudget(_currentTotal, _newWage);
        _;
    }
    
    function _checkBudget(uint _totalWage, uint _wage) internal pure {
        require(
            _wage >= 0 &&
            (_totalWage + _wage) <= 100,
            "Wage exceeds budget"
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
    
    function getUserVoted(bytes32 _forum, bytes32 _user, bytes32 _contentId) public view returns (bool upvoted, bool downvoted) {
        upvoted = forums[_forum].upvoted[_contentId][_user];
        downvoted = forums[_forum].downvoted[_contentId][_user];
    }

    function userWithdraw(bytes32 _user, address payable _withdrawAddress) external onlyUserVerified(_user) {
        uint amount = users[_user].userBalance;
        _withdrawAddress.transfer(users[_user].userBalance);
        users[_user].userBalance = 0;
        emit UserWithdraw(_user, amount, now);
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
        adminBalance += msg.value;
        emit ForumCreated(_user, forumBytes, now);
    }

    function lockForum(bytes32 _user, bytes32 _forum)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyAdminAuthorized(_user, 5) {
        forums[_forum].locked = true;
        emit ForumLocked(_user, _forum, now);
    }

    function unlockForum(bytes32 _user, bytes32 _forum)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyAdminAuthorized(_user, 5) {
        forums[_forum].locked = false;
        emit ForumUnlocked(_user, _forum, now);
    }

    function updateForum(bytes32 _user, bytes32 _forum, bytes32 _forumInfo)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyModeratorAuthorized(_user, _forum, 2, 5) {
        forums[_forum].forumInfo = _forumInfo;
        emit ForumUpdated(_user, _forum, _forumInfo, now);
    }

    function transferForumOwnership(bytes32 _user, bytes32 _forum, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) {
        require(
            forums[_forum].owner == _user ||
            admins[_user].permissions[5],
            "User not authorized"
        );
        forums[_forum].owner = _targetUser;
        emit ForumTransferred(_forum, _user, _targetUser, now);
    }
    
    function createPost(bytes32 _user, bytes32 _forum, bytes32 _post)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyFee(createPostCost) {
        bytes32 postId = generateId();
        Post memory newPost;
        newPost.post = _post;
        newPost.creator = _user;
        forums[_forum].posts[postId] = newPost;
        payoutPost(_forum, msg.value);
        emit PostCreated(_forum, _user, postId, now);
    }

    function changePostLock(bytes32 _user, bytes32 _forum, bytes32 _postId, bool _postState)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) onlyModeratorAuthorized(_user, _forum, 5, 6) {
        forums[_forum].postLocked[_postId] = _postState;
        emit PostLocked(_user, _forum, _postId, now);
    }

    function deletePost(bytes32 _user, bytes32 _forum, bytes32 _postId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) {
        require(
            user == forums[_forum].posts[_postId].creator ||
            forums[_forum].owner == _user;
            forums[_forum].moderators[_user].permissions[0] ||
            forums[_forum].moderators[_user].permissions[5] ||
            admins.ownerAccount == _user;
            admins[_user].permissions[0] ||
            admins[_user].permissions[6],
            "User does not have permission"
        );
        delete forums[_forum].posts[_postId];
        emit PostDeleted(_forum, _user, _postId, now);
    }

    function getPost(bytes32 _forum, bytes32 _postId)
        public view returns (bytes32 post, bytes32 creator, uint upvotes, uint downvotes, uint comments, bool locked) {
        post = forums[_forum].posts[_postId].post;
        creator = forums[_forum].posts[_postId].creator;
        upvotes = forums[_forum].upvotes[_postId];
        downvotes = forums[_forum].downvotes[_postId];
        comments = forums[_forum].commentCount[_postId];
        locked = forums[_forum].postLocked[_postId];
    }
    
    function getForumPinnedPosts(bytes32 _forum) public view returns (bytes32 post1, bytes32 post2, bytes32 post3) {
        post1 = forums[_forum].pinnedPosts[0];
        post2 = forums[_forum].pinnedPosts[1];
        post3 = forums[_forum].pinnedPosts[2];
    }
    
    // perhaps combine up/down vote functions

    function upvote(bytes32 _forum, bytes32 _user, bytes32 _contentId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyNotVoted(_forum, _user, _contentId) onlyFee(voteCost) {
        forums[_forum].upvotes[_contentId] += 1;
        forums[_forum].upvoted[_contentId][_user] = true;
        payoutVote(_forum, _contentId, msg.value);
        emit UserVoted(_forum, _user, _contentId, now);
    }

    function downvote(bytes32 _forum, bytes32 _user, bytes32 _contentId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyNotVoted(_forum, _user, _contentId) onlyFee(voteCost) {
        forums[_forum].downvotes[_contentId] += 1;
        forums[_forum].downvoted[_contentId][_user] = true;
        payoutVote(_forum, _contentId, msg.value);
        emit UserVoted(_forum, _user, _contentId, now);
    }

    function createComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _comment, bytes32 _targetId)
        public payable onlyUserVerified(_user) onlyForumExists(_forum) onlyUserAuthorized(_user, _forum) onlyPostExists(_forum, _postId) onlyFee(createCommentCost) {
        bytes32 commentId = generateId();
        Comment memory newComment;
        newComment.comment = _comment;
        newComment.creator = _user;
        forums[_forum].comments[commentId] = newComment;
        forums[_forum].commentCount[_postId] += 1;
        payoutComment(_forum, _postId, _targetId, msg.value);
        emit CommentCreated(_postId, _user, _targetId, commentId, now);
    }

    function deleteComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyCommentExists(_forum, _commentId) {
        require(
            _user == forums[_forum].posts[_postId].creator ||
            forums[_forum].owner == _user;
            forums[_forum].moderators[_user].permissions[0] ||
            forums[_forum].moderators[_user].permissions[5] ||
            admins.ownerAccount == _user
            admins[_user].permissions[0] ||
            admins[_user].permissions[6],
            "User does not have permission"
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

    function getModerator(bytes32 _user, bytes32 _forum)
        public view
        returns(bool fullModerator, bool access, bool config, bool mail, bool flair, bool posts, uint wage, uint lastPaid) {
        if (_user == forums[_forum].owner) {
            fullModerator = true;
            access = true;
            config = true;
            mail = true;
            flair = true;
            posts = true;
            wage = 100 - forums[_forum].totalModeratorWages;
            lastPaid = forums[_forum].moderators[_user].lastPaid;
        } else {
            fullModerator = forums[_forum].moderators[_user].permissions[0];
            access = forums[_forum].moderators[_user].permissions[1];
            config = forums[_forum].moderators[_user].permissions[2];
            mail = forums[_forum].moderators[_user].permissions[3];
            flair = forums[_forum].moderators[_user].permissions[4];
            posts = forums[_forum].moderators[_user].permissions[5];
            wage = forums[_forum].moderators[_user].wage;
            lastPaid = forums[_forum].moderators[_user].lastPaid;
        }
    }
    
    function getModerators(bytes32 _forum) public view returns(bytes32[] memory) {
        bytes32[] memory currentModerators = new bytes32[](forums[_forum].moderatorList.length + 1);
        currentModerators[0] = forums[_forum].owner;
        for (uint i = 0;i < forums[_forum].moderatorList.length; i++) {
            currentModerators[i + 1] = forums[_forum].moderatorList[i];
        }
        return currentModerators;
    }

    function PinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyPostExists(_forum, _postId) onlyModeratorAuthorized(_user, _forum, 5, 5) {
        forums[_forum].pinnedPosts[_postIndex] = _postId;
        emit PostPinned(_forum, _user, _postId, now);
    }

    function UnpinPost(bytes32 _user, bytes32 _forum, uint _postIndex)
        public onlyUserVerified(_user) onlyForumExists(_forum) onlyModeratorAuthorized(_user, _forum, 5, 5) {
        bytes32 currentPost = forums[_forum].pinnedPosts[_postIndex];
        delete forums[_forum].pinnedPosts[_postIndex];
        emit PostUnpinned(_forum, _user, currentPost, now);
    }

    function createModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions, uint _wage)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum)
            onlyWithinBudget(forums[_forum].totalModeratorWages, _wage) onlyModeratorAuthorized(_user, _forum, 0, 5) {
        require(
            !isModerator(_targetUser, _forum),
            "User already moderator"
        );
        forums[_forum].moderators[_targetUser].permissions = _permissions;
        forums[_forum].moderators[_targetUser].wage = _wage;
        forums[_forum].moderators[_targetUser].lastPaid = forums[_forum].forumBalance;
        forums[_forum].totalModeratorWages += _wage;
        forums[_forum].moderators[_targetUser].listPointer = forums[_forum].moderatorList.push(_targetUser) - 1;
        emit ModeratorCreated(_forum, _user, _targetUser, _permissions, _wage, now);
    }

    function updateModeratorPermissions(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions)
        public onlyUserVerified(_user) onlyModeratorAuthorized(_user, _forum, 0, 5) {
        require(
            isModerator(_targetUser, _forum),
            "User not moderator"
        );
        forums[_forum].moderators[_targetUser].permissions = _permissions;
        emit ModeratorUpdated(_forum, _user, _targetUser, _permissions, forums[_forum].moderators[_targetUser].wage, now);
    }

    function updateModeratorWage(bytes32 _user, bytes32 _forum, bytes32 _targetUser, uint _wage)
        public onlyUserVerified(_user) onlyModeratorAuthorized(_user, _forum, 0, 5)
            onlyWithinBudget((forums[_forum].totalModeratorWages - forums[_forum].moderators[_targetUser].wage), _wage){
        require(
            isModerator(_targetUser, _forum),
            "User not moderator"
        );
        moderatorDisburse(_user, _targetUser, _forum);
        forums[_forum].totalModeratorWages = forums[_forum].totalModeratorWages - forums[_forum].moderators[_targetUser].wage + _wage;
        forums[_forum].moderators[_targetUser].wage = _wage;
        emit ModeratorUpdated(_forum, _user, _targetUser, forums[_forum].moderators[_targetUser].permissions, _wage, now);
    }

    function removeModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) onlyModeratorAuthorized(_user, _forum, 0, 5) {
        require(
            isModerator(_targetUser, _forum),
            "User not moderator"
        );
        moderatorDisburse(_user, _targetUser, _forum);
        forums[_forum].totalModeratorWages = forums[_forum].totalModeratorWages - forums[_forum].moderators[_user].wage;
        uint rowToDelete = forums[_forum].moderators[_targetUser].listPointer;
        bytes32 keyToMove = forums[_forum].moderatorList[forums[_forum].moderatorList.length-1];
        forums[_forum].moderatorList[rowToDelete] = keyToMove;
        forums[_forum].moderators[keyToMove].listPointer = rowToDelete;
        forums[_forum].moderatorList.length--;
        delete forums[_forum].moderators[_targetUser];
        emit ModeratorRemoved(_forum, _user, _targetUser, now);
    }

    function moderatorBan(bytes32 _user, bytes32 _targetUser, bytes32 _forum)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) onlyModeratorAuthorized(_user, _forum, 1, 5) {
        require(
            forums[_forum].owner != _targetUser &&
            !forums[_forum].banned[_targetUser] &&
            !isModerator(_targetUser, _forum),
            "Target banned"
        );
        forums[_forum].banned[_targetUser] = true;
        emit ModeratorBan(_user, _forum, _targetUser, now);
    }

    function moderatorUnban(bytes32 _user, bytes32 _targetUser, bytes32 _forum)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyForumExists(_forum) onlyModeratorAuthorized(_user, _forum, 1, 5) {
        require(
            forums[_forum].banned[_targetUser],
            "Target not banned"
        );
        forums[_forum].banned[_targetUser] = false;
        emit ModeratorUnban(_user, _forum, _targetUser, now);
    }

    function getAdmin(bytes32 _user)
        public view returns(bool fullAdmin, bool access, bool config, bool mail, bool flair, bool forum, bool posts, uint wage, uint lastPaid) {
        if (_user == ownerAccount) {
            fullAdmin = true;
            access = true;
            config = true;
            mail = true;
            flair = true;
            posts = true;
            forum = true;
            wage = 100 - adminWages;
            lastPaid = admins[_user].lastPaid;
        } else {
            fullAdmin = admins[_user].permissions[0];
            access = admins[_user].permissions[1];
            config = admins[_user].permissions[2];
            mail = admins[_user].permissions[3];
            flair = admins[_user].permissions[4];
            posts = admins[_user].permissions[5];
            forum = admins[_user].permissions[6];
            wage = admins[_user].wage;
            lastPaid = admins[_user].lastPaid;
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
    public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 0) onlyWithinBudget(totalAdminWages, _wage) {
        require(
            ownerAccount != _targetUser &&
            !isAdmin(_targetUser),
            "User already admin"
        );
        totalAdminWages += _wage;
        admins[_targetUser].permissions = _permissions;
        admins[_targetUser].wage = _wage;
        admins[_targetUser].lastPaid = adminBalance;
        admins[_targetUser].listPointer = adminList.push(_targetUser) - 1;
        emit AdminCreated(_user, _targetUser, _permissions, _wage, now);
    }

    function updateAdminWage(bytes32 _user, bytes32 _targetUser, uint _wage)
    public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 0) onlyWithinBudget((totalAdminWages - admins[_targetUser].wage), _wage) {
        require(
            isAdmin(_targetUser) &&
            ownerAccount != _targetUser,
            "Invalid target"
        );
        adminDisburse(_user, _targetUser);
        totalAdminWages = totalAdminWages - admins[_targetUser].wage + _wage;
        admins[_targetUser].wage = _wage;
        emit AdminUpdated(_user, _targetUser, admins[_targetUser].permissions, _wage, now);
    }

    function updateAdminPermissions(bytes32 _user, bytes32 _targetUser, bool[] memory _permissions)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 0) {
        require(
            isAdmin(_targetUser) &&
            ownerAccount != _targetUser,
            "Invalid target"
        );
        admins[_targetUser].permissions = _permissions;
        emit AdminUpdated(_user, _targetUser, _permissions, admins[_targetUser].wage, now);
    }

    function removeAdmin(bytes32 _user, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 0) {
        require(
            isAdmin(_targetUser) &&
            ownerAccount != _targetUser,
            "Invalid target"
        );
        adminDisburse(_user, _targetUser);
        totalAdminWages = totalAdminWages - admins[_targetUser].wage;
        uint rowToDelete = admins[_targetUser].listPointer;
        bytes32 keyToMove = adminList[adminList.length-1];
        adminList[rowToDelete] = keyToMove;
        admins[keyToMove].listPointer = rowToDelete;
        adminList.length--;
        delete admins[_targetUser];
        emit AdminRemoved(_user, _targetUser, now);
    }

    function adminBan(bytes32 _user, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 1) {
        require(
            !banned[_targetUser] &&
            ownerAccount != _targetUser &&
            !isAdmin(_targetUser),
            "Invalid ban target"
        );
        banned[_targetUser] = true;
        emit AdminBan(_user, _targetUser, now);
    }

    function adminUnban(bytes32 _user, bytes32 _targetUser)
        public onlyUserVerified(_user) onlyUserExists(_targetUser) onlyAdminAuthorized(_user, 1) {
        require(
            !banned[_targetUser],
            "Invalid ban target"
        );
        banned[_targetUser] = false;
        emit AdminUnban(_user, _targetUser, now);
    }
    
    function adminDisburse(bytes32 _user, bytes32 _targetUser) internal {
        require(
            isAdmin(_targetUser),
            "User not admin"
        );
        uint adminWage = admins[_targetUser].wage;
        uint adminPay = adminWage / 100 * (adminBalance - admins[_targetUser].lastPaid);
        admins[_targetUser].lastPaid = adminBalance;
        users[_targetUser].userBalance += adminPay;
        emit AdminPaid(_user, _targetUser, adminPay, now);
    }

    function adminWithdraw(bytes32 _user) public onlyUserVerified(_user) {
        require(
            isAdmin(_user),
            "User not admin"
        );
        uint adminWage;
        if (ownerAccount == _user) {
            adminWage = 100 - totalAdminWages;
        } else {
            adminWage = admins[_user].wage;
        }
        uint adminPay = adminWage / 100 * (adminBalance - admins[_user].lastPaid);
        admins[_user].lastPaid = adminBalance;
        users[_user].userBalance += adminPay;
        emit AdminPaid(_user, _user, adminPay, now);
    }

    function moderatorDisburse(bytes32 _user, bytes32 _targetUser, bytes32 _forum) internal {
        require(
            isModerator(_targetUser, _forum),
            "User not moderator"
        );
        uint moderatorWage = forums[_forum].moderators[_targetUser].wage;
        uint moderatorPay = moderatorWage / 100 * (forums[_forum].forumBalance - forums[_forum].moderators[_targetUser].lastPaid);
        forums[_forum].moderators[_targetUser].lastPaid = forums[_forum].forumBalance;
        users[_targetUser].userBalance += moderatorPay;
        emit ModeratorPaid(_forum, _user, _targetUser, moderatorPay, now);
    }

    function moderatorWithdraw(bytes32 _user, bytes32 _forum) public onlyUserVerified(_user) onlyForumExists(_forum) {
        require(
            isModerator(_user, _forum),
            "User not moderator"
        );
        uint moderatorWage;
        if (forums[_forum].owner == _user) {
            moderatorWage = 100 - forums[_forum].totalModeratorWages;
        } else {
            moderatorWage = forums[_forum].moderators[_user].wage;
        }
        uint moderatorPay = moderatorWage / 100 * (forums[_forum].forumBalance - forums[_forum].moderators[_user].lastPaid);
        forums[_forum].moderators[_user].lastPaid = forums[_forum].forumBalance;
        users[_user].userBalance += moderatorPay;
        emit ModeratorPaid(_forum, _user, _user, moderatorPay, now);
    }

    function payoutPost(bytes32 _forum, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = _value - adminCut;
        adminBalance += adminCut;
        forums[_forum].forumBalance += forumCut;
    }

    function payoutComment(bytes32 _forum, bytes32 _postId, bytes32 _targetId, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = (_value - adminCut) / 2;
        uint postCut = _value - adminCut - forumCut;
        adminBalance += adminCut;
        forums[_forum].forumBalance += forumCut;
        if (_postId == _targetId) {
            users[forums[_forum].posts[_postId].creator].userBalance += postCut;
        } else {
            users[forums[_forum].comments[_targetId].creator].userBalance += postCut;
        }
    }

    function payoutVote(bytes32 _forum, bytes32 _postId, uint _value) internal {
        uint adminCut = _value / 2;
        uint forumCut = (_value - adminCut) / 2;
        uint postCut = _value - adminCut - forumCut;
        adminBalance += adminCut;
        forums[_forum].forumBalance += forumCut;
        users[forums[_forum].posts[_postId].creator].userBalance += postCut;
    }

    function setCreateUserCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) onlyAdminAuthorized(_user, 0) {
        createUserCost = _newCost;
        emit UpdateFee(_user, "user", createUserCost);
    }

    function setCreateForumCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) onlyAdminAuthorized(_user, 0) {
        createForumCost = _newCost;
        emit UpdateFee(_user, "forum", createForumCost);
    }

    function setCreatePostCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) onlyAdminAuthorized(_user, 0) {
        createPostCost = _newCost;
        emit UpdateFee(_user, "post", createPostCost);
    }

    function setCreateCommentCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) onlyAdminAuthorized(_user, 0) {
        createCommentCost = _newCost;
        emit UpdateFee(_user, "comment", createCommentCost);
    }

    function setVoteCost(bytes32 _user, uint _newCost) public onlyUserVerified(_user) onlyAdminAuthorized(_user, 0) {
        voteCost = _newCost;
        emit UpdateFee(_user, "vote", voteCost);
    }
}