pragma solidity ^0.4.24;

// import "./ForumFactory.sol"; 
// import "./UserFactory.sol"; 
import "./User.sol"; 
import "./Forum.sol"; 
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Tartarus is Ownable {
    event AdminCreated (address adminAddress);
    event ForumCreated(address forumAddress, string forumName, address forumOwner, uint timstamp);  
    event UserCreated (address indexed ownerAddress, address userAddress, uint timestamp);  
    
    mapping (string => address) forums;
    mapping (address => address) users;
    mapping (address => address) admins;

    uint createUserCost = 0;

    function createAdmin(address _adminAddress) public onlyOwner {
        emit AdminCreated(_adminAddress);
    }

    function createForum(string _forumName) public {
        require(forums[_forumName] == 0, "Forum already exists");
        address newForumAddress = new Forum();
        forums[_forumName] = newForumAddress;
        User creator = User(users[msg.sender]);
        creator.subscribe(newForumAddress, _forumName);
        emit ForumCreated(newForumAddress, _forumName, msg.sender, block.timestamp);
    }

    function createUser() public payable {
        require((msg.value >= createUserCost), "Insufficient Eth Sent");
        require((users[msg.sender] == 0), "Username taken");
        address newUserAddress = new User();
        users[msg.sender] = newUserAddress;
        emit UserCreated(msg.sender, newUserAddress, block.timestamp);
    }

    function authenticateUser() public view returns(address) {
        return users[msg.sender];
    }

    function setCost(uint _newCost) public onlyOwner {
        createUserCost = _newCost;
    }
}