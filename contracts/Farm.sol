pragma solidity ^0.8.10;

import "./Token1.sol";
import "./Token2.sol";
import "./Pair.sol";
import "./Ownable.sol";

contract Farm is Ownable {

    // userAddress => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // userAddress => isStaking boolean
    mapping(address => bool) public isStaking;
    // userAddress => timeStamp
    mapping(address => uint256) public startTime;
    // userAddress => token1Balance
    mapping(address => uint256) public token1Balance;
   

    string public name = "MTKN1 Farm";

    address public factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    Token1 public token1;
    Token2 public token2;
    // Pair public pair;

    address pair = IUniswapV2Factory(factory).getPair(0x2D03f85f4384147a1A005f1b92F4a033ACE6bAdc, 0xEE8506Cac6da822f9684c92436A2cD5A8D7037CF);

    uint256 timeLock = 600;
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
        
        if(isStaking[msg.sender] == true ) {
            uint256 tokenReward = totalReward(msg.sender);
            token1Balance[msg.sender] += tokenReward;
        }

        IERC20(pair).transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    function timeStaking(address user) public view returns(uint256) {
        uint endStake = block.timestamp;
        uint totalTime = endStake - startTime[user];
        return totalTime;
    }

    function totalReward(address user) public view returns(uint256) {
        uint256 time = timeStaking(user) * 10**18;
        uint256 amountReward = time / timeLock;
        uint tokenReward = (stakingBalance[user] * amountReward * proccentRewars / 100) / 10**18;
        return tokenReward; 
    }

    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            timeStaking(msg.sender) >= timeLock &&
            stakingBalance[msg.sender] >= amount,
            "Tokens is locked"
        );

        uint totalReward = totalReward(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint256 balanceTransfer = amount;
        amount = 0;

        stakingBalance[msg.sender] -= balanceTransfer;

        IERC20(pair).transfer(msg.sender, balanceTransfer);
        token1Balance[msg.sender] += totalReward;

        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, amount);
    }

    function claim() public {

        uint256 toClaim = totalReward(msg.sender);

        require(isStaking[msg.sender] == true && (toClaim > 0 || token1Balance[msg.sender] > 0), "You dont have tokens in stack");
        
        if(token1Balance[msg.sender] != 0) {
            uint unclaimBalance = token1Balance[msg.sender];
            toClaim += unclaimBalance;
            token1Balance[msg.sender] = 0;
        }

        startTime[msg.sender] = block.timestamp;
        token1.mint(msg.sender, toClaim);
        emit Claim(msg.sender, toClaim);
    } 

}