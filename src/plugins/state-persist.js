const storageKey = "sod";

const statePersist = {
  hasStarted: false,
  loadFromStorage: (storageKey) => {
    if (process.isClient) {
      return JSON.parse(localStorage.getItem(storageKey));
    }
  },
  saveToStorage: (storageKey, obj) => {
    if (process.isClient) {
      localStorage.setItem(storageKey, JSON.stringify(obj));
    }
  },

  plugin: (store) => {
    store.subscribe((mutation, state) => {
      if(statePersist.hasStarted) {
        statePersist.saveToStorage(storageKey, state);
      }
    });
  },

  start: (store) => {
    const storedState = statePersist.loadFromStorage(storageKey);
    if (storedState) {
      // This doesn't work... 
      //     Uncaught Error: [vuex] use store.replaceState() to explicit replace store state.
      // Vue.set(store, "state", storedState);

      // This doesn't work either...
      //store.replaceStore(storedState);

      store.state.$auctions = storedState.$auctions;
      store.state.$vkeys.vkeys = storedState.$vkeys.vkeys;
    }
    statePersist.hasStarted = true;
  },
};

export default statePersist;
