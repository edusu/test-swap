import axios from 'axios';

const defillamaUrl = 'https://coins.llama.fi';

export async function getPrice(chain: string, token: string) {
  try {
    const response = await axios.get(
      `${defillamaUrl}/prices/current/${chain}:${token}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching price for ${token} on ${chain}:`, error);
    return null;
  }
}

export async function getPercentageChange(
  chain: string,
  token: string,
  period: string
) {
  try {
    const response = await axios.get(
      `${defillamaUrl}/percentage/${chain}:${token}?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching percentage change for ${token} on ${chain}:`,
      error
    );
    return null;
  }
}
