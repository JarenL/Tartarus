pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CommentFactory.sol"; 

contract Post is Ownable, CommnetFactory {
    event PostDeleted (address postAddress, string postTitle, address postOwner, now);
    event PostEdited (address postAddress, string postTitle, string oldPostText, string newPostText, now);
    event CommentCreated (address commentAddress, string commentText, address commentOwner, now);

    function editPost(string _postTitle, string _oldPost, string _newPost) public onlyOwner {
        emit PostEdited(address(this), _postTitle, _oldPost, _newPost);
    }

    function deletePost() public onlyOwner {
        emit PostDeleted(address(this), _postTitle);
    }
}