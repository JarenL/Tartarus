pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Post.sol"; 
import "./User.sol"; 

contract Forum is Ownable {
    event UserBanned(address userAddress);
    event UserUnbanned(address userAddress);
    event PostCreated (address postAddress, string postTitle, address postOwner, uint timestamp);  

    string public forumName;

    constructor(string _forumName) public {
        owner = msg.sender;
        forumName = _forumName;
    }

    function banUser(address _userAddress) public onlyOwner {
        emit UserBanned(_userAddress);
    }

    function unBanUser(address _userAddress) public onlyOwner {
        emit UserUnbanned(_userAddress);
    }

    function createPost(string _postTitle) public {
        address newPostAddress = new Post(_postTitle);
        // User postCreator = User(msg.sender);
        // postCreator.createPost(newPostAddress, _postTitle);
        emit PostCreated(newPostAddress, _postTitle, msg.sender, block.timestamp);
    }
}