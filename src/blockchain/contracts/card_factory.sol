// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Import the Immutable X-specific packages
import "https://contracts.immutable.com/eth/nft/api/ERC721ImmutableX.sol";
import "https://contracts.immutable.com/eth/nft/api/IUnbundledERC721.sol";

contract CardFactory is ERC721, ERC721ImmutableX, IUnbundledERC721 {
    using Strings for uint256;
    
    string private baseURI;
    
    constructor(string memory _baseURI) ERC721("Crypties", "CRPTS") {
        baseURI = _baseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        string memory tokenURI = string(abi.encodePacked(baseURI, tokenId.toString()));
        return tokenURI;
    }
    
    function mintNFT(uint256 tokenId, string memory metadataURI) external {
        _mint(msg.sender, tokenId);
        
        // Call the Immutable X-specific function to set the metadata URI
        setTokenMetadataURI(tokenId, metadataURI);
        
        // Call the Immutable X-specific function to create an L2 token
        _finalizeInclusion();
    }
    
    function setBaseURI(string memory _baseURI) external {
        baseURI = _baseURI;
    }
    
    // Override the base contract's `_burn` function
    function _burn(uint256 tokenId) internal override(ERC721, ERC721ImmutableX) {
        ERC721ImmutableX._burn(tokenId);
    }
}
