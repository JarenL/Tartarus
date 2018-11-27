pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract User is Ownable {
    event SubscribeForum (address forumAddress); 
    event UnsubscribeForum (address forumAddress); 
    event PostCreated (address postAddress);
    event CommentCreated (address commentAddress);
    event CommentReceived (address commentAddress);
    event MessageSent (address targetAddress, string messageText);
    event MessageReceived (address senderAddress, string messageText);

    address creator;
    mapping(address => bool) private forumSubscriptions;

    function initialize(address _creator) public {
        require(owner == address(0), "Nice try");
        owner = msg.sender;
        creator = _creator;
    }

    //needs "onlyowner" equivalent, perhaps only desired forumaddress can call. 
    function subscribe(address _forumAddress) public {
        // require(msg.sender == creator, "Not authorized");
        require(!forumSubscriptions[_forumAddress], "Already subscribed");
        forumSubscriptions[_forumAddress] = true;
        emit SubscribeForum(_forumAddress);
    }

    function unsubscribe(address _forumAddress) public onlyOwner {
        // require(msg.sender == creator, "Not authorized");
        require(forumSubscriptions[_forumAddress], "Not subscribed");
        delete forumSubscriptions[_forumAddress];
        emit UnsubscribeForum(_forumAddress);
    }

    function notifyCreatePost(address _postAddress) public onlyOwner {
        emit PostCreated(_postAddress);
    }

    function notifyCreateComment(address _commentAddress) public onlyOwner {
        emit CommentCreated(_commentAddress);
    }

    function notifyCommentReceived(address _commentAddress) public onlyOwner {
        emit CommentReceived(_commentAddress);
    }
}