import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("stake", "Stake")
    .addParam("amount", "LP Token amount")
    .setAction(async (args) => {



        const pair = await hre.ethers.getContractAt("IUniswapV2Pair", process.env.LP_TOKEN_ADDRESS);
        await (await pair.approve(process.env.FARM_ADDRESS, hre.ethers.utils.parseUnits(args.amount, process.env.TOKEN_DECIMALS))).wait()

        const farm = await hre.ethers.getContractAt("Farm", process.env.FARM_ADDRESS);
        await (await farm.stake(hre.ethers.utils.parseUnits(args.amount, process.env.TOKEN_DECIMALS))).wait()
        console.log("You are staked: ", args.amount, " tokens");
 

    });

export default  {};