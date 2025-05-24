import { ethers } from 'ethers';
import {
  BalancerApi,
  SwapKind,
  Token,
  TokenAmount,
  VAULT,
  vaultV2Abi,
} from '@berachain-foundation/berancer-sdk';
import 'dotenv/config';

const HONEY_TOKEN_ADDRESS = '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce';
const IBGT_TOKEN_ADDRESS = '0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b';
const CHAIN_ID = 80094;

// Initialize provider and wallet
const RPC_URL = 'https://rpc.berachain.com/';
const provider = new ethers.JsonRpcProvider(RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('Private key is not set in environment variables');
}
const wallet = new ethers.Wallet(privateKey, provider);
const address = wallet.address;
console.log(`Using wallet address: ${address}`);
const balancerApi = new BalancerApi('https://api.berachain.com/', CHAIN_ID);

const honeyToken = new Token(CHAIN_ID, HONEY_TOKEN_ADDRESS, 18, 'HONEY');
const ibgtToken = new Token(CHAIN_ID, IBGT_TOKEN_ADDRESS, 18, 'IBGT');

async function main() {
  const tokenAmount = TokenAmount.fromHumanAmount(honeyToken, '1');

  const { paths: sorPaths, routes } =
    await balancerApi.sorSwapPaths.fetchSorSwapPaths({
      chainId: CHAIN_ID,
      tokenIn: honeyToken.address,
      tokenOut: ibgtToken.address,
      swapKind: SwapKind.GivenIn,
      swapAmount: tokenAmount,
    });

  console.log('SOR Paths:', sorPaths);
  console.log('Routes:', routes);

  // let assets = Array.from(
  //   new Set(
  //     routes.flatMap((route) =>
  //       route.hops.flatMap((hop) => [hop.tokenIn, hop.tokenOut])
  //     )
  //   )
  // );
  // // Convert SOR paths to batchSwap parameters
  // const batchSwapParams = {
  //   kind: SwapKind.GivenIn,
  //   swaps: routes.flatMap((route) =>
  //     route.hops.map((hop, index) => ({
  //       poolId: hop.poolId,
  //       assetInIndex: assets.indexOf(hop.tokenIn),
  //       assetOutIndex: assets.indexOf(hop.tokenOut),
  //       amount: index === 0 ? tokenAmount.amount : '0',
  //       userData: '0x',
  //     }))
  //   ),
  //   assets,
  //   funds: {
  //     sender: wallet.address,
  //     recipient: wallet.address,
  //     fromInternalBalance: false,
  //     toInternalBalance: false,
  //   },
  //   limits: assets.map(
  //     (_, i) =>
  //       i === 0
  //         ? tokenAmount.amount.toString() // Exact input amount for first token
  //         : ethers.MaxInt256.toString() // Max int256 for all other tokens
  //   ),
  //   deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
  // };

  // // Execute batch swap via Vault contract
  // const vaultContract = new ethers.Contract(
  //   VAULT[CHAIN_ID]!,
  //   vaultV2Abi,
  //   wallet
  // );

  // try {
  // const tx = await vaultContract.batchSwap!(
  //   batchSwapParams.kind,
  //   batchSwapParams.swaps,
  //   batchSwapParams.assets,
  //   batchSwapParams.funds,
  //   batchSwapParams.limits,
  //   batchSwapParams.deadline
  // );

  //   console.log('Transaction hash:', tx.hash);
  //   const receipt = await tx.wait();
  //   console.log('Transaction confirmed in block:', receipt.blockNumber);
  // } catch (error) {
  //   console.error('Transaction failed:', error);
  //   throw error;
  // }
}

main()
  .then(() => console.log('Swap paths fetched successfully'))
  .catch((error) => {
    console.error('Error fetching swap paths:', error);
    process.exit(1);
  });
