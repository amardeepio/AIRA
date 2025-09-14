// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyToken.sol";

contract Marketplace is Initializable, OwnableUpgradeable, UUPSUpgradeable, PausableUpgradeable, ERC1155HolderUpgradeable {

    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerFraction;
    }

    PropertyToken public propertyToken;
    IERC20 public usdcToken;

    uint256 public platformFeeBps; // Platform fee in basis points (1% = 100)

    mapping(uint256 => mapping(address => Listing)) public listings;

    event PropertyListed(address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 pricePerFraction);
    event PropertySold(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 amount, uint256 pricePerFraction);
    event ListingCancelled(address indexed seller, uint256 indexed tokenId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, address _propertyToken, address _usdcToken, uint256 _platformFeeBps) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ERC1155Holder_init();

        propertyToken = PropertyToken(_propertyToken);
        usdcToken = IERC20(_usdcToken);
        platformFeeBps = _platformFeeBps;
    }

    function listProperty(uint256 tokenId, uint256 amount, uint256 pricePerFraction) public whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerFraction > 0, "Price must be greater than 0");
        require(propertyToken.balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");

        propertyToken.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        listings[tokenId][msg.sender] = Listing(msg.sender, tokenId, amount, pricePerFraction);

        emit PropertyListed(msg.sender, tokenId, amount, pricePerFraction);
    }

    function buyProperty(address seller, uint256 tokenId, uint256 amount) public whenNotPaused {
        Listing storage listing = listings[tokenId][seller];
        require(listing.seller != address(0), "Listing does not exist");
        require(listing.amount >= amount, "Not enough fractions in listing");

        uint256 totalPrice = amount * listing.pricePerFraction;
        uint256 fee = (totalPrice * platformFeeBps) / 10000;
        uint256 sellerProceeds = totalPrice - fee;

        require(usdcToken.balanceOf(msg.sender) >= totalPrice, "Insufficient USDC balance");

        usdcToken.transferFrom(msg.sender, seller, sellerProceeds);
        usdcToken.transferFrom(msg.sender, owner(), fee);

        listing.amount -= amount;
        propertyToken.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");

        if (listing.amount == 0) {
            delete listings[tokenId][seller];
        }

        emit PropertySold(seller, msg.sender, tokenId, amount, listing.pricePerFraction);
    }

    function cancelListing(uint256 tokenId) public {
        Listing storage listing = listings[tokenId][msg.sender];
        require(listing.seller != address(0), "Listing does not exist");

        uint256 amount = listing.amount;
        delete listings[tokenId][msg.sender];

        propertyToken.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");

        emit ListingCancelled(msg.sender, tokenId);
    }

    function setPlatformFee(uint256 _platformFeeBps) public onlyOwner {
        platformFeeBps = _platformFeeBps;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
