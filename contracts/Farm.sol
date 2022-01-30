pragma solidity ^0.8.10;

import "./Token1.sol";
import "./Token2.sol";
import "./Pair.sol";
import "./Ownable.sol";

contract Farm is Ownable {

    struct UserInfo{
        uint256 stakingBalance;
        uint256 startTime;
        uint256 rewordsBalance;
    }
    mapping(address => UserInfo) public userInfo;

    string public name = "MTKN1 Farm";

    Token1 public rewordsToken;
    address public LPtoken;

    constructor(address _rewordsToken, address _LPtoken) {
        rewordsToken = Token1(_rewordsToken);
        LPtoken = _LPtoken;
    }

    uint256 timeLock = 600;
    uint256 proccentRewards = 200;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event Claim(address indexed to, uint256 amount);

    function getStakingBalance() public view returns (uint){
        return userInfo[msg.sender].stakingBalance;
    }

    function getStartTime() public view returns (uint){
        return userInfo[msg.sender].startTime;
    }

    function getRewordsTokenBalance() public view returns (uint){
        return userInfo[msg.sender].rewordsBalance;
    }

    function getProccentRewards() public view returns (uint) {
        return proccentRewards;
    }

    function getTimeLock() public view returns (uint) {
        return timeLock;
    }

    function changeProccentRewards(uint256 newProccentRewards) public onlyOwner {
        proccentRewards = newProccentRewards;
    }

    function changeTimeLock(uint256 newTime) public onlyOwner {
        timeLock = newTime;
    }


    function stake(uint256 amount) public {
        require(amount > 0 && IERC20(LPtoken).balanceOf(msg.sender) >= amount, "You cannot stake zero tokens");
        
        if(userInfo[msg.sender].startTime != 0) {
            uint256 tokenReward = totalReward(msg.sender);
            userInfo[msg.sender].rewordsBalance += tokenReward;
        }

        IERC20(LPtoken).transferFrom(msg.sender, address(this), amount);
        userInfo[msg.sender].stakingBalance += amount;
        userInfo[msg.sender].startTime = block.timestamp;
        emit Stake(msg.sender, amount);
    }

    function timeStaking(address user) public view returns(uint256) {
        uint totalTime = block.timestamp - userInfo[user].startTime;
        return totalTime;
    }

    function totalReward(address user) public view returns(uint256) {
        uint256 amountReward = timeStaking(user) / timeLock;
        uint tokenReward = (userInfo[user].stakingBalance * amountReward * proccentRewards / 1000);
        return tokenReward; 
    }

    function unstake(uint256 amount) public {
        require(
            timeStaking(msg.sender) >= timeLock &&
            userInfo[msg.sender].stakingBalance >= amount,
            "Tokens is locked"
        );

        uint totalReward = totalReward(msg.sender);
        userInfo[msg.sender].startTime = block.timestamp;

        userInfo[msg.sender].stakingBalance -= amount;

        IERC20(LPtoken).transfer(msg.sender, amount);
        userInfo[msg.sender].rewordsBalance += totalReward;

        emit Unstake(msg.sender, amount);
    }

    function claim() public {
        require(totalReward(msg.sender) > 0 || userInfo[msg.sender].rewordsBalance > 0, "You dont have reward tokens");
        require(timeStaking(msg.sender) >= timeLock, "Your tokens are locked, the staking time has not passed yet");
        uint256 toClaim = totalReward(msg.sender);
        
        if(userInfo[msg.sender].rewordsBalance != 0) {
            uint unclaimBalance = userInfo[msg.sender].rewordsBalance;
            toClaim += unclaimBalance;
            userInfo[msg.sender].rewordsBalance = 0;
        }

        userInfo[msg.sender].startTime = block.timestamp;
        rewordsToken.transfer(msg.sender, toClaim);
        emit Claim(msg.sender, toClaim);
    } 

}
