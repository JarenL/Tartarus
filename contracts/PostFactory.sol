pragma solidity ^0.4.24;

import "./Post.sol"; 
import "./User.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PostFactory is Ownable {
    event PostCreated (address postAddress, string posttitle, address postOwner, uint timestamp);  

    function createPost(string _postTitle) public {
        address newPostAddress = new Post();
        User postCreator = User(msg.sender);
        postCreator.createPost(newPostAddress, _postTitle);
        emit PostCreated(newPostAddress, _postTitle, msg.sender, block.timestamp);
    }
}