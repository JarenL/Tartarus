pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./User.sol"; 

contract User is Ownable {
    event SubscribeForum (address forumAddress, string forumName); 
    event UnsubscribeForum (address forumAddress, string forumName); 
    event MessageSent (address targetAddress, string messageText);
    event MessageReceived (address senderAddress, string messageText);
    event CommentReceived (address commentAddress, address commentReplyAddress, address commentReplySender, string commentReplyText);
    event CommentCreated (address parentAddresss, address commentAddress, string commentText);
    event PostCreated (address postAddress, string postText);

    //needs "onlyowner" equivalent, perhaps only desired forumaddress can call. 
    function subscribe(address _forumAddress, string _forumName) public {
        emit SubscribeForum(_forumAddress, _forumName);
    }

    function unsubscribe(address _forumAddress, string _forumName) public onlyOwner {
        emit UnsubscribeForum(_forumAddress, _forumName);
    }

    function receiveMessage(string _messageText) public {
        emit MessageReceived(msg.sender, _messageText);   
    }

    function sendMessage(address _targetAddress, string _messageText) public onlyOwner {
        User targetUser = User(_targetAddress);
        targetUser.receiveMessage(_messageText);
        emit MessageSent(_targetAddress, _messageText);
    }

    function receiveComment(address _commentAddress, address _commentReplyAddress, address _replySender, string _replyText) public {
        emit CommentReceived(_commentAddress, _commentReplyAddress, _replySender, _replyText);
    }

    function createComment(address _parentAddress, address _commentAddress, string _commentText) public onlyOwner {
        emit CommentCreated(_parentAddress, _commentAddress, _commentText);
    }

    //needs "onlyowner" equivalent, perhaps only desired forumaddress can call. 
    function createPost(address _postAddress, string _postTitle) public {
        emit PostCreated(_postAddress, _postTitle);
    }
}