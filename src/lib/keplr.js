async function inKeplr(chainId, action) {
  if (chainId) {
    await window.keplr.enable(chainId);
    return await action();
  } else {
      throw "Keplr hasn't been initialized with a chain";
  }
}

export default {
  chainId: null,
  init(c) {
    this.chainId = c;
  },
  async getKey() {
    return inKeplr(this.chainId, async () => {
        return await window.keplr.getKey(this.chainId);
    });
  },
  async openOfflineSigner() {
    return inKeplr(this.chainId, async () => {
      return window.getOfflineSigner(this.chainId);
    });
  },

  addExperimental(experimental) {
    
  },
};
