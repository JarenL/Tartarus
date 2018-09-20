pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CommentFactory.sol"; 

contract Comment is Ownable, CommnetFactory {
    event CommentDeleted (address commentAddress, string commentText, address commentOwner, now);
    event CommentEdited (address commentAddress, string commentText, address commentOwner, now);

    function editComment(string _oldComment, string _newcomment) public onlyOwner {
        emit CommentEdited (address(this), _oldPost, _newPost);
    }

    function deletePost() public onlyOwner {
        emit CommentDeleted (address(this));
    }
}