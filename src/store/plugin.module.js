const state = {
  activePlugin: {
    Header: {},
    Script: [],
    Creature: [],
    Npc: [],
    Clothing: [],
    Cell: [],
    Journal: [],
    Topic: [],
    Greeting: [],
    Persuasion: [],
    Weapon: [],
    Armor: [],
    Enchantment: [],
    Book: [],
    Other: [],
    GlobalVariable: []
  },
  parsedQuests: [],
  test: 7
};

const getters = {
  getTest(state) {
    return state.test;
  },
  getParsedQuests(state) {
    return state.parsedQuests;
  },
  getBooks(state) {
    return state.activePlugin.Book;
  }
};

const actions = {
  parseLocalPlugin({ commit, dispatch }, [plugin]) {
    commit("resetActivePlugin");
    let dialogueType;
    for (let entry of plugin) {
      console.log(entry.type);
      // let dialogueId
      if (entry.type === "Header") {
        commit("setActiveHeader", [entry]);
      } else if (["Info", "Dialogue"].includes(entry.type)) {
        if (entry.type === "Dialogue") {
          // dialogueId = entry.id
          dialogueType = entry.dialogue_type;
          commit("addToActiveArray", [dialogueType, entry]);
        } else {
          commit("addToActiveArray", [dialogueType, entry]);
        }
      } else {
        commit("addToActiveArray", [entry.type, entry]);
      }
    }
    dispatch("parseQuests");
  },

  parseQuests({ state, commit }) {
    let quests = [];
    let initialQuestData = {
      id: "",
      name: "",
      nameId: "",
      nameNextId: "",
      entries: []
    };
    let questData = {
      id: "",
      name: "",
      nameId: "",
      nameNextId: "",
      entries: []
    };
    for (let entry of state.activePlugin.Journal) {
      if (entry.type === "Dialogue") {
        if (entry.id !== questData.id && questData.id !== "") {
          quests.push(questData);
          questData = JSON.parse(JSON.stringify(initialQuestData));
        }
        questData.id = entry.id;
      } else {
        if (entry.quest_name === 1) {
          questData.name = entry.text;
          questData.nameId = entry.info_id;
          questData.nameNextId = entry.next_id;
        } else {
          questData.entries.push(entry);
        }
      }
    }
    quests.push(questData);
    commit("setParsedQuests", [...quests]);
  }
};

const mutations = {
  setActiveHeader(state, header) {
    state.test = header;
  },
  resetActivePlugin(state) {
    let clearedPlugin = {
      Header: {},
      Script: [],
      Creature: [],
      Npc: [],
      Clothing: [],
      Cell: [],
      Journal: [],
      Topic: [],
      Greeting: [],
      Persuasion: [],
      Weapon: [],
      Armor: [],
      Enchantment: [],
      Book: [],
      Spell: [],
      Door: [],
      Container: [],
      Other: [],
      GlobalVariable: []
    };
    state.activePlugin = clearedPlugin;
  },
  addToActiveArray(state, [destination, entry]) {
    state.activePlugin[destination] = [
      ...state.activePlugin[destination],
      entry
    ];
  },
  setParsedQuests(state, quests) {
    state.parsedQuests = quests;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
