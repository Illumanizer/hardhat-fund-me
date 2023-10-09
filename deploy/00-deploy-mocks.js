
const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");  


module.exports=async ({deployments, getNamedAccounts})=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    const chainId=network.config.chainId;

    if(developmentChains.includes(network.name)){
        log("-------------------------------------------------------")
        log("Local network detected! Deploying Mocks");
        await deploy("MockV3Aggregator",{
            from:deployer,
            log:true,
            args:[DECIMALS,INITIAL_PRICE]
        });
        log("Mocks Deployed");
        log("-------------------------------------------------------")
    }
}

module.exports.tags=["all","mocks"] 
