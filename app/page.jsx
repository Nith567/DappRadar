'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const fetchContractInfo = async (contractAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://wiser-intensive-darkness.quiknode.pro/${process.env.Key}/`
  );
  const network = await provider.send('dr_dappSearch', [contractAddress]);
  return network;
};

const SearchPage = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchContractInfo(contractAddress);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (contractAddress) {
      fetchData();
    }
  }, [contractAddress]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <input
        type="text"
        placeholder="Enter contract address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      />
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}
      {data && (
        <div>
          <h2 className="text-2xl font-bold mb-2">{data.result.results[0].name}</h2>
          <p className="mb-4">{data.result.results[0].description}</p>
          <div className="flex flex-wrap mb-4">
            {data.result.results[0].socialLinks.map((link) => (
              <a
                key={link.type}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2 mb-2 text-blue-500 hover:underline"
              >
                {link.type}
              </a>
            ))}
          </div>
          <p>
            Website:{' '}
            <a
              href={data.result.results[0].website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {data.result.results[0].website}
            </a>
          </p>
          <p className="mb-4">Categories: {data.result.results[0].categories.join(', ')}</p>
          {/* Add more details based on the structure of your data */}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
