import Keplr from "../lib/keplr";

export default {
  install(Vue, options) {
    const keplrWallet = new Keplr(
      options.chainId,
      options.chainName,
      options.restUrl,
      options.rpcUrl,
      // On load
      () => {
        options.onLoad();
      },
      // On address update
      (newAddress) => {
        console.log("Setting new address:", newAddress);
      },
      // When something goes wrong
      (err) => {
          console.error(err);
      }
    );

    Object.defineProperty(Vue.prototype, "$keplr", { value: keplrWallet });
  },
};
