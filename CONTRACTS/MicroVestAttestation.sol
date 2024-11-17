// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "contracts/MicroVestBase.sol";

contract MicroVestAttestation is MicroVestBase {
    // State variables
    ISP public signProtocol;
    uint64 public investmentSchemaId;
    uint64 public kycSchemaId;
    uint64 public poolSchemaId;
    
    // Events
    event AttestationCreated(uint64 indexed attestationId, string attestationType);
    
    constructor(address _signProtocol) {
        signProtocol = ISP(_signProtocol);
    }
    
    function setSchemaIds(
        uint64 _investmentSchema,
        uint64 _kycSchema,
        uint64 _poolSchema
    ) external onlyAdmin {
        investmentSchemaId = _investmentSchema;
        kycSchemaId = _kycSchema;
        poolSchemaId = _poolSchema;
    }
    
    function createInvestmentAttestation(
        address investor,
        uint256 poolId,
        uint256 amount,
        uint256 timestamp
    ) external returns (uint64) {
        require(investmentSchemaId != 0, "Schema not set");
        
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(investor);
        
        bytes memory data = abi.encode(poolId, amount, timestamp);
        
        Attestation memory attestation = Attestation({
            schemaId: investmentSchemaId,
            linkedAttestationId: 0,
            attestTimestamp: uint64(block.timestamp),
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: data
        });
        
        uint64 attestationId = signProtocol.attest(attestation, "", "", "");
        emit AttestationCreated(attestationId, "INVESTMENT");
        return attestationId;
    }
    
    function createPoolAttestation(
        address creator,
        uint256 poolId,
        string memory symbol,
        uint256 targetAmount
    ) external returns (uint64) {
        require(poolSchemaId != 0, "Schema not set");
        
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(creator);
        
        bytes memory data = abi.encode(poolId, symbol, targetAmount, block.timestamp);
        
        Attestation memory attestation = Attestation({
            schemaId: poolSchemaId,
            linkedAttestationId: 0,
            attestTimestamp: uint64(block.timestamp),
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: data
        });
        
        uint64 attestationId = signProtocol.attest(attestation, "", "", "");
        emit AttestationCreated(attestationId, "POOL");
        return attestationId;
    }
}