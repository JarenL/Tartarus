pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract VoteForums is Ownable {
    enum State {AWAITING_REWARD, AWAITING_VOTE, VOTE_RECIEVED, VOTE_UNATHORIZED, AWARD_RECIEVED}
    State public currentState;
    
    // to recieve rewards for posting content like posts (owner of the forum {posts})
    address public owner;
    // moderator basically creates the subforum and has control 
    address public moderator;
    // user thats subscribe to the forum
    address public subscriber;
    
    int256 voteCount;
    
    event VoteCreated(address voteAddress);
    
    struct Forums {
        string postAddress;
        uint numberOfVotes;
    }
    
    struct User {
        uint voteIndex;
        bool didVote;
        uint weight;
    }
    
    modifier authorizedVote(){
        require(msg.sender == subscriber || msg.sender == owner, "You don't have access of this functionality");
        _;
    }
    
    // both the subscriber can send rewards and recieve
    modifier recieveAward() {
        require(msg.sender == subscriber || msg.sender == owner, "Unathorized User");
        _;
    }
    
    modifier inState(State expectedState) {
        require(currentState == expectedState, "Current State doesn't exist");
        _;
    }
    
    constructor(address _owner, address _moderator, address _subscriber, int256 _voteCount) public {
        owner = _owner;
        moderator = _moderator;
        subscriber = _subscriber;
        voteCount = _voteCount;
        voteCount = 0;
    }
    
    // will not use since I'm not accessing the struct
    // might use for later
    
    mapping (uint => Forums) forums;
    mapping (uint => User) voters;
    
    // state variable 
    uint public voteWieght;
    
    function sendUpVote() public payable authorizedVote inState(State.AWAITING_REWARD) {
        require(msg.sender == subscriber, "Subscriber....");
        require(msg.value > 0.1 ether, "Not enough either to vote");
        voteCount += 1;
        currentState = State.AWAITING_VOTE;
    }
    
    // the owner and subscribe can send upvotes on either the owner post or user comments
    function voteRecieved() public authorizedVote inState(State.AWAITING_VOTE) {
        currentState = State.VOTE_RECIEVED;
        // both owner and subscriber should be authoried to vote
        if (owner) {
            owner.transfer(address(this).balance);
        }
        if (subscriber) {
            subscriber.transfer(address(this).balance);
        }
    }
}