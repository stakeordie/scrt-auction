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
      return await window.keplr.enable(this.chainId);
    });
  }

  async getKey() {
    return await this.command(async () => {
      return await window.keplr.getKey(this.chainId);
    });
  }

  async command(command) {
    const decorator = async () => {
      if (!window.getOfflineSigner || !window.keplr) {
        throw "Keplr extension is not installed"
      }
      return await command();
    }

    if(document.readyState === "complete") {
      return await decorator();
    } else {

      // All this into a promise .
      // and this is were my kids get in the way
      window.onload = decorator;
    }
  }

}