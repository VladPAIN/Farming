pragma solidity ^0.8.10;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Pair {


    address public factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address public router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    function addNewPair(address _tokenA, address _tokenB) external returns(address){
        address _newPair = IUniswapV2Factory(factory).createPair(_tokenA, _tokenB);
        return(_newPair);
    }   

    function addNewLiquidity(address _tokenA, address _tokenB, uint _amountA, uint _amountB)   external returns(uint256, uint256, uint256){

        //address _newPair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);

        IERC20(_tokenA).approve(router , _amountA);
        IERC20(_tokenB).approve(router , _amountB);


        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(router).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 1, 1, msg.sender, block.timestamp);
        return (amountA, amountB, liquidity);
    }

}   