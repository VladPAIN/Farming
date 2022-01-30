pragma solidity ^0.8.10;

import "./Token1.sol";
import "./Token2.sol";
import "./Pair.sol";
import "./Ownable.sol";

contract Farm is Ownable {

    struct poolInfo{
        uint256 stakingBalance;
        bool isStaking;
        uint256 startTime;
        uint256 token1Balance;
    }
    mapping(address => poolInfo) public userInfo;

    string public name = "MTKN1 Farm";

    address public factory;

    Token1 public token1;
    Token2 public token2;
    // Pair public pair;
    address public pair;

    constructor(address _token1, address _token2, address _pair) {
        token1 = Token1(_token1);
        token2 = Token2(_token2);
        pair = _pair;
    }

    uint256 timeLock = 60;
    uint256 proccentRewars = 20;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event Claim(address indexed to, uint256 amount);

    function getStakingBalance() public view returns (uint){
        return userInfo[msg.sender].stakingBalance;
    }

    function getIsStaking() public view returns (bool){
        return userInfo[msg.sender].isStaking;
    }

    function getStartTime() public view returns (uint){
        return userInfo[msg.sender].startTime;
    }

    function getToken1Balance() public view returns (uint){
        return userInfo[msg.sender].token1Balance;
    }

    function getProccentRewars() public view returns (uint) {
        return proccentRewars;
    }

    function getTimeLock() public view returns (uint) {
        return timeLock;
    }

    function changeProccentRewars(uint256 newProccentRewars) public onlyOwner {
        proccentRewars = newProccentRewars;
    }

    function changeTimeLock(uint256 newTime) public onlyOwner {
        timeLock = newTime;
    }


    function stake(uint256 amount) public {
        require(amount > 0 && IERC20(pair).balanceOf(msg.sender) >= amount, "You cannot stake zero tokens");
        
        if(userInfo[msg.sender].isStaking == true ) {
            uint256 tokenReward = totalReward(msg.sender);
            userInfo[msg.sender].token1Balance += tokenReward;
        }

        IERC20(pair).transferFrom(msg.sender, address(this), amount);
        userInfo[msg.sender].stakingBalance += amount;
        userInfo[msg.sender].startTime = block.timestamp;
        userInfo[msg.sender].isStaking = true;
        emit Stake(msg.sender, amount);
    }

    function timeStaking(address user) public view returns(uint256) {
        uint totalTime = block.timestamp - userInfo[user].startTime;
        return totalTime;
    }

    function totalReward(address user) public view returns(uint256) {
        uint256 amountReward = timeStaking(user) / timeLock;
        uint tokenReward = (userInfo[user].stakingBalance * amountReward * proccentRewars / 100);
        return tokenReward; 
    }

    function unstake(uint256 amount) public {
        require(
            userInfo[msg.sender].isStaking = true &&
            timeStaking(msg.sender) >= timeLock &&
            userInfo[msg.sender].stakingBalance >= amount,
            "Tokens is locked"
        );

        uint totalReward = totalReward(msg.sender);
        userInfo[msg.sender].startTime = block.timestamp;
        uint256 balanceTransfer = amount;
        amount = 0;

        userInfo[msg.sender].stakingBalance -= balanceTransfer;

        IERC20(pair).transfer(msg.sender, balanceTransfer);
        userInfo[msg.sender].token1Balance += totalReward;

        if(userInfo[msg.sender].stakingBalance == 0){
            userInfo[msg.sender].isStaking = false;
        }
        emit Unstake(msg.sender, amount);
    }

    function claim() public {

        uint256 toClaim = totalReward(msg.sender);

        // require(userInfo[msg.sender].isStaking[msg.sender], "You dont have tokens in stake");
        // require(toClaim > 0 || userInfo[msg.sender].token1Balance[msg.sender] > 0, "You dont have reward tokens");
        
        if(userInfo[msg.sender].token1Balance != 0) {
            uint unclaimBalance = userInfo[msg.sender].token1Balance;
            toClaim += unclaimBalance;
            userInfo[msg.sender].token1Balance = 0;
        }

        userInfo[msg.sender].startTime = block.timestamp;
        token1.mint(msg.sender, toClaim);
        emit Claim(msg.sender, toClaim);
    } 

}
