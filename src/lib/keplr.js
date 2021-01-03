// async function inKeplr(chainId, action) {
//   if (chainId) {
//     await window.keplr.enable(chainId);
//     return await action();
//   } else {
//       throw "Keplr hasn't been initialized with a chain";
//   }
// }

// export default {
//   chainId: null,
//   constructor() {

//   },

//   init(c) {
//     this.chainId = c;
//   },
//   async getKey() {
//     return inKeplr(this.chainId, async () => {
//         return await window.keplr.getKey(this.chainId);
//     });
//   },
//   async openOfflineSigner() {
//     return inKeplr(this.chainId, async () => {
//       return window.getOfflineSigner(this.chainId);
//     });
//   },

//   addExperimental(experimental) {

//   },
// };

export default class Keplr {
  chainId;

  constructor(chainId) {
    this.chainId = chainId;
    this.command(() => {
      console.log("Document ready state: " + document.readyState);
      console.log("Keplr client ready, waiting to connet to " + this.chainId);
    });
  }

  async enable() {
    return await this.command(async () => {
      try {
        return await window.keplr.enable(this.chainId);
      } catch {
        throw "Keplr rejected the connection";
      }
    });
  }

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
