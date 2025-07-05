const fs = require("fs");
const { keccak256 } = require("ethers");
const { MerkleTree } = require("merkletreejs");

const raw = fs.readFileSync("data/airdrop-list.json", "utf8");
const addresses = JSON.parse(raw);

const leaves = addresses.map((addr) => keccak256(addr));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const root = tree.getHexRoot();
fs.writeFileSync("data/merkle-root.txt", root);

console.log("✅ Merkle root generated:");
console.log(root);
