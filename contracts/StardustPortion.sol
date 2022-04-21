// SPDX-License-Identifier: MIT

// ░██████╗████████╗░█████╗░██████╗░██████╗░██╗░░░██╗░██████╗████████╗
// ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░░░██║██╔════╝╚══██╔══╝
// ╚█████╗░░░░██║░░░███████║██████╔╝██║░░██║██║░░░██║╚█████╗░░░░██║░░░
// ░╚═══██╗░░░██║░░░██╔══██║██╔══██╗██║░░██║██║░░░██║░╚═══██╗░░░██║░░░
// ██████╔╝░░░██║░░░██║░░██║██║░░██║██████╔╝╚██████╔╝██████╔╝░░░██║░░░
// ╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░░╚═════╝░╚═════╝░░░░╚═╝░░░

// ██████╗░░█████╗░██████╗░████████╗██╗░█████╗░███╗░░██╗
// ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║██╔══██╗████╗░██║
// ██████╔╝██║░░██║██████╔╝░░░██║░░░██║██║░░██║██╔██╗██║
// ██╔═══╝░██║░░██║██╔══██╗░░░██║░░░██║██║░░██║██║╚████║
// ██║░░░░░╚█████╔╝██║░░██║░░░██║░░░██║╚█████╔╝██║░╚███║
// ╚═╝░░░░░░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝


pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Catnip is ERC721, Ownable, ReentrancyGuard {
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private supply;

  string public uriPrefix = "";
  string public uriSuffix = ".json";
  string public hiddenMetadataUri;

  uint256 public cost = 0 ether;
  uint256 public maxSupply = 5000;
  uint256 public maxMintAmountPerTx = 1;
  uint256 public maxNFTPerAccount = 1;
  mapping(address => uint256) public addressMintedBalance;
  bytes32 public whitelistMerkleRoot;

  bool public ALpaused = true;
  bool public revealed = false;

  constructor() ERC721("Catnip", "SP") {
    setHiddenMetadataUri("ipfs://QmaqHGmg65CMXRFcn222ie1CKmHsoHAbFzfbPGQDnDKe3b/hidden.json");
    _mintLoop(msg.sender, 25);
  }

// Modifier 
  modifier mintCompliance(uint256 _mintAmount) {
    require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, "Invalid mint amount!");
    require(_mintAmount + addressMintedBalance[msg.sender] <= maxNFTPerAccount, "You reach maximum NFTs per address!");
    _;
  }

  modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address does not exist in Allow list."
        );
        _;
  }

  function totalSupply() public view returns (uint256) {
    return supply.current();
  }

  function mintAllowList(uint256 _mintAmount , bytes32[] calldata merkleProof) 
    public 
    payable 
    nonReentrant 
    isValidMerkleProof(merkleProof, whitelistMerkleRoot) 
  {
    require(!ALpaused, "The contract is paused!");
    uint256 ownerMintedCount = addressMintedBalance[msg.sender];
 
    require(
      ownerMintedCount + _mintAmount <= maxNFTPerAccount,
      "Max NFT per address exceeded for Allow list."
    );
    require(msg.value >= cost * _mintAmount, "Allow list : insufficient funds.");
    require(
      _mintAmount <= maxMintAmountPerTx,
      "Max mint amount per transaction exceeded."
    );
    require(
      supply.current() + _mintAmount <= maxSupply,
      "Max NFT Allow list limit exceeded please wait for public sale round."
    );

    _mintLoop(msg.sender, _mintAmount);
  }

  
  function mintForAddress(uint256 _mintAmount, address _receiver) public onlyOwner {
    require(
      supply.current() + _mintAmount <= maxSupply,
      "Max NFT limit exceeded."
    );
    _mintLoop(_receiver, _mintAmount);
  }

  function burnFeliz(uint256 tokenId) public { 
     require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
    uint256 currentTokenId = 1;
    uint256 ownedTokenIndex = 0;
  
    while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply) {
      if (_exists(currentTokenId)) {
        address currentTokenOwner = ownerOf(currentTokenId);

        if (currentTokenOwner == _owner) {
          ownedTokenIds[ownedTokenIndex] = currentTokenId;

          ownedTokenIndex++;
        }
      } 
      
      currentTokenId++;
    }

    return ownedTokenIds;
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(_tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    if (revealed == false) {
      return hiddenMetadataUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix))
        : "";
  }

// SETTING parameter

  function setRevealed(bool _state) external onlyOwner {
    revealed = _state;
  }

  function setCost(uint256 _cost) external onlyOwner {
    cost = _cost;
  }

  function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) external onlyOwner {
    maxMintAmountPerTx = _maxMintAmountPerTx;
  }

  function setMaxNFTPerAccount(uint256 _maxNFT) external onlyOwner {
    maxNFTPerAccount = _maxNFT;
  }

  function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
    hiddenMetadataUri = _hiddenMetadataUri;
  }

  function setUriPrefix(string memory _uriPrefix) external onlyOwner {
    uriPrefix = _uriPrefix;
  }

  function setUriSuffix(string memory _uriSuffix) external onlyOwner {
    uriSuffix = _uriSuffix;
  }

  function setALPaused(bool _state) external onlyOwner {
    ALpaused = _state;
  }

  function setWhitelistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        whitelistMerkleRoot = merkleRoot;
  }


  function withdraw() public onlyOwner {
    // This will send to multiSig address for 80% of the initial sale.
    // =============================================================================
    // This will transfer the remaining contract balance to the owner.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }

  function _mintLoop(address _receiver, uint256 _mintAmount) internal {
    for (uint256 i = 0; i < _mintAmount; i++) {
      supply.increment();
      addressMintedBalance[_receiver]++;
      _safeMint(_receiver, supply.current());
    }
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return uriPrefix;
  }
}