// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Interface for SoulboundNFT
/// @notice Defines the external functions called on the SoulboundNFT contract.
interface ISoulboundNFT {
    function hasAchievement(address user, string memory achievement) external view returns (bool);
    function mint(address to, string memory achievement) external;
    function FIRST_RATE_ACHIEVEMENT() external view returns (string memory);
}

/// @title Soulbound Reputation Token
/// @notice ERC20-based, non-transferable (soulbound) reputation points.
/// Users can rate others to award them points while earning a first-rate achievement NFT themselves.
contract SoulboundReputation is ERC20, Ownable, ReentrancyGuard {
    /// @notice Tracks whether a user (`msg.sender`) has already rated another user (`target`).
    mapping(address => mapping(address => bool)) public hasVoted;

    /// @notice Reference to the SoulboundNFT contract for awarding achievements.
    ISoulboundNFT public nftContract;

    /// @notice Deploys the contract and sets the NFT contract reference.
    /// @param _nftContract Address of the deployed SoulboundNFT contract.
    constructor(address _nftContract) ERC20("ReputationPoints", "REP") Ownable(msg.sender) {
        nftContract = ISoulboundNFT(_nftContract);
    }

    /// @notice Allows the caller to rate another user and award them 1 reputation point.
    /// Awards the caller the FIRST_RATE_ACHIEVEMENT if it’s their first rating.
    /// @param target The user being rated.
    function rate(address target) external nonReentrant {
        require(target != msg.sender, "Cannot rate yourself");
        require(!hasVoted[msg.sender][target], "Already rated this user");

        _mint(target, 1 ether); // 1 REP for the target
        hasVoted[msg.sender][target] = true;

        // Give achievement to the rater if they don’t already have it
        if (!nftContract.hasAchievement(msg.sender, nftContract.FIRST_RATE_ACHIEVEMENT())) {
            nftContract.mint(msg.sender, nftContract.FIRST_RATE_ACHIEVEMENT());
        }
    }

    /// @notice Overrides ERC20’s `_update` to enforce soulbound behavior.
    /// Only allows minting (from 0 → user) or burning (user → 0); disallows transfers.
    /// @param from The sender address (should be 0 for mint or user for burn).
    /// @param to The recipient address (should be user for mint or 0 for burn).
    /// @param amount The amount of REP being updated.
    function _update(address from, address to, uint256 amount) internal override {
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        super._update(from, to, amount);
    }
}
