// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title User Registration
/// @notice Handles user account registrations and awards an achievement NFT.

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISoulboundNFT {
    function hasAchievement(address user, string memory achievement) external view returns (bool);
    function mint(address to, string memory achievement) external;
    function REGISTRATION_ACHIEVEMENT() external view returns (string memory);
}

/// @notice Manages user registrations and awards an NFT achievement
contract UserRegistration is ReentrancyGuard {
    ISoulboundNFT public immutable nft;

    /// @notice Tracks if an address is already registered
    mapping(address => bool) public isRegistered;

    /// @notice Emitted when a user registers
    /// @param user The registered user address
    event UserRegistered(address indexed user);

    /// @param _nft Address of the SoulboundNFT contract
    constructor(address _nft) {
        nft = ISoulboundNFT(_nft);
    }

    /// @notice Register the caller and award the registration achievement
    function register() external nonReentrant {
        require(!isRegistered[msg.sender], "Already registered");

        isRegistered[msg.sender] = true;

        // Award NFT achievement if user doesn’t already have it
        if (!nft.hasAchievement(msg.sender, nft.REGISTRATION_ACHIEVEMENT())) {
            nft.mint(msg.sender, nft.REGISTRATION_ACHIEVEMENT());
        }

        emit UserRegistered(msg.sender);
    }
}