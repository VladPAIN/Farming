import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("proccentrewars", "Stake")
    .addParam("amount", "Proccent rewars")
    .setAction(async (args) => {



        const farm = await hre.ethers.getContractAt("Farm", process.env.FARM_ADDRESS);
        await (await farm.changeProccentRewars(hre.ethers.utils.parseUnits(args.amount, process.env.TOKEN_DECIMALS))).wait()
        console.log("You are unstaked: ", args.amount, " tokens");
 

    });

export default  {};