const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsedPriceFeed; //oracle type setting up
  if (developmentChains.includes(network.name)) {
    const ethUsedAggregator = await get("MockV3Aggregator");
    ethUsedPriceFeed = ethUsedAggregator.address;
  } else {
    ethUsedPriceFeed = networkConfig[chainId]["ethUsedPriceFeed"];
  }

  log("Deploying FundMe and waiting for confirmations...");

  const args = [ethUsedPriceFeed];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockconfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("-------------------------------------------------------");
    await verify(fundMe.address, args);
    log("Verified contract!");
  }

  log("-------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
