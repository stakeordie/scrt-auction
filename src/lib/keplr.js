const KEPLR_ADDRESS_REFRESH_RATE = 1000;

export default class Keplr {
  chainId;
  chainName;
  restUrl;
  rpcUrl;

  address;
  onAddressChanged;

  onError;

  checkInterval;

  constructor(chainId, chainName, restUrl, rpcUrl, loadListener, errorListener) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.restUrl = restUrl;
    this.rpcUrl = rpcUrl;

    this.address = null;

    this.onError = errorListener;
    
    window.onload = (async () => {
      if(typeof loadListener === 'function') {
        loadListener();
      }
      this.checkInterval = setInterval(() => {
        this.checkAddressUpdates();
      }, KEPLR_ADDRESS_REFRESH_RATE);
      this.checkAddressUpdates();
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

  async checkAddressUpdates() {
    return await this.command(async () => {
      try {
        const newAddress = (await this.getSigner().getAccounts())[0].address;
        if(this.address != newAddress && typeof this.onAddressChanged === 'function') {
          this.address = newAddress;
          this.onAddressChanged(newAddress);
        }
      } catch(err) {
      }
    });
  }

  // Returns the selected key using Keplr's getKey() method
  // Otherwise it returns null
  async getSelectedKey() {
    return await this.command(async () => {
      try {
        return await window.keplr.getKey(this.chainId);
      } catch(err) {
        throw err;
      }
    });
  }
  
  getSigner() {
    return window.getOfflineSigner(this.chainId);
  }

  getSeed() {
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
    try {
      if (!window.getOfflineSigner || !window.keplr) {
        throw "Keplr extension is not installed";
      }
      return await command();
    } catch(err) {
      throw err;
    }
  }

}
