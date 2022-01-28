pragma solidity ^0.8.10;

import "./Ownable.sol";
import "./IERC20.sol";

contract Token1 is IERC20, Ownable {
    string public constant name = 'MyToken1';
    string public constant symbol = 'MTKN1';
    uint32 public constant decimals = 18;

    uint256 public _totalSupply;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowances;

    

    constructor() {
        mint(msg.sender, 10**decimals * 10000);
    }

    function mint(address to, uint256 amount) public ownerOrMinter {
        require(amount >= 0);
        balances[to] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function totalSupply() public view returns (uint256) {
       return _totalSupply;
    }

    function balanceOf(address account) external view returns(uint256){
        return balances[account];
    }

    function transfer(address to, uint amount) public returns (bool) {
        require(balances[msg.sender] >= amount, 'Not enough tokens');
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint){
        return allowances[owner][spender];
    }

    function increaseAllowance(address spender, uint256 amount) public returns(bool) {
        require(spender != address(0) && amount >= 0);
        allowances[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, allowances[msg.sender][spender]);
        return true;
    }

        function decreaseAllowance(address spender, uint256 amount) public returns(bool) {
        require(spender != address(0) && allowances[msg.sender][spender] >= amount && amount >= 0);
        allowances[msg.sender][spender] -= amount;
        emit Approval(msg.sender, spender, allowances[msg.sender][spender]);
        return true;
    }

    function approve(address spender, uint amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint amount) external returns (bool){
        if(allowances[from][msg.sender] >= amount
            && amount > 0) {
                allowances[from][msg.sender] -= amount;
                balances[from] -= amount;
                balances[to] += amount;
                emit Transfer(from, to, amount);
                return true;  
            }
        return false;
    }

    function burn(address account, uint amount) public onlyOwner {
        require(amount <= balances[account], 'Not enough tokens for burn');
        _totalSupply -= amount;
        balances[account] -= amount;
        emit Transfer(account, address(0), amount);
    }

}