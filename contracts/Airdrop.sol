// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./MyToken.sol";

contract Airdrop is Ownable {
    bytes32 public merkleRoot;
    MyToken public token;
    mapping(address => bool) public claimed;

    constructor(bytes32 _root, address tokenAddr) {
        merkleRoot = _root;
        token = MyToken(tokenAddr);
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");

        bytes32 leaf = keccak256(abi.encode(msg.sender));
        require(MerkleProof.verifyCalldata(proof, merkleRoot, leaf), "Invalid proof");

        claimed[msg.sender] = true;
        token.transfer(msg.sender, amount);
    }
}
