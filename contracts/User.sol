pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Tartarus.sol";

contract User is Ownable {
    address public creator;
    bytes32 public username;

    function initialize(address _creator, bytes32 _username) external {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        creator = _creator;
        username = _username;
    }

    function createForum(bytes32 _forumName) external {
        require(msg.sender == creator, "Not user contract creator");
        Tartarus(owner).createForum(_forumName);
    }   

    function createPost(address _forumAddress, bytes32 _post) external {
        require(msg.sender == creator, "Not user contract creator");
        Tartarus(owner).createPost(_forumAddress, _post);
    }

    function deletePost(address _forumAddress, address _postAddress, address payable _suicideAddress) external {
        require(msg.sender == creator, "Not user contract creator");
        Forum(_forumAddress).deletePost(_postAddress, _suicideAddress);
    }

    function createComment(address _forumAddress, address _postAddress, address _targetAddress, bytes32 _comment) external {
        require(msg.sender == creator, "Not user contract creator");
        Tartarus(owner).createComment(_forumAddress, _postAddress, _targetAddress, _comment);
    }

    function deleteComment(address _forumAddress, address _postAddress, address _commentAddress, address payable _suicideAddress) external {
        require(msg.sender == creator, "Not user contract creator");
        Forum(_forumAddress).deleteComment(_postAddress, _commentAddress, _suicideAddress);
    }

    function deleteAccount() external {
        require(msg.sender == creator, "Not user contract creator");
        selfdestruct(msg.sender);
    }
}