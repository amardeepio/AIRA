// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";


/**
 * @title PropertyToken
 * @dev An upgradeable ERC1155 contract for tokenizing properties.
 * It includes features for ownership, pausing transfers, and upgradeability (UUPS).
 */
contract PropertyToken is
    Initializable,
    ERC1155SupplyUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    PausableUpgradeable
{
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tokenURIs;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract.
     * @param initialOwner The address of the initial owner.
     */
    function initialize(address initialOwner) public initializer {
        __ERC1155_init(""); // Base URI is unused as we override the uri() function.
        __ERC1155Supply_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        __Pausable_init();
    }

    /**
     * @dev Pauses all token transfers.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev See {IERC1155MetadataURI-uri}.
     * Returns the URI for a given token ID.
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(totalSupply(tokenId) > 0, "PropertyToken: token does not exist");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Sets the URI for a given token ID.
     * @param tokenId The ID of the token.
     * @param newuri The new URI for the token.
     */
    function setURI(uint256 tokenId, string memory newuri) public onlyOwner {
        require(totalSupply(tokenId) > 0, "PropertyToken: token does not exist");
        _tokenURIs[tokenId] = newuri;
        emit URI(newuri, tokenId);
    }

    /**
     * @dev Mints a new property token.
     * @param to The address to mint the tokens to.
     * @param amount The number of fractional shares to mint.
     * @param uriValue The metadata URI for the new property token.
     * @return The ID of the newly minted token.
     */
    function mintProperty(address to, uint256 amount, string memory uriValue) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _mint(to, tokenId, amount, "");
        _tokenURIs[tokenId] = uriValue;
        emit URI(uriValue, tokenId);
        return tokenId;
    }

   /**
     * @dev Hook that is called before any token transfer.
     * Overridden to apply the 'whenNotPaused' modifier to all transfers.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    /**
     * @dev Authorizes an upgrade to a new implementation contract.
     * Required for UUPS upgradeability. Restricted to the owner.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}