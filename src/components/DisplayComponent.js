import Moralis from "moralis/dist/moralis.min.js";
import React, { useEffect, useState } from "react";
import { useMoralisWeb3Api } from "react-moralis";

export const DisplayComponent = () => {
  const [collectionAddress, setCollectionAddress] = useState(
    "0x608c2feb6b80993b26ffb6fa84f454ad3ac38bf0"
  );
  const [totalNFTTrades, setTotalNFTTrdes] = useState();
  const [lowestValues, setLowestValues] = useState();
  const [traitNFTs, setTraitNFTs] = useState();
  const [traitTypes, setTraitTypes] = useState();
  const [traitResult, setTraitResult] = useState();
  const [traits, setTraits] = useState();
  const [lowestTraitValues, setLowestTraitValues] = useState();
  const [selectedTraitType, setSelectedTraitType] = useState("Select");
  const [selectedTraitTypeForSort, setSelectedTraitTypeForSort] =
    useState("Select");
  const [selectedTrait, setSelectedTrait] = useState("Select");
  const [traitSortData, setTraitSortData] = useState([]);
  const [traitRankData, setTraitRankData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const serverUrl = "https://oop2hhtnogj0.usemoralis.com:2053/server";
  const appId = "RUKN49vcmeNc0vHrSNyl5Z3MWvY0ILvd2uiBOxeE";
  Moralis.start({ serverUrl, appId });

  async function initializeApp() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
      currentUser = await Moralis.Web3.authenticate();
    }

    const options = {
      chain: "eth",
      addresses: "0x9712228cEeDA1E2dDdE52Cd5100B88986d1Cb49c",
    };
    const tokenMetadata = await Web3Api.token.getTokenMetadata(options);
    console.log("Dan-tokenMetadata==>", tokenMetadata);
  }
  const Web3Api = useMoralisWeb3Api();
  const setDefault = () => {
    setCollectionAddress("0x608c2feb6b80993b26ffb6fa84f454ad3ac38bf0");
  };

  // Calculate size with price
  const compare = (a, b) => {
    return a.price < b.price ? 1 : a.price > b.price ? -1 : 0;
  };
  // Get nft prices
  const fetchNFTTrades = async () => {
    const options = {
      address: collectionAddress,
      limit: "10000",
      chain: "eth",
    };
    const NFTTrades = await Web3Api.token.getNFTTrades(options);
    setTotalNFTTrdes(NFTTrades);
    // console.log("NFTTraids", NFTTrades);
    const newArray = NFTTrades.result.sort(compare);
    setLowestValues(newArray.slice(-2));
  };

  // Get Trait List
  const fetchAllTokenIds = async () => {
    let trait_list = [];
    const options = {
      address: collectionAddress,
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
  };

  //Click Start button
  const fetchStart = () => {
    fetchNFTTrades();
    fetchAllTokenIds();
    initializeApp();

    getTraitRanking();
  };

  const traitCompare = (a, b) => (a.val > b.val ? -1 : 1);

  const parseSnapShot = (result, array) => {
    array.map((element) => {
      if (element.metadata) {
        const json = JSON.parse(element.metadata);
        const attributes = json.attributes;
        const len = attributes.length;
        for (let i = 0; i < len; i++) {
          const key = attributes[i].trait_type;
          const val = attributes[i].value;
          const trait = result[key] ? result[key] : [];
          const index = trait.findIndex((element) => element.key === val);
          if (index === -1) {
            trait.push({ key: val, val: 1 });
          } else {
            trait[index].val += 1;
          }
          result[key] = trait;
        }
      }
    });
  };

  const getTraitRanking = async () => {
    let result = {};
    const options = {
      chain: "eth",
      address: collectionAddress,
    };
    let snapShot = await Web3Api.token.getAllTokenIds(options);
    const total = snapShot.total;
    parseSnapShot(result, snapShot.result);
    for (let i = 500; i < total; i += 500) {
      snapShot = await Web3Api.token.getAllTokenIds({
        ...options,
        offest: i,
      });
      parseSnapShot(result, snapShot.result);
    }
    const keys = Object.keys(result);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const array = result[keys[i]];
      array.sort(traitCompare);
      result[keys[i]] = array;
    }
    console.log(result);
    console.log(Object.keys(result));
    setTraitSortData(result);
    setIsLoading(false);
  };

  const handleSortedTrait = (e) => {
    setSelectedTraitTypeForSort(e);
    setTraitRankData(traitSortData[e]);
    console.log("SetTraitRandData", e, traitSortData[e]);
  };

  useEffect(() => {
    totalNFTTrades && fetchTypesofTrait();
    selectedTrait && fetchLowestByTrait();
  }, [selectedTraitType, selectedTraitTypeForSort, selectedTrait]);

  useEffect(() => {
    console.log("selectedTraitTypeForSort:", selectedTraitTypeForSort);
  }, [selectedTraitTypeForSort]);
  return (
    <>
      <div className="flex justify-center w-full items-center py-0">
        <p className="text-white text-2xl font-semibold w-[300px]">
          Input Collection: &nbsp;
        </p>
        <input
          type="text"
          className="px-2 outline-none rounded w-[400px] mr-2"
          onChange={(e) => setCollectionAddress(e.target.value)}
          value={collectionAddress}
        />
        <button
          className="bg-red-400 px-4 py-2 rounded mx-6 hover:bg-red-600 hover:text-white"
          onClick={() => setDefault()}
        >
          Default Address
        </button>
        <button
          className="bg-red-400 px-4 py-2 rounded mx-6 hover:bg-red-600 hover:text-white"
          onClick={fetchStart}
        >
          Start
        </button>
      </div>
      {/* Getting floor price of last two least values on open sea */}
      <div className="text-white text-3xl font-semibold ">
        - Floor price of last two least values on Opensea
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
        - Floor price of last two least values by trait on Opensea
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
      {traitSortData.length !== 0 ? (
        <div className="text-white text-xl font-semibold flex px-[10%]">
          {traitTypes && (
            <div className="text-black lowest_group flex justify-center p-4">
              <select
                className=""
                value={selectedTraitTypeForSort}
                onChange={(e) => handleSortedTrait(e.target.value)}
              >
                <option value="Select" disabled>
                  Select...
                </option>
                {traitTypes.map((item, i) => (
                  <option className="" id={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}
          {traitRankData !== [] && (
            <table className="w-screen bg-green-300">
              <tbody>
                <tr className="text-black">
                  <th>Trait</th>
                  <th>Score</th>
                  <th>Rank</th>
                  <th>Price</th>
                </tr>
                {traitRankData.map((item, i) => (
                  <tr className="text-gray-700">
                    <td>{item.key}</td>
                    <td>{item.val}</td>
                    <td>{i + 1}</td>
                    <td>price</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
