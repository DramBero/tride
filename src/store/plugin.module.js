const state = {
  activePlugin: [],
  parsedQuests: [],
  activeHeader: {},
  activePluginTitle: '',
  journalHighlight: {},
};

const getters = {
  getParsedQuests(state) {
    let quests = []
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
    for (let entry of state.activePlugin) {
      if (entry.type === "Dialogue" && entry.TMP_type === 'Journal') {
        if (entry.id !== questData.id && questData.id !== "") {
          quests.push(questData);
          questData = JSON.parse(JSON.stringify(initialQuestData));
        }
        questData.id = entry.id;
      } else if (entry.TMP_type === 'Journal') {
        if (entry.quest_name === 1) {
          questData.name = entry.text;
          questData.nameId = entry.info_id;
          questData.nameNextId = entry.next_id;
        } else {
          questData.entries.push(entry);
        }
      }
    }
    quests.push(questData)
    return quests;
  },
  getActivePlugin(state) {
    if (!state.activePlugin.length) return
    let plugin = state.activePlugin
    for (let entry in plugin) {
      let noDevEntry = plugin[entry]
      let devStrings = ['TMP_type', 'TMP_topic']
      for (let devKey of devStrings) {
        if (noDevEntry[devKey]) delete noDevEntry[devKey]
      }
      plugin[entry] = noDevEntry
    }
    return plugin
  },
  getActiveHeader(state) {
    return state.activePlugin.filter(val => val.type === 'Header')[0];
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
        if (state.activePlugin.filter(val => val.TMP_type === dialogueType).length) {
        dialogues = [
          ...dialogues,
          ...state.activePlugin.filter(val => val.TMP_type === dialogueType)
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
      if (state.activePlugin.filter(val => val.TMP_type === dialogueType)) {
      return state.activePlugin.filter(val => val.TMP_type === dialogueType).filter(
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
  parseLocalPlugin({ state, commit, dispatch }, [plugin]) {
    commit("resetActivePlugin");
    let dialogueType;
    let dialogueId;
    for (let entry of plugin) {
      if (entry.type === "Header") {
        commit("addEntryToActive", entry)
        //commit("setActiveHeader", [entry]);
      } else if (["Info", "Dialogue"].includes(entry.type)) {
        if (entry.type === "Dialogue") {
          if (entry.id) dialogueId = entry.id;
          dialogueType = entry.dialogue_type;
          let dialogueEntry = { ...entry, TMP_topic: dialogueId, TMP_type: dialogueType };
          commit("addEntryToActive", dialogueEntry)
          //commit("addToActiveArray", [dialogueType, dialogueEntry]);
        } else {
          if (entry.id) dialogueId = entry.id;
          let dialogueEntry = { ...entry, TMP_topic: dialogueId, TMP_type: dialogueType };
          commit("addEntryToActive", dialogueEntry)
          //commit("addToActiveArray", [dialogueType, dialogueEntry]);
        }
      } else {
        commit("addEntryToActive", entry)
        //commit("addToActiveArray", [entry.type, entry]);
      }
    }
  },
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
    state.activePlugin = [];
  },
  addEntryToActive(state, entry) {
    state.activePlugin = [...state.activePlugin, entry]
  },
  addToActiveArray(state, [destination, entry]) {
    if (state.activePlugin[destination]) {
      state.activePlugin[destination] = [
        ...state.activePlugin[destination],
        entry
      ];
    } else {
      state.activePlugin[destination] = [entry]
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
