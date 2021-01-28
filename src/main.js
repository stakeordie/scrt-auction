import "@fontsource/hind/600.css"
import "@fontsource/montserrat"
import "@fontsource/montserrat/600.css"
import "animate.css"
import "./sass/style.scss"


import Flare from "@lkmx/flare"

import VKeys from "./plugins/vkeys"
import Keplr from "./plugins/keplr"
import ScrtJs from "./plugins/scrt"
import AuctionsApi from "./plugins/auctions"

import DefaultLayout from "~/layouts/DefaultLayout.vue";


import Vuex from 'vuex';

Number.prototype.countDecimals = function () {
  if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
  return this.toString().split(".")[1].length || 0; 
}

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("DefaultLayout", DefaultLayout);

  Vue.use(Flare);


  Vue.use(Vuex);
  Vue.prototype.$store = new Vuex.Store({});

  Vue.use(VKeys);
  
  Vue.use(Keplr, { 
    chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
    chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
    restUrl: process.env.GRIDSOME_SECRET_REST_URL,
    rpcUrl: process.env.GRIDSOME_SECRET_RPC_URL,
    
    onLoad: () => {

      if(process.env.GRIDSOME_SECRET_EXPERIMENTAL_CHAIN) {
        Vue.prototype.$keplr.suggestExperimental({
          chainId: process.env.GRIDSOME_SECRET_CHAIN_ID,
          chainName: process.env.GRIDSOME_SECRET_CHAIN_NAME,
          rest: process.env.GRIDSOME_SECRET_REST_URL,
          rpc: process.env.GRIDSOME_SECRET_RPC_URL,
          
          currencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          stakeCurrency: {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
            // coinGeckoId: ""
          },
          feeCurrencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6,
            },
          ],
          gasPriceStep: {
            low: .1,
            average: .25,
            high: .4,
          },
    
          // walletUrlForStaking: "",
          bip44: {
            coinType: 529,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub',
          },
          coinType: 529,
          features: ['secretwasm'],
        });
      }

    }
  });

  Vue.use(ScrtJs, { 
    restUrl: process.env.GRIDSOME_SECRET_REST_URL, 
    wallet: Vue.prototype.$keplr 
  });

  let availableTokens;

  if(process.env.GRIDSOME_SECRET_CHAIN_ID == "secret-2") {
    availableTokens = [
      {
        codeId: 5,
        symbol: "SSCRT",
        address: "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek",
        name: "ssecret",
        label: "sscrt",
        decimals: 6
      },
      {
        codeId: 10,
        symbol: "SETH",
        address: "secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw",
        name: "Secret Ethereum",
        label: "secret-eth",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SUSDT",
        address: "secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f",
        name: "ecret Tether",
        label: "secret-usdt",
        decimals: 6
      },
      {
        codeId: 10,
        symbol: "SDAI",
        address: "secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq",
        name: "Secret Dai Stablecoin",
        label: "secret-dai",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SCOMP",
        address: "secret1szqzgpl9w42kekla57609y6dq2r39nf0ncx400",
        name: "Secret Compound",
        label: "secret-comp",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SUNI",
        address: "secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te",
        name: "Secret Uniswap",
        label: "secret-uni",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SYFI",
        address: "secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv",
        name: "Secret yearn.finance",
        label: "secret-yfi",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "STUSD",
        address: "secret1ryh523y4e3233hphrkdslegszqz8syjfpthcpp",
        name: "Secret TrueUSD",
        label: "secret-tusd",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SOCEAN",
        address: "secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps",
        name: "Secret Ocean Token",
        label: "secret-ocean",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SLINK",
        address: "secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw",
        name: "Secret ChainLink Token",
        label: "secret-link",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SMKR",
        address: "secret1tqltnm8f53xnprmnlurczf6sr86a4mgztafxzp",
        name: "Secret Maker",
        label: "secret-maker",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SSNX",
        address: "secret15c5ftq4rq7xq3tml4nphv2fvz3u7kg73a583qp",
        name: "Secret Synthetix Network",
        label: "secret-snx",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SAAVE",
        address: "secret1yxwnyk8htvvq25x2z87yj0r5tqpev452fk6h5h",
        name: "Secret Aave Token",
        label: "secret-aave",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SBAND",
        address: "secret1p4zvqgxggrrk435nj94p6la2g4xd0rwssgzpsr",
        name: "Secret BandToken",
        label: "secret-band",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SKNC",
        address: "secret1rs389ss2jch4xjmxv5guru86s8y839nmjsrm5d",
        name: "Secret KyberNetwork",
        label: "secret-knc",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SWBTC",
        address: "secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a",
        name: "Secret Wrapped BTC",
        label: "secret-wbtc",
        decimals: 8
      },
      {
        codeId: 10,
        symbol: "SBAC",
        address: "secret1ezg8weaamcr99848qhkqcf2ap5xz7nwe3cy22x",
        name: "Secret Basis Cash",
        label: "secret-bac",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SSUSHI",
        address: "secret19uje5xy80rm6rfu03df2xea532mcalw9hv8vf9",
        name: "Secret Sushi",
        label: "secret-sushi",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SRSR",
        address: "secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un",
        name: "Secret ReserveRights",
        label: "secret-rsr",
        decimals: 18
      },
      {
        codeId: 10,
        symbol: "SUSDC",
        address: "secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv",
        name: "Secret USDC",
        label: "secret-usdc",
        decimals: 6
      },
      {
        codeId: 10,
        symbol: "SDPI",
        address: "secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu",
        name: "Secret DefiPulseIndex",
        label: "secret-dpi",
        decimals: 18
      }
    ]
  } else {
    availableTokens = [
      {
          codeId: 1,
          symbol: "TSUNI",
          address: "secret16v7a5lhuglkp5szdkfdxwhgkg3g2t2hmmy92h4",
          name: "Test Secret Uniswap",
          label: "tsUNI",
          decimals: 18
      },
      {
          codeId: 1,
          symbol: "TSDAI",
          address: "secret1r4z6fh6gzlqdf4gaqx29mr6340w9vastj4jhvv",
          name: "Test Secret Dai",
          label: "tsDAI",
          decimals: 18
      },
      {
          codeId: 1,
          symbol: "TSUSDT",
          address: "secret196uyuzlw039hztfmv4g0kjp2u376ucsfv0fmss",
          name: "Test Secret Tether",
          label: "tsUSDT",
          decimals: 6
      },
      {
          codeId: 1,
          symbol: "TSWBTC",
          address: "secret1ml8up5nmp8gdv7763h8fzc6sxy3ep7t5zcjrsp",
          name: "Test Secret Wrapped Bitcoin",
          label: "tsWBTC",
          decimals: 8
      },
      {
          codeId: 1,
          symbol: "TSLINK",
          address: "secret15nj999umj4ttdwulewaazzd0v6q8459mh6lejl",
          name: "Test Secret Chainlink",
          label: "tsLINK",
          decimals: 18
      },
      {
          codeId: 1,
          symbol: "TSSNDY",
          address: "secret10urze7sugs0phls3zvd7fh5354e993ta32873p",
          name: "Test Secret Sandy",
          label: "tsSNDY",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSVCTR",
          address: "secret1apmpvsvue9skm7a7vedpplgzdc46uv7h346m00",
          name: "Test Secret Victor",
          label: "tsVCTR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSCAN",
          address: "secret10cwxfegdvusw05n095dec3a26ewk8nuluwvt28",
          name: "Test Secret Can",
          label: "tsCAN",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSTOR",
          address: "secret15vh7r8c379r7vp86m24r6uwequ2az6agnhfh4p",
          name: "Test Secret Tor",
          label: "tsTOR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSJRDN",
          address: "secret1u42dr4kxrgjsj9c37e3lq9a9akhdxzrzg32ez3",
          name: "Test Secret Jordan",
          label: "tsJRDN",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSCRTR",
          address: "secret1m8px7yknnyaxvhmk0ekyxtkekj6gud0dalk2g2",
          name: "Test Secret Carter",
          label: "tsCRTR",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSBRDN",
          address: "secret1jp9e3jnnesacndgwhhwm3glq3p6y56v6vxdzd7",
          name: "Test Secret Brendan",
          label: "tsBRDN",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSBDRK",
          address: "secret1ea0s86n93trx5d7jecl49je4km0n3kx7vfs3hw",
          name: "Test Secret Baedrik",
          label: "tsBDRK",
          decimals: 2
      },
      {
          codeId: 1,
          symbol: "TSLORA",
          address: "secret1vyydr9lznuxugmy0qtqgu3uh8x3x8nlysphl2p",
          name: "Test Secret Laura",
          label: "tsLORA",
          decimals: 2
      }
    ]
  }

  Vue.use(AuctionsApi, { 
    chainClient: Vue.prototype.$scrtjs,
    factoryAddress: process.env.GRIDSOME_AUCTIONS_FACTORY,
    availableTokens
  });
  

}
