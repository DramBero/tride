const state = {
  activePlugin: [],
  parsedQuests: [],
  activeHeader: {},
  activePluginTitle: '',
  journalHighlight: {},
};

const getters = {
  getParsedQuests(state) {
    if (!state.activePlugin.length) return []
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
    let plugin = JSON.parse(JSON.stringify(state.activePlugin))
    for (let entry in plugin) {
      let noDevEntry = plugin[entry]
      let devStrings = ['TMP_type', 'TMP_topic']
      for (let devKey of devStrings) {
        if (noDevEntry[devKey]) delete noDevEntry[devKey]
      }
      plugin[entry] = noDevEntry
    }
    plugin.filter(val => val.type === 'Header')[0].num_objects = (plugin.length - 1)
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
  addJournalQuest(state, [id, name]) {
    let generatedId = Math.random().toString().slice(2, 15) + Math.random().toString().slice(2, 9)
    let idEntry = {
      type: "Dialogue",
      flags: [
        0,
        0
      ],
      id: id,
      dialogue_type: "Journal",
      TMP_topic: id,
      TMP_type: "Journal"
    }
    let nameEntry = {
      type: "Info",
      flags: [
        0,
        0
      ],
      info_id: generatedId,
      prev_id: "",
      next_id: "",
      data: {
        dialogue_type: "Journal",
        disposition: 0,
        speaker_rank: -1,
        speaker_sex: "Any",
        player_rank: -1
      },
      text: name,
      quest_name: 1,
      filters: [],
      TMP_topic: id,
      TMP_type: "Journal"
    }
    state.activePlugin = [...state.activePlugin, idEntry]
    state.activePlugin = [...state.activePlugin, nameEntry]
  },
  addJournalEntry(state, [questId, entryText, entryDisposition]) {
    let generatedId = Math.random().toString().slice(2, 15) + Math.random().toString().slice(2, 9)
    let questEntries = state.activePlugin.filter(val => val.TMP_type === 'Journal').filter(val => val.TMP_topic === questId).filter(val => val.next_id === "")
    let lastId = ""
    let lastIdIndex = null
    if (questEntries.length && questEntries[0].info_id) {
      lastId = questEntries[0].info_id
      lastIdIndex = state.activePlugin.findIndex(item => item.info_id === lastId)
      state.activePlugin.filter(val => val.info_id === lastId)[0].next_id = generatedId
    }
    console.log(lastIdIndex)
    let newEntry = {
      TMP_topic: questId,
      TMP_type: "Journal",
      type: "Info",
      flags: [
        0,
        0
      ],
      info_id: generatedId,
      prev_id: lastId,
      next_id: "",
      data: {
        dialogue_type: "Journal",
        disposition: entryDisposition,
        speaker_rank: -1,
        speaker_sex: "Any",
        player_rank: -1
      },
      text: entryText,
      filters: []
    }
    if (lastIdIndex) state.activePlugin.splice(lastIdIndex + 1, 0, newEntry)
    else state.activePlugin = [...state.activePlugin, newEntry]
  },

  deleteJournalEntry(state, info_id) {
    let questEntries = state.activePlugin.filter(val => val.info_id === info_id)
    if (!questEntries.length) return
    else {
      let next_id = questEntries[0].next_id
      let prev_id = questEntries[0].prev_id
      state.activePlugin = state.activePlugin.filter(val => val.info_id !== info_id)
      let nextEntry = state.activePlugin.filter(val => val.info_id === next_id)
      if (nextEntry.length) {
        state.activePlugin.filter(val => val.info_id === next_id)[0].prev_id = prev_id
      }
      let prevEntry = state.activePlugin.filter(val => val.info_id === prev_id)
      if (prevEntry.length) {
        state.activePlugin.filter(val => val.info_id === prev_id)[0].next_id = next_id
      }
    }
  },

  editJournalEntry(state, [entryId, entryText, entryDisp, entryFinished]) {
    let questEntries = state.activePlugin.filter(val => val.info_id === entryId)
    if (!questEntries.length) return
    else {
      state.activePlugin.filter(val => val.info_id === entryId)[0].text = entryText
      state.activePlugin.filter(val => val.info_id === entryId)[0].data.disposition = entryDisp
      state.activePlugin.filter(val => val.info_id === entryId)[0].quest_finish = entryFinished ? 1 : 0
      if (!entryFinished && state.activePlugin.filter(val => val.info_id === entryId)[0].quest_finish) {
        delete state.activePlugin.filter(val => val.info_id === entryId)[0][quest_finish]
      }
    }
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
