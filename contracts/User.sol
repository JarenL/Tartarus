pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract User is Ownable {
    event SubscribeForum (address forumAddress); 
    event UnsubscribeForum (address forumAddress); 
    event MessageSent (address targetAddress, string messageText);
    event MessageReceived (address senderAddress, string messageText);
    event CommentReceived (address commentAddress, address commentReplyAddress, address commentReplySender, string commentReplyText);
    event CommentCreated (address parentAddresss, address commentAddress, string commentText);
    event PostCreated (address postAddress, string postText);

    mapping(address => bool) private forumSubscriptions;

    //needs "onlyowner" equivalent, perhaps only desired forumaddress can call. 
    function subscribe(address _forumAddress) public {
        require(forumSubscriptions[_forumAddress] == 0, "Already subscribed");
        forumSubscriptions[_forumAddress] = true;
        emit SubscribeForum(_forumAddress);
    }

    function unsubscribe(address _forumAddress) public onlyOwner {
        require(forumSubscriptions[_forumAddress] != 0, "Not subscribed");
        delete forumSubscriptions[_forumAddress];
        emit UnsubscribeForum(_forumAddress);
    }

    function receiveComment(address _commentAddress, address _commentReplyAddress, address _replySender, string _replyText) public {
        emit CommentReceived(_commentAddress, _commentReplyAddress, _replySender, _replyText);
    }

    function createComment(address _parentAddress, address _commentAddress, string _commentText) public onlyOwner {
        emit CommentCreated(_parentAddress, _commentAddress, _commentText);
    }

    //needs "onlyowner" equivalent, perhaps only desired forumaddress can call. 
    function createPost(address _postAddress) public onlyOwner {
        emit PostCreated(_postAddress, _postTitle);
    }

    function receiveMessage(string _messageText) public {
        emit MessageReceived(msg.sender, _messageText);   
    }

    function sendMessage(address _targetAddress, string _messageText) public onlyOwner {
        User targetUser = User(_targetAddress);
        targetUser.receiveMessage(_messageText);
        emit MessageSent(_targetAddress, _messageText);
    }
}