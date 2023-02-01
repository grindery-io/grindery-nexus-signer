# grindery-nexus-signer

Secure signing agent for Grindery Nexus

## Development setup

1. Create a `secp256k1` key on GCP key management

2. Set `ETH_KEY_PATH` to full path of the key, including version

3. Run `npm run call` to run JSON-RPC method, like `npm run call ethGetAddress '{}'`
