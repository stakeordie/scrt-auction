export default class Keplr {
  chainId;
  chainName;
  restUrl;
  rpcUrl;

  enabled;

  constructor(chainId, chainName, restUrl, rpcUrl) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.restUrl = restUrl;
    this.rpcUrl = rpcUrl;
    
    
    this.command(async () => {      
      console.log("Document ready state: " + document.readyState);
      console.log("Keplr client ready, waiting to connet to " + this.chainId);
    });
  }

  // Prompts the user to enable the wallet
  // access to their accounts in the specified network.
  async enable() {
    return await this.command(async () => {
      try {
        await window.keplr.enable(this.chainId);
      } catch {
        throw "Keplr rejected the connection";
      }
    });
  }

  // Returns the selected address in the wallet if any
  // Otherwise it returns null
  async getSelectedAddress() {
    return await this.command(async () => {
      try {
        const key = await window.keplr.getKey(this.chainId);
        return key.bech32Address;
      } catch {
        return null;
      }
    });
  }
  
  async getSigner() {
    return window.getOfflineSigner(this.chainId);
  }

  async getSeed() {
    return window.getEnigmaUtils(this.chainId);
  }


  async suggestExperimental(experimentalChain) {
    return await this.command(async () => {
      if (window.keplr.experimentalSuggestChain) {
        return await window.keplr.experimentalSuggestChain(experimentalChain);
      } else {
        console.log("Unexpected: Experimental chains are not supported");
      }
    });
  }

  // This Kelpr wallet specific method allows to call for the 
  // window.keplr functions while always properly waiting for
  // the window to load and checking that the Keplr extension
  // is installed
  async command(command) {
    const execute = async () => {
      if (!window.getOfflineSigner || !window.keplr) {
        throw "Keplr extension is not installed";
      }
      return await command();
    };

    if (document.readyState === "complete") {
      return await execute();
    } else {
      return new Promise((resolve, reject) => {
        window.onload = async () => {
          try {
            resolve(await execute());
          } catch(err) {
            reject(err);
          }
        };
      });
    }
  }

}
