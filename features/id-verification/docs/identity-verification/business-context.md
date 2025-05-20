# ID Verification Feature - Business Context

## Purpose

The ID Verification feature enables users (MCs and MC bookers) to verify their identity within the MC Booking Platform (MBP). This verification process ensures trust and security in the platform by validating that users are who they claim to be.

## Business Problems Solved

1. **Trust and Safety**: Creates a secure environment where MCs and bookers can confidently engage in business transactions
2. **Fraud Prevention**: Reduces the risk of fake accounts and identity fraud
3. **Legal Compliance**: Ensures proper documentation and verification of users' identities for legal and contractual purposes

## When It's Triggered

-   When users access the "Xác minh danh tính" (Identity Verification) option in their settings screen
-   The verification process is optional but recommended for building trust on the platform

## Integration Points

-   Uses FPT.AI's ID Recognition API for processing ID card images
-   Stores verification data in two main tables:
    -   `user_id_verification`: Tracks the verification process and stores image URLs
    -   `id_info`: Stores the extracted information from the ID card
