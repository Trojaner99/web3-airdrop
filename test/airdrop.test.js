const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("ethers");
const { expect } = require("chai");

describe("Airdrop", function () {
  it("should allow valid address to claim tokens", async function () {
    const [owner, user1] = await ethers.getSigners();

    // Beispiel-Airdrop-Liste
    const airdropList = [owner.address, user1.address];
    const leaves = airdropList.map((addr) => keccak256(addr));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();

    // Deploy Token + Airdrop
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(1_000_000);
    await token.waitForDeployment();

    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(root, await token.getAddress());
    await airdrop.waitForDeployment();

    // Übertrage Tokens an Airdrop-Contract
    await token.transfer(await airdrop.getAddress(), ethers.parseUnits("1000", 18));

    // Merkle-Proof für user1 erzeugen
    const proof = tree.getHexProof(keccak256(user1.address));

    // user1 claimt
    await airdrop.connect(user1).claim(ethers.parseUnits("100", 18), proof);

    // Erwartung: user1 hat 100 Token
    const balance = await token.balanceOf(user1.address);
    expect(balance.toString()).to.equal(ethers.parseUnits("100", 18).toString());
  });
});
