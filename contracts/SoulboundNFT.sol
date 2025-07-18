// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Soulbound Achievement NFT
/// @notice ERC721-based, non-transferable (soulbound) NFTs that represent user achievements.
/// Only accounts with the `MINTER_ROLE` can mint achievements, which are tracked per user.
/// Achievements cannot be transferred once minted.
contract SoulboundNFT is ERC721, Ownable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Constant name for registration achievement
    string public constant REGISTRATION_ACHIEVEMENT = "User Registered";
    /// @notice Constant name for first rating achievement
    string public constant FIRST_RATE_ACHIEVEMENT = "Your First Rate";

    /// @notice Next tokenId to be minted
    uint256 public nextTokenId = 1;

    /// @notice Data structure to hold achievement metadata
    struct Achievement {
        string name;
    }

    /// @notice Mapping from tokenId to its corresponding Achievement
    mapping(uint256 => Achievement) public achievements; 

    /// @notice Mapping to track which users have which achievements
    mapping(address => mapping(string => bool)) public userAchievements;

    /// @notice Deploys the contract and sets the deployer as owner and admin.
    constructor() ERC721("AchievementBadge", "ACHV") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Mints an achievement NFT to a user if they don’t already have it.
    /// @dev Only callable by addresses with `MINTER_ROLE`.
    /// @param to The user who will receive the achievement.
    /// @param achievement The name of the achievement.
    function mint(address to, string memory achievement) external onlyRole(MINTER_ROLE) {
        require(!userAchievements[to][achievement], "Already has this achievement");

        _safeMint(to, nextTokenId);
        achievements[nextTokenId] = Achievement(achievement);
        userAchievements[to][achievement] = true;
        nextTokenId++;
    }

    /// @notice Checks if a user already owns a specific achievement.
    /// @param user The user to query.
    /// @param achievement The name of the achievement to check.
    /// @return True if the user has the achievement, false otherwise.
    function hasAchievement(address user, string memory achievement) external view returns (bool) {
        return userAchievements[user][achievement];
    }

    /// @notice Grants the `MINTER_ROLE` to an account, allowing it to mint achievements.
    /// @param account The address to grant the role to.
    function grantMinterRole(address account) public onlyOwner {
        grantRole(MINTER_ROLE, account);
    }

    /// @notice Revokes the `MINTER_ROLE` from an account.
    /// @param account The address to revoke the role from.
    function revokeMinterRole(address account) public onlyOwner {
        revokeRole(MINTER_ROLE, account);
    }

    /// @notice Prevents transfers of the NFT to enforce soulbound behavior.
    /// Only allows minting (from 0 → user) or burning (user → 0).
    /// @dev Overrides the ERC721 internal `_update` hook.
    /// @param to The recipient address.
    /// @param tokenId The tokenId being transferred.
    /// @param auth The caller authorized to perform the action.
    /// @return The previous owner of the token.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            revert("Soulbound: non-transferable");
        }

        return super._update(to, tokenId, auth);
    }

    /// @notice Indicates which interfaces the contract supports.
    /// @param interfaceId The interface identifier.
    /// @return True if supported, false otherwise.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}