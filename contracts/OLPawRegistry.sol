// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title OLPawRegistry - Pet Identity & DNA Verification (BSC Testnet)
/// @notice Registrasi kucing, verifikasi DNA, family tree on-chain
contract OLPawRegistry {
    struct Cat {
        uint256 id;
        string name;
        string breed;
        string gender; // "Male" | "Female"
        uint256 dateOfBirth; // unix timestamp
        string photoURI; // ipfs://... (opsional)
        bytes32 dataHash; // keccak256 JSON lengkap off-chain
        bytes32 dnaHash; // keccak256 DNA profile JSON
        uint8 purityScore; // 0 - 100
        uint256 motherId; // 0 = tidak diketahui
        uint256 fatherId; // 0 = tidak diketahui
        bool dnaVerified;
        address owner;
        uint256 registeredAt;
    }

    uint256 public catCount;
    mapping(uint256 => Cat) private _cats;
    mapping(address => uint256[]) private _ownerCats;
    mapping(bytes32 => bool) public dataHashExists;

    event CatRegistered(
        uint256 indexed catId,
        address indexed owner,
        string name,
        string breed,
        bytes32 dataHash
    );
    event DNAProfileSaved(uint256 indexed catId, bytes32 dnaHash, uint8 purityScore);
    event CatDNAVerified(uint256 indexed catId);
    event ParentsSet(uint256 indexed catId, uint256 motherId, uint256 fatherId);
    event CatTransferred(uint256 indexed catId, address indexed from, address indexed to);

    modifier onlyCatOwner(uint256 catId) {
        require(_cats[catId].owner == msg.sender, "Not the cat owner");
        _;
    }

    modifier catExists(uint256 catId) {
        require(catId > 0 && catId <= catCount, "Cat does not exist");
        _;
    }

    function registerCat(
        string calldata name,
        string calldata breed,
        string calldata gender,
        uint256 dateOfBirth,
        string calldata photoURI,
        bytes32 dataHash,
        uint256 motherId,
        uint256 fatherId
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name is required");
        require(!dataHashExists[dataHash], "Duplicate cat data");

        if (motherId != 0) {
            require(motherId <= catCount, "Invalid mother");
            require(
                keccak256(bytes(_cats[motherId].gender)) == keccak256(bytes("Female")),
                "Mother must be female"
            );
        }
        if (fatherId != 0) {
            require(fatherId <= catCount, "Invalid father");
            require(
                keccak256(bytes(_cats[fatherId].gender)) == keccak256(bytes("Male")),
                "Father must be male"
            );
        }

        catCount += 1;
        uint256 id = catCount;

        _cats[id] = Cat({
            id: id,
            name: name,
            breed: breed,
            gender: gender,
            dateOfBirth: dateOfBirth,
            photoURI: photoURI,
            dataHash: dataHash,
            dnaHash: bytes32(0),
            purityScore: 0,
            motherId: motherId,
            fatherId: fatherId,
            dnaVerified: false,
            owner: msg.sender,
            registeredAt: block.timestamp
        });

        _ownerCats[msg.sender].push(id);
        dataHashExists[dataHash] = true;

        emit CatRegistered(id, msg.sender, name, breed, dataHash);
        if (motherId != 0 || fatherId != 0) {
            emit ParentsSet(id, motherId, fatherId);
        }
        return id;
    }

    function saveDNAProfile(
        uint256 catId,
        bytes32 dnaHash,
        uint8 purityScore
    ) external onlyCatOwner(catId) catExists(catId) {
        require(purityScore <= 100, "Purity must be 0-100");
        Cat storage cat = _cats[catId];
        cat.dnaHash = dnaHash;
        cat.purityScore = purityScore;
        emit DNAProfileSaved(catId, dnaHash, purityScore);
    }

    function markDNAVerified(uint256 catId) external onlyCatOwner(catId) catExists(catId) {
        _cats[catId].dnaVerified = true;
        emit CatDNAVerified(catId);
    }

    function setPhotoURI(uint256 catId, string calldata photoURI)
        external
        onlyCatOwner(catId)
        catExists(catId)
    {
        _cats[catId].photoURI = photoURI;
    }

    function transferCat(uint256 catId, address to)
        external
        onlyCatOwner(catId)
        catExists(catId)
    {
        require(to != address(0), "Invalid recipient");
        Cat storage cat = _cats[catId];
        cat.owner = to;
        _ownerCats[to].push(catId);
        emit CatTransferred(catId, msg.sender, to);
    }

    function getCat(uint256 catId) external view catExists(catId) returns (Cat memory) {
        return _cats[catId];
    }

    function getCatsByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerCats[owner];
    }
}
