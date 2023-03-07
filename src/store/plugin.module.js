const state = {
  activePlugin: {
  },
  parsedQuests: [],
  activeHeader: {},
  activePluginTitle: '',
  journalHighlight: {},
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
  },
  getActiveHeader(state) {
    return state.activeHeader;
  },
  getJournalHighlight(state) {
    return state.journalHighlight;
  },
  getActivePluginTitle(state) {
    return state.activePluginTitle;
  },
  getDialogueSpeaker: (state) => (speakerTypes) => {
    let dialogues = [];
    for (let speakerType of speakerTypes) {
      const dialogueTypes = ["Topic", "Greeting", "Persuasion"];
      for (let dialogueType of dialogueTypes) {
        if (state.activePlugin[dialogueType]) {
        dialogues = [
          ...dialogues,
          ...state.activePlugin[dialogueType]
            .map((topic) => topic[speakerType])
            .filter((speaker) => speaker)
        ];
        dialogues = [...new Set(dialogues)];
      }
      }
    }
    return dialogues;
  },
  getDialogueBySpeaker:
    (state) =>
    ([id, dialogueType]) => {
      if (state.activePlugin[dialogueType]) {
      return state.activePlugin[dialogueType].filter(
        (topic) =>
          topic["speaker_id"] === id ||
          topic["speaker_cell"] === id ||
          topic["speaker_faction"] === id ||
          topic["speaker_class"] === id
      )
      } else return []
    }
};

const actions = {
  parseLocalPlugin({ commit, dispatch }, [plugin]) {
    commit("resetActivePlugin");
    let dialogueType;
    let dialogueId;
    for (let entry of plugin) {
      console.log("ENTRY TYPE: ", entry.type);
      if (entry.type === "Header") {
        commit("setActiveHeader", [entry]);
      } else if (["Info", "Dialogue"].includes(entry.type)) {
        if (entry.type === "Dialogue") {
          if (entry.id) dialogueId = entry.id;
          dialogueType = entry.dialogue_type;
          let dialogueEntry = { ...entry, TMP_topic: dialogueId };
          commit("addToActiveArray", [dialogueType, dialogueEntry]);
        } else {
          if (entry.id) dialogueId = entry.id;
          let dialogueEntry = { ...entry, TMP_topic: dialogueId };
          commit("addToActiveArray", [dialogueType, dialogueEntry]);
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
    state.activeHeader = header;
  },
  setActivePluginTitle(state, title) {
    state.activePluginTitle = title
  },
  setJournalHighlight(state, filter) {
    state.journalHighlight = filter
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
      Activator: [],
      Light: [],
      GlobalVariable: []
    };
    state.activePlugin = clearedPlugin;
  },
  addToActiveArray(state, [destination, entry]) {
    console.log(destination)
    if (state.activePlugin[destination]) {
      state.activePlugin[destination] = [
        ...state.activePlugin[destination],
        entry
      ];
    } else {
      state.activePlugin[destination] = [entry]
    }
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
