import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("lock", "Stake")
    .addParam("amount", "Lock time")
    .setAction(async (args) => {



        const farm = await hre.ethers.getContractAt(process.env.FARM_NAME, process.env.FARM_ADDRESS);
        await (await farm.changeTimeLock(hre.ethers.utils.parseUnits(args.amount, process.env.TOKEN_DECIMALS))).wait()
        console.log("You are unstaked: ", args.amount, " tokens");
 

    });

export default  {};