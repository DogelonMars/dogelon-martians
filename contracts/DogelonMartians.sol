pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract DogelonMartians is ERC721 {
    address public immutable owner;
    uint256 public price = 10 ether / 125; // 0.08 ETH
    bool public saleActive;
    uint256 public currentSupply;
    uint256 public constant MAX_MARTIANS = 10000;
    string public baseUri;
    bool public uriLocked = false;

    constructor(string memory name, string memory symbol, string memory _uri) ERC721(name, symbol) {
        owner = msg.sender;
        baseUri = _uri;
    }

    function mint(uint256 amountToBuy) public payable {
        require(currentSupply < MAX_MARTIANS, "sold out");
        require(saleActive, "sale not active");
        require(amountToBuy >= 1 && amountToBuy <= 10, "can only mint 1 to 10 at a time");
        require(msg.value == price * amountToBuy, "wrong ETH amount sent");

        for (uint256 i = 0; i < amountToBuy; i++) {
            _mint(msg.sender, ++currentSupply);
            if (currentSupply == MAX_MARTIANS) {
                saleActive = false;
                payable(msg.sender).transfer((amountToBuy - i - 1) * price);
                break;
            }
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function activate() public {
        require(msg.sender == owner, "not owner");
        saleActive = true;
    }

    function isSoldOut() public view returns (bool) {
        return currentSupply >= MAX_MARTIANS;
    }

    function withdraw() public {
        require(msg.sender == owner, "not owner");
        payable(owner).transfer(address(this).balance);
    }

    function setPrice(uint256 _price) external {
        require(msg.sender == owner, "not owner");
        price = _price;
    }

    function setBaseUri(string memory newBaseUri) external {
        require(msg.sender == owner, "not owner");
        require(uriLocked == false, "uri locked");
        baseUri = newBaseUri;
    }

    function lockUri() public {
        require(msg.sender == owner, "not owner");
        require(uriLocked == false, "uri already locked");
        uriLocked = true;
    }
}