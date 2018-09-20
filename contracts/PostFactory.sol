pragma solidity ^0.4.24;

import "./Post.sol"; 

contract PostFactory {
    event PostCreated (address postAddress, string posttitle, address postOwne, now);  
    event PostDeleted(address postAddress, string postTitle, address postOwner, now);

    function createPost(string _postTitle) public {
        address newPostAddress = new Post(_postTitle);
        emit PostCreated(newPostAddress, _postTitle, msg.sender);
    }

    function deletePost(address _postAddress) public onlyOwner {
        emit PostDeleted(_postAddress);
    }
}