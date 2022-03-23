import React, { useEffect, useState } from "react";
import { useMoralisWeb3Api } from "react-moralis";

export const DisplayComponent = () => {
  const [totalNFTTrades, setTotalNFTTrdes] = useState();
  const [lowestValues, setLowestValues] = useState();
  const [traitNFTs, setTraitNFTs] = useState();
  const [traitTypes, setTraitTypes] = useState();
  const [traitResult, setTraitResult] = useState();
  const [traits, setTraits] = useState();
  const [lowestTraitValues, setLowestTraitValues] = useState();
  const [selectedTraitType, setSelectedTraitType] = useState("Select");
  const [selectedTrait, setSelectedTrait] = useState("Select");

  const Web3Api = useMoralisWeb3Api();

  // Calculate size with price
  const compare = (a, b) => {
    return a.price < b.price ? 1 : a.price > b.price ? -1 : 0;
  };
  // Get nft prices
  const fetchNFTTrades = async () => {
    const options = {
      address: "0x608c2feb6b80993b26ffb6fa84f454ad3ac38bf0",
      limit: "10000",
      chain: "eth",
    };
    const NFTTrades = await Web3Api.token.getNFTTrades(options);
    setTotalNFTTrdes(NFTTrades);
    console.log("NFTTraids", NFTTrades);
    const newArray = NFTTrades.result.sort(compare);
    setLowestValues(newArray.slice(-2));
  };

  // Get Trait List
  const fetchAllTokenIds = async () => {
    let trait_list = [];
    const options = {
      address: "0x608c2feb6b80993b26ffb6fa84f454ad3ac38bf0",
      chain: "eth",
    };
    const NFTs = await Web3Api.token.getAllTokenIds(options);
    console.log("NFTs", NFTs);
    setTraitNFTs(NFTs);
    console.log("traitNFTs", traitNFTs);

    // Get trait list
    NFTs &&
      JSON.parse(NFTs.result[0].metadata).attributes.map((item, key) => {
        trait_list.push(item.trait_type);
      });

    setTraitTypes(trait_list);
  };

  // Get Types of Trait
  const fetchTypesofTrait = () => {
    let result = {};
    console.log("aaaa", JSON.parse(traitNFTs.result[5].metadata));
    traitNFTs &&
      traitNFTs.result.map((item) => {
        if (typeof JSON.parse(item.metadata) === "object") {
          console.log("OK, this is object", JSON.parse(item.metadata));
          JSON.parse(item.metadata) &&
            JSON.parse(item.metadata).attributes.map((option) => {
              if (option.trait_type === selectedTraitType) {
                result[option.value] = !!result[option.value]
                  ? [...result[option.value], item.token_id]
                  : [item.token_id];
              }
            });
        } else {
          console.log(JSON.parse(item.metadata));
        }
      });
    setTraits(Object.keys(result));
    setTraitResult(result);
  };
  // Get Lowest NFT by trait
  const fetchLowestByTrait = () => {
    console.log("traitResult", traitResult);
    console.log("selectedTrait", selectedTrait);
    let result = [];
    totalNFTTrades &&
      traitResult &&
      totalNFTTrades.result.map((item, key) => {
        item.token_ids.map((option, key) => {
          traitResult[`${selectedTrait}`].indexOf(`${option}`) >= 0
            ? result.push(item)
            : console.log("false");
        });
      });

    const newArray = result.sort(compare);
    setLowestTraitValues(newArray.length > 2 ? newArray.slice(-2) : newArray);
    console.log("lowestTraitValues", lowestTraitValues);
    console.log("newArray", newArray);
  };

  //Click Start button
  const fetchStart = () => {
    fetchNFTTrades();
    fetchAllTokenIds();
    console.log("This is starting button ===>");
  };

  useEffect(() => {
    totalNFTTrades && fetchTypesofTrait();
    selectedTrait && fetchLowestByTrait();
    console.log("Selected option", selectedTraitType);
  }, [selectedTraitType, selectedTrait]);
  return (
    <>
      <div className="flex justify-center w-full items-center py-0">
        <button
          className="bg-red-400 px-4 py-2 rounded mx-6 hover:bg-red-600 hover:text-white"
          onClick={fetchStart}
        >
          Start
        </button>
      </div>
      {/* Getting floor price of last two least values on open sea */}
      <div className="text-white text-3xl font-semibold ">
        - Getting floor price of last two least values on Opensea
      </div>
      {lowestValues && (
        <div className="lowest_group flex justify-center p-4">
          {lowestValues.map((item) => (
            <div
              className="lowest_item text-black mx-12 bg-red-300 p-4 rounded"
              key={item.token_ids[0]}
            >
              <p>Token ID: {item.token_ids[0]}</p>
              <p>Price: {item.price}</p>
            </div>
          ))}
        </div>
      )}
      {/* Getting floor price of last two least values by trait on open sea */}
      <div className="text-white text-3xl font-semibold ">
        - Getting floor price of last two least values by trait on Opensea
      </div>
      <div className="flex justify-center">
        {traitTypes && (
          <div className="lowest_group flex justify-center p-4">
            <select
              className=""
              value={selectedTraitType}
              onChange={(e) => setSelectedTraitType(e.target.value)}
            >
              <option value="Select" disabled>
                Select...
              </option>
              {traitTypes.map((item, id) => (
                <option className="" id={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
        {traits && (
          <div className="lowest_group flex justify-center p-4">
            <select
              className=""
              value={selectedTrait}
              onChange={(e) => setSelectedTrait(e.target.value)}
            >
              <option value="Select" disabled>
                Select...
              </option>
              {traits.map((item, id) => (
                <option className="" id={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
        {lowestTraitValues && (
          <div className="lowest_group flex justify-center p-4">
            {lowestTraitValues.map((item) => (
              <div
                className="lowest_item text-black mx-12 bg-red-300 p-4 rounded"
                key={item.token_ids[0]}
              >
                <p>Token ID: {item.token_ids[0]}</p>
                <p>Price: {item.price}</p>
              </div>
            ))}
          </div>
        )}
        {lowestTraitValues === [] && (
          <div className="lowest_group flex justify-center p-4">
            {lowestTraitValues.map((item) => (
              <div
                className="lowest_item text-black mx-12 bg-red-300 p-4 rounded"
                key={item.token_ids[0]}
              >
                <p>There is not still any prices</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-white text-3xl font-semibold ">
        - Getting metadata from the ethereum blockchainby trait ranking
      </div>
    </>
  );
};
