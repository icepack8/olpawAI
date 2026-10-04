// ============================================================
// AUTO-GENERATED oleh scripts/deploy.cjs - JANGAN EDIT MANUAL
// Deployed on Ethereum Sepolia (Chain ID 11155111)
// ============================================================
export const CONTRACT_DEPLOYED = true;
export const CONTRACT_ADDRESS = "0xD17e2CBb6F2A64C4b7b4aE065ea7e899008E1834";
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      }
    ],
    "name": "CatDNAVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "breed",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "CatRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "CatTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dnaHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "purityScore",
        "type": "uint8"
      }
    ],
    "name": "DNAProfileSaved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "motherId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fatherId",
        "type": "uint256"
      }
    ],
    "name": "ParentsSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "catCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "dataHashExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      }
    ],
    "name": "getCat",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "breed",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gender",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "dateOfBirth",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "photoURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "dataHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "dnaHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "purityScore",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "motherId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fatherId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "dnaVerified",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "registeredAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct OLPawRegistry.Cat",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getCatsByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      }
    ],
    "name": "markDNAVerified",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "breed",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "gender",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dateOfBirth",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "photoURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "motherId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fatherId",
        "type": "uint256"
      }
    ],
    "name": "registerCat",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "dnaHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "purityScore",
        "type": "uint8"
      }
    ],
    "name": "saveDNAProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "photoURI",
        "type": "string"
      }
    ],
    "name": "setPhotoURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "catId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferCat",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
export const SEPOLIA_CHAIN_ID = 11155111;
