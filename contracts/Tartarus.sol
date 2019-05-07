pragma solidity ^0.5.2;

import "./Ownable.sol";

contract Tartarus is Ownable {
    event AdminCreated (bytes32 user, bytes32 targetUser, uint time);
    event AdminUpdated (bytes32 user, bytes32 targetUser, uint time);
    event AdminRemoved (bytes32 user, bytes32 targetUser, uint time);
    event ModeratorCreated (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event ModeratorRemoved (bytes32 indexed forum, bytes32 user, bytes32 targetUser, uint time);
    event UserCreated (bytes32 indexed user, uint time);
    event UserInfoEdited(bytes32 indexed user, bytes32 oldInfo, bytes32 newInfo, uint time);
    event UserBanned (bytes32 indexed user, uint time);
    event UserForumBanned (bytes32 indexed forum, bytes32 user, uint time);
    event ForumCreated (bytes32 indexed forum, uint time);
    event ForumLocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumUnlocked (bytes32 indexed user, bytes32 indexed forum, uint time);
    event ForumInfoEdited (bytes32 indexed forum, bytes32 oldInfo, bytes32 newInfo, uint time);
    event ForumDescriptionEdited (bytes32 indexed forum, bytes32 oldDescription, bytes32 newDescription, uint time);
    event PostCreated (bytes32 indexed forum, bytes32 indexed creator, bytes32 indexed postId, uint time);
    event PostLocked (bytes32 user, bytes32 indexed forum, bytes32 postId, uint time);
    event PostDeleted (bytes32 indexed forum, bytes32 postId, uint time);
    event PostPinned (bytes32 indexed forum, bytes32 postId, uint time);
    event PostUnpinned (bytes32 indexed forum, bytes32 postId, uint time);
    event CommentCreated (bytes32 indexed postId, bytes32 indexed creator, bytes32 indexed targetId, bytes32 commentId, uint time);
    event CommentDeleted (bytes32 indexed forumId, bytes32 postId, bytes32 commentId, uint time);
    event ReportUser (bytes32 user, bytes32 reason, uint time);
    event ReportForum (bytes32 forum, bytes32 reason, uint time);
    event ReportPost (bytes32 indexed _forum, bytes32 _postId, bytes32 reason, uint time);
    event ReportComment (bytes32 indexed _forum, bytes32 _postId, bytes32 _commentId, bytes32 reason, uint time);
    event UpdateFee (bytes32 user, string feeType, uint oldFee, uint newFee);

    mapping (bytes32 => Admin) public admins;
    mapping (bytes32 => bool) public banned;
    mapping (bytes32 => User) public users;
    mapping (bytes32 => Forum) public forums;
    bytes32[] adminList;
    bytes32 tartarusInfo;
    bytes32 ownerAccount;
    uint public adminBalance;
    uint public adminWages;
    uint public totalAdminWages;
    uint public createUserCost = 0.03 ether;
    uint public createForumCost = 0.03 ether;
    uint public createPostCost = 0.0003 ether;
    uint public createCommentCost = 0.00003 ether;
    uint public voteCost = 0.00003 ether;
    uint public idNonce = 0;

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
        bytes32[] pinnedPosts;
        bytes32[] moderatorList;
        uint moderatorWages;
        uint totalModeratorWages;
        uint balance;
        bool locked;
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
        owner = msg.sender;
        require(
            validateName(_username),
            "Invalid username"
        );
                
        bytes32 usernameBytes = stringToBytes32(_username);
        User memory newUser;
        newUser.username = usernameBytes;
        newUser.creator = msg.sender;
        users[usernameBytes] = newUser;
        ownerAccount = usernameBytes;
        emit UserCreated(usernameBytes, now);
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
            forums[_forum].owner != 0 &&
            !forums[_forum].locked, 
            "Forum does not exist"
        );
        _;
    }

    modifier postExists(bytes32 _forum, bytes32 _postId) {
        require(
            forums[_forum].posts[_postId].creator != 0, 
            "Post does not exist"
        );
        _;
    }

    modifier commentExists(bytes32 _forum, bytes32 _commentId) {
        require(
            forums[_forum].comments[_commentId].creator != 0, 
            "Comment does not exist"
        );
        _;
    }

    function validateName(string memory _name)
        internal pure returns (bool){
        string memory nameLower = _name;
        bytes memory b = bytes(nameLower);
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
    
    function stringToBytes32(string memory _source)
        internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(_source, 32))
        }
    }
    
    function generateId()
        internal returns(bytes32) {
        idNonce += 1;
        return bytes32(keccak256(abi.encodePacked(idNonce, now, blockhash(block.number - 1))));
    }
    
    function createUser(string memory _username)
        public payable requiresFee(createUserCost) {
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

    function editUserInfo(bytes32 _user, bytes32 _userInfo) 
        public userVerified(_user) {
        users[_user].userInfo = _userInfo;
    }
    
    function userWithDraw(bytes32 _user, address payable _withdrawAddress) 
        external userVerified(_user) {
        _withdrawAddress.transfer(users[_user].balance);
    }
    
    function createForum(bytes32 _user, string memory _forum, bytes32 _forumInfo) 
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
            forums[forumBytes].owner == 0,
            "Forum already exists"
        );
        Forum memory newForum;
        newForum.name = forumBytes;
        newForum.forumInfo = _forumInfo;
        newForum.owner = _user;
        newForum.pinnedPosts = new bytes32[](3);
        forums[forumBytes] = newForum;
        
        emit ForumCreated(forumBytes, now);
    }   

    function getForum(bytes32 _forum)
        public view returns (bytes32 forum, bytes32 forumInfo, uint moderatorWages, uint totalModeratorWages, uint balance, bool locked) {
        forum = forums[_forum].name;
        forumInfo = forums[_forum].forumInfo;
        moderatorWages = forums[_forum].moderatorWages;
        totalModeratorWages = forums[_forum].totalModeratorWages;
        balance = forums[_forum].balance;
        locked = forums[_forum].locked;
    }

    function lockForum(bytes32 _user, bytes32 _forum) 
        public userVerified(_user) forumExists(_forum){
        require(
            !forums[_forum].locked,
            "Forum locked"
        );
        require(
            forums[_forum].owner == _user || 
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        forums[_forum].locked = true;
        emit ForumLocked(_user, _forum, now);
    }  

    function unlockForum(bytes32 _user, bytes32 _forum) 
        public userVerified(_user) forumExists(_forum){
        require(
            !forums[_forum].locked,
            "Forum not locked"
        );
        require(
            forums[_forum].owner == _user || 
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        forums[_forum].locked = false;
        emit ForumUnlocked(_user, _forum, now);
    }  

    function transferForumOwnership(bytes32 _user, bytes32 _forum, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
        require(
            forums[_forum].owner == _user ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user), 
            "User not authorized"
        );
        forums[_forum].owner = _targetUser;
    }

    function setForumInfo(bytes32 _user, bytes32 _forum, bytes32 _forumInfo) 
        public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].permissions[2] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        emit ForumInfoEdited(_forum, forums[_forum].forumInfo, _forumInfo, now);
        forums[_forum].forumInfo = _forumInfo;
    }
    
    function createPost(bytes32 _user, bytes32 _forum, bytes32 _post) 
        public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) requiresFee(createPostCost) {
        bytes32 postId = generateId();
        Post memory newPost;
        newPost.post = _post;
        newPost.creator = _user;
        newPost.votes = 0;
        newPost.comments = 0;
        forums[_forum].posts[postId] = newPost;
        payoutForum(_forum, msg.value);
        emit PostCreated(_forum, _user, postId, now);
    }

    function deletePost(bytes32 _user, bytes32 _forum, bytes32 _postId) 
        public userVerified(_user) forumExists(_forum) postExists(_forum, _postId) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum) ||
            admins[_user].permissions[5] ||
            isFullAdmin(_user),
            "User does not have permission"
        );
        delete forums[_forum].posts[_postId];
        emit PostDeleted(_forum, _postId, now);
    }
    
    function getPost(bytes32 _forum, bytes32 _postId) 
        public view returns (bytes32 post, bytes32 creator, uint16 votes, uint16 comments, bool locked) {
        post = forums[_forum].posts[_postId].post;
        creator = forums[_forum].posts[_postId].creator;
        votes = forums[_forum].posts[_postId].votes;
        comments = forums[_forum].posts[_postId].comments;
        locked = forums[_forum].posts[_postId].locked;
    }

    // ???????
    // function adminPinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex) 
    //     public userVerified(_user) forumExists(_forum) postExists(_forum, _postId) {
    //     require(
    //         admins[_user].permissions[5] ||
    //         isFullAdmin(_user),
    //         "User does not have permission"
    //     );
    //     forums[_forum].pinnedPosts[_postIndex] = _postId;
    //     emit PostPinned(_forum, _postId, now);
    // }

    // function adminUnpinPost(bytes32 _user, bytes32 _forum, uint _postIndex) 
    //     public userVerified(_user) forumExists(_forum) {
    //     require(
    //         admins[_user].permissions[5] ||
    //         isFullAdmin(_user),
    //         "User does not have permission"
    //     );
    //     delete forums[_forum].pinnedPosts[_postIndex];
    //     emit PostUnpinned(_forum, forums[_forum].pinnedPosts[_postIndex], now);
    // }
    //
    // function getTartarusPinnedPosts() 
    //     public view returns (bytes32 post1, bytes32 post2, bytes32 post3) {
    //     post1 = pinnedPosts[0];
    //     post2 = pinnedPosts[1];
    //     post3 = pinnedPosts[2];
    // }
    
    function getForumPinnedPosts(bytes32 _forum) public view returns (bytes32 post1, bytes32 post2, bytes32 post3) {
        post1 = forums[_forum].pinnedPosts[0];
        post2 = forums[_forum].pinnedPosts[1];
        post3 = forums[_forum].pinnedPosts[2];
    }

    function upvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
        public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_forum, _postId) requiresFee(voteCost) {
        forums[_forum].posts[_postId].votes += 1;
        payoutPost(_forum, _postId, msg.value);
    }

    function downvote(bytes32 _forum, bytes32 _user, bytes32 _postId) 
        public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_forum, _postId) requiresFee(voteCost) {
        forums[_forum].posts[_postId].votes -= 1;
        payoutPost(_forum, _postId, msg.value);
    }

    function createComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _comment, bytes32 _targetId) 
        public payable userVerified(_user) forumExists(_forum) userUnbanned(_user, _forum) postExists(_forum, _postId) requiresFee(createCommentCost) {
        bytes32 commentId = generateId();
        Comment memory newComment;
        newComment.comment = _comment;
        newComment.creator = _user;
        forums[_forum].comments[commentId] = newComment;
        forums[_forum].posts[_postId].comments += 1;
        if (_postId == _targetId) {
            payoutPost(_forum, _postId, msg.value);
        } else {
            payoutComment(_forum, _postId, _targetId, msg.value);
        }
        emit CommentCreated(_postId, _user, _targetId, commentId, now);
    }

    function deleteComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId) 
        public userVerified(_user) forumExists(_forum) commentExists(_forum, _commentId) {
        require(
            admins[_user].permissions[5] ||
            isFullAdmin(_user) ||
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        delete forums[_forum].comments[_commentId];
        emit CommentDeleted(_forum, _postId, _commentId, now);
    }
    
    function getComment(bytes32 _forum, bytes32 _commentId) 
        public view returns (bytes32 comment, bytes32 creator) {
        comment = forums[_forum].comments[_commentId].comment;
        creator = forums[_forum].comments[_commentId].creator;
    } 

    function reportUser(bytes32 _user, bytes32 _targetUser, bytes32 _reason) 
        public userVerified(_user) userExists(_targetUser) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportUser(_user, _reason, now);
    }

    function reportForum(bytes32 _user, bytes32 _forum, bytes32 _reason) 
        public userVerified(_user) forumExists(_forum) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportForum(_forum, _reason, now);
    }

    function reportPost(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _reason) 
        public userVerified(_user) forumExists(_forum) postExists(_forum, _postId) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportPost(_forum, _postId, _reason, now);
    }

    function reportComment(bytes32 _user, bytes32 _forum, bytes32 _postId, bytes32 _commentId, bytes32 _reason) 
        public userVerified(_user) forumExists(_forum) commentExists(_forum, _commentId) {
        require(
            !banned[_user], 
            "User banned"
        );
        emit ReportComment(_forum, _postId, _commentId, _reason, now);
    }

    function isModerator(bytes32 _user, bytes32 _forum) 
        public view returns(bool) {
        if(forums[_forum].moderatorList.length == 0) return false;
        return (forums[_forum].moderatorList[forums[_forum].moderators[_user].listPointer] == _user);
    }

    function isFullModerator(bytes32 _user, bytes32 _forum) 
        public view returns(bool) {
        return (forums[_forum].moderators[_user].permissions[0] || forums[_forum].owner == _user);
    }

    function checkModeratorWage(uint _totalWage, uint _wage) 
        public pure returns(bool) {
        require(_wage >= 0, "Negative wage");
        return (_totalWage + _wage) <= 100;
    }

    function getModeratorCount(bytes32 _forum) 
        public view returns(uint moderatorCount) {
        return forums[_forum].moderatorList.length;
    }

    function getModeratorPermissions(bytes32 _user, bytes32 _forum) 
        public view returns(bool fullModerator, bool access, bool config, bool mail, bool flair, bool posts) {
        fullModerator = forums[_forum].moderators[_user].permissions[0];
        access = forums[_forum].moderators[_user].permissions[1];
        config = forums[_forum].moderators[_user].permissions[2];
        mail = forums[_forum].moderators[_user].permissions[3];
        flair = forums[_forum].moderators[_user].permissions[4];
        posts = forums[_forum].moderators[_user].permissions[5];
    }

    function moderatorPinPost(bytes32 _user, bytes32 _forum, bytes32 _postId, uint _postIndex) 
        public userVerified(_user) forumExists(_forum) postExists(_forum, _postId) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        forums[_forum].pinnedPosts[_postIndex] = _postId;
        emit PostPinned(_forum, _postId, now);
    }

    function moderatorUnpinPost(bytes32 _user, bytes32 _forum, uint _postIndex) 
        public userVerified(_user) forumExists(_forum) {
        require(
            forums[_forum].moderators[_user].permissions[5] ||
            isFullModerator(_user, _forum),
            "User does not have permission"
        );
        delete forums[_forum].pinnedPosts[_postIndex];
        emit PostUnpinned(_forum, forums[_forum].pinnedPosts[_postIndex], now);
    }

    function createModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions, uint _wage) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) userUnbanned(_targetUser, _forum){
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
        emit ModeratorCreated(_forum, _user, _targetUser, now);
    }

    function updateModeratorPermissions(bytes32 _user, bytes32 _forum, bytes32 _targetUser, bool[] memory _permissions) 
        public {
        require(
            !isModerator(_targetUser, _forum), 
            "User already moderator"
        );
        require(
            isFullModerator(_forum, _user), 
            "User does not have permission"
        );
        forums[_forum].moderators[_targetUser].permissions = _permissions;
    }

    function updateModeratorWage(bytes32 _user, bytes32 _forum, bytes32 _targetUser, uint _wage) 
        public {
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
        forums[_forum].moderators[_targetUser].wage = _wage;
    }

    function removeModerator(bytes32 _user, bytes32 _forum, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
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
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
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
        emit UserForumBanned(_forum, _user, now);
    }

    function moderatorUnban(bytes32 _user, bytes32 _targetUser, bytes32 _forum) 
        public userVerified(_user) userExists(_targetUser) forumExists(_forum) {
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
    }

    function isAdmin(bytes32 _user) public view returns(bool) {
        if(adminList.length == 0) return false;
        return (adminList[admins[_user].listPointer] == _user);
    }

    function isFullAdmin(bytes32 _user) public view returns(bool) {
        if(adminList.length == 0) return false;
        return (admins[_user].permissions[0] || msg.sender == owner);
    }

    function getAdminPermissions(bytes32 _user) 
    public view returns(bool fullAdmin, bool access, bool config, bool mail, bool flair, bool posts) {
        fullAdmin = admins[_user].permissions[0];
        access = admins[_user].permissions[1];
        config = admins[_user].permissions[2];
        mail = admins[_user].permissions[3];
        flair = admins[_user].permissions[4];
        posts = admins[_user].permissions[5];
    }

    function getAdminCount() public view returns(uint adminCount) {
        return adminList.length;
    }

    function checkAdminWage(uint _totalWage, uint _wage) public pure returns(bool) {
        require(_wage >= 0, "Negative wage");
        return (_totalWage + _wage) <= 100;
    }

    function createAdmin(bytes32 _user, bytes32 _targetUser, bool[] memory _permissions, uint _wage) 
    public userVerified(_user) userExists(_targetUser) {
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
        emit AdminCreated(_user, _targetUser, now);
    }

    function updateAdminPermissions(bytes32 _user, bytes32 _targetUser, bool[] memory _permissions) public {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        admins[_targetUser].permissions = _permissions;
    }

    function updateAdminWage(bytes32 _user, bytes32 _targetUser, uint _wage) public {
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
        admins[_targetUser].wage = _wage;
    }

    function removeAdmin(bytes32 _user, bytes32 _targetUser) 
    public userVerified(_user) userExists(_targetUser) {
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

    function adminBan(bytes32 _user, bytes32 _targetUser) 
        public userVerified(_user) userExists(_targetUser) {
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
        emit UserBanned(_user, now);
    }

    function adminUnban(bytes32 _user, bytes32 _targetUser)
        public userVerified(_user) userExists(_targetUser) {
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
    }

    function payoutAdmins(bytes32 _user) external userVerified(_user) {
        require(
            adminBalance >= 0, 
            "Balance 0"
        );
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint currentAdminBalance = adminBalance; // 100
        uint ownerWage = currentAdminBalance * (100 - adminWages) / 100; // 50
        uint currentAdminWages = currentAdminBalance - ownerWage; // 50
        uint remainderAdminWages = (100 - totalAdminWages) / getAdminCount();

        for (uint i = 0; i < getAdminCount(); i++) {
            uint currentAdminWage = (currentAdminWages * admins[adminList[i]].wage / 100) + remainderAdminWages;
            users[adminList[i]].balance += currentAdminWage;
        }

        users[ownerAccount].balance += ownerWage;
        adminBalance = 0;
    }

    function payoutModerators(bytes32 _user, bytes32 _forum) 
        external userVerified(_user) forumExists(_forum) {
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
        uint remainderModeratorWages = (100 - forums[_forum].totalModeratorWages) / getModeratorCount(_forum);

        for (uint i = 0; i < getModeratorCount(_forum); i++) {
            uint currentModeratorWage = (totalModeratorWages * forums[_forum].moderators[forums[_forum].moderatorList[i]].wage / 100) + remainderModeratorWages;
            users[forums[_forum].moderatorList[i]].balance += currentModeratorWage;
        }

        users[forums[_forum].owner].balance += ownerWage;
        forums[_forum].balance = 0;
    }

    function payoutForum(bytes32 _forum, uint _value) 
        internal {
        forums[_forum].balance += (_value / 50);
    }

    function payoutPost(bytes32 _forum, bytes32 _postId, uint _value) 
        internal {
        forums[_forum].balance += (_value / 4);
        users[forums[_forum].posts[_postId].creator].balance += (_value / 4); 
    }

    function payoutComment(bytes32 _forum, bytes32 _postId, bytes32 _commentId, uint _value) 
        internal {
        forums[_forum].balance += (_value / 6);
        users[forums[_forum].posts[_postId].creator].balance += (_value / 6); 
        users[forums[_forum].comments[_commentId].creator].balance += (_value / 6); 
    }

    function setCreateUserCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint oldCost = createUserCost;
        createUserCost = _newCost;
        emit UpdateFee(_user, "user", oldCost, _newCost);
    }
    
    function setCreateForumCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint oldCost = createForumCost;
        createForumCost = _newCost;
        emit UpdateFee(_user, "forum", oldCost, _newCost);
    }
    
    function setCreatePostCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint oldCost = createPostCost;
        createPostCost = _newCost;
        emit UpdateFee(_user, "post", oldCost, _newCost);
    }
    
    function setCreateCommentCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint oldCost = createCommentCost;
        createCommentCost = _newCost;
        emit UpdateFee(_user, "comment", oldCost, _newCost);
    }
    
    function setVoteCost(bytes32 _user, uint _newCost) 
        public userVerified(_user) {
        require(
            isFullAdmin(_user), 
            "User does not have permission"
        );
        uint oldCost = voteCost;
        voteCost = _newCost;
        emit UpdateFee(_user, "vote", oldCost, _newCost);
    }
}