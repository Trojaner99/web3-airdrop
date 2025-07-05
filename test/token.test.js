const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  it("should assign the initial supply to the deployer", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(1_000_000);
    await token.waitForDeployment();

    const balance = await token.balanceOf(owner.address);
    expect(balance.toString()).to.equal(ethers.parseUnits("1000000", 18).toString());
  });
});
