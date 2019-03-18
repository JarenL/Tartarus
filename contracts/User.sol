pragma solidity >=0.4.22 <0.6.0;

import "./Ownable.sol";

contract User is Ownable {
    event PostCreated (address postAddress);
    event CommentCreated (address commentAddress);
    event PostUpvoted (address postAddress);
    event PostDownvoted (address postAddress);
    event MessageSent (address targetAddress, string messageText);
    event MessageReceived (address senderAddress, string messageText);

    address creator;

    function initialize(address _creator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        creator = _creator;
    }

    function notifyCreatePost(address _postAddress) public onlyOwner {
        emit PostCreated(_postAddress);
    }

    function notifyCreateComment(address _commentAddress) public onlyOwner {
        emit CommentCreated(_commentAddress);
    }
}