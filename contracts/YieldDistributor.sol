// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyToken.sol";

contract YieldDistributor is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    PropertyToken public propertyToken;
    IERC20 public usdcToken;

    // tokenId -> user -> amount claimed
    mapping(uint256 => mapping(address => uint256)) public claimed;

    // tokenId -> total income deposited
    mapping(uint256 => uint256) public totalDeposited;

    event YieldDeposited(uint256 indexed tokenId, uint256 amount);
    event YieldClaimed(uint256 indexed tokenId, address indexed user, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, address _propertyToken, address _usdcToken) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        propertyToken = PropertyToken(_propertyToken);
        usdcToken = IERC20(_usdcToken);
    }

    function depositYield(uint256 tokenId, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        usdcToken.transferFrom(msg.sender, address(this), amount);
        totalDeposited[tokenId] += amount;
        emit YieldDeposited(tokenId, amount);
    }

    function claimable(uint256 tokenId, address user) public view returns (uint256) {
        uint256 userBalance = propertyToken.balanceOf(user, tokenId);
        uint256 totalSupply = propertyToken.totalSupply(tokenId);
        if (totalSupply == 0) {
            return 0;
        }
        uint256 userShare = (totalDeposited[tokenId] * userBalance) / totalSupply;
        return userShare - claimed[tokenId][user];
    }

    function claimYield(uint256 tokenId) public {
        uint256 amountToClaim = claimable(tokenId, msg.sender);
        require(amountToClaim > 0, "No yield to claim");

        claimed[tokenId][msg.sender] += amountToClaim;
        usdcToken.transfer(msg.sender, amountToClaim);

        emit YieldClaimed(tokenId, msg.sender, amountToClaim);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
