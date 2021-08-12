import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const deploymentResult = await deploy('MiniYak', {
        from: deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true
    });
    if (deploymentResult.newlyDeployed) {
        console.log(`- MiniYak deployed at ${deploymentResult.address} using ${deploymentResult.receipt?.gasUsed} gas`);
    } else {
        console.log(`- Deployment skipped, using previous deployment at: ${deploymentResult.address}`)
    }
};

export default func;