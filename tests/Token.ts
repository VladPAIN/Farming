const { expect } = require('chai');
const { ethers } = require('hardhat');
const { collectCompilations } = require('truffle');


describe('Token contract', () => {
    
    let Token1, token1, Token2, token2, pair, Pair, Farm, farm, owner, addr1, addr2;

    beforeEach(async () => {
        Farm = await ethers.getContractFactory(process.env.FARM_ADDRESS);
        farm = await Farm.deploy();

        Pair = await ethers.getContractFactory(process.env.PAIR_ADDRESS);
        pair = await Pair.deploy();

        Token1 = await ethers.getContractFactory(process.env.TOKEN1_ADDRESS);
        token1 = await Token1.deploy();

        Token2 = await ethers.getContractFactory(process.env.TOKEN2_ADDRESS);
        token2 = await Token1.deploy();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe('Owner', () => {
        it('Should set the right owner', async () => {
            expect(await farm.owner()).to.equal(owner.address);
        });

    });

    // describe('Ownable', () => {
    //     it('Should change owner', async () => {
    //         await token.transferOwnership(addr1.address);

    //         expect(await token.connect(addr1).isOwner()).to.equal(true);
    //     });

    //     it('Should renounce owner', async () => {
    //         await token.renounceOwnership();

    //         expect(await token.isOwner()).to.equal(false);
    //     });
    // });

    // describe('Allowance', () => {
    //     it('Should allowance token', async () => {
    //         await token.approve(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         const allowanceAfterApprove = await token.allowance(owner.address, addr1.address);
    //         expect(allowanceAfterApprove).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //     });

    //     it('Should increase allowance token', async () => {
    //         await token.approve(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         await token.increaseAllowance(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));   

    //         const allowanceAfterIncreaseAllowance = await token.allowance(owner.address, addr1.address);
    //         expect(allowanceAfterIncreaseAllowance).to.equal(ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));

    //     });

    //     it('Should decrease allowance token', async () => {
    //         await token.approve(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         await token.decreaseAllowance(addr1.address, ethers.utils.parseUnits("30", process.env.TOKEN_DECIMALS));   

    //         const allowanceAfterDecreaseAllowance = await token.allowance(owner.address, addr1.address);
    //         expect(allowanceAfterDecreaseAllowance).to.equal(ethers.utils.parseUnits("20", process.env.TOKEN_DECIMALS));

    //     });
    // });

    // describe('Transactions', () => {
    //     it('Should mint token', async () => {
    //         const initialTotalSupply = await token.totalSupply();
    //         await token.mint(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         const addr1Balance = await token.balanceOf(addr1.address);

    //         expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const totalSupplyAfterMint = await token.totalSupply()
    //         expect(initialTotalSupply).to.equal(totalSupplyAfterMint.sub(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS)));
    //     });

    //     it('Should transfer tokens between accounts', async () => {
    //         await token.transfer(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         await token.connect(addr1).transfer(addr2.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //     });

    //     it('Should transferFrom tokens between accounts', async () => {
    //         await token.approve(owner.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         await token.transferFrom(owner.address, addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         await token.connect(addr1).approve(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         await token.connect(addr1).transferFrom(addr1.address, addr2.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //     });

    //     it('Should fail if sender doesnt have enough tokens', async () => {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         await expect(token.connect(addr1).transfer(owner.address, ethers.utils.parseUnits("1", process.env.TOKEN_DECIMALS))).to.be.revertedWith('Not enough tokens');

    //         expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    //     });

    //     it('Should update balances after transfers', async () => {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         await token.transfer(addr1.address, ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));
    //         await token.transfer(addr2.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const finalOwnerBalance = await token.balanceOf(owner.address);
    //         expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseUnits("150", process.env.TOKEN_DECIMALS)));

    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));

    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //     });

    //     it('Should fail if sender doesnt have enough approve tokens', async () => {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         await token.approve(owner.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         await expect(token.transferFrom(owner.address, addr1.address, ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS)));

    //         expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    //     });

    //     it('Should allowance tokens', async () => {
    //         await token.approve(addr1.address, ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));

    //         expect(await token.allowance(owner.address, addr1.address)).to.equal(ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));
    //     });

    //     it('Should burn token', async () => {
    //         const initialTotalSupply = await token.totalSupply();
    //         const initialOwnerBalance = await token.balanceOf(owner.address);

    //         await token.burn(owner.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const ownerBalance = await token.balanceOf(owner.address);
    //         expect(ownerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS)));
    //         expect(await token.totalSupply()).to.equal(initialTotalSupply.sub(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS)));
    //     });

    //     it('Should burn after transfer', async () => {
    //         const initialOwnerBalance = await token.balanceOf(owner.address);
    //         const initialTotalSupply = await token.totalSupply();

    //         await token.transfer(addr1.address, ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));
    //         await token.transfer(addr2.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         await token.burn(addr1.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
    //         await token.burn(addr2.address, ethers.utils.parseUnits("10", process.env.TOKEN_DECIMALS));

    //         const finalTotalSupply = await token.totalSupply();
    //         expect(finalTotalSupply).to.equal(initialTotalSupply.sub(ethers.utils.parseUnits("60", process.env.TOKEN_DECIMALS)));

    //         const finalOwnerBalance = await token.balanceOf(owner.address);
    //         expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseUnits("150", process.env.TOKEN_DECIMALS)));

    //         const addr1Balance = await token.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

    //         const addr2Balance = await token.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(ethers.utils.parseUnits("40", process.env.TOKEN_DECIMALS));
    //     });
    // });
});