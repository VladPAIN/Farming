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
   

    string public name = "MTKN1 Farm";

    address public factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    Token1 public token1;
    Token2 public token2;
    // Pair public pair;

    address pair = IUniswapV2Factory(factory).getPair(0x2D03f85f4384147a1A005f1b92F4a033ACE6bAdc, 0xEE8506Cac6da822f9684c92436A2cD5A8D7037CF);

    uint256 timeLock = 60;
    uint256 proccentRewars = 20;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event Claim(address indexed to, uint256 amount);

    function changeTimeLock(uint256 newTime) public onlyOwner {
        timeLock = newTime;
    }

    function changeProccentRewars(uint256 newProccentRewars) public onlyOwner {
        proccentRewars = newProccentRewars;
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