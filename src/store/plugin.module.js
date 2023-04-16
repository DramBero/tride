import Vue from "vue";

const state = {
  activePlugin: [],
  parsedQuests: [],
  activeHeader: {},
  activePluginTitle: "",
  journalHighlight: {},
  dependencies: [],
  cellList: [],
  raceList: [],
  classList: [],
  factionList: []
};

const getters = {
  getParsedQuests(state) {
    if (!state.activePlugin.length) return [];
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
    for (let entry of state.activePlugin) {
      if (entry.type === "Dialogue" && entry.TMP_type === "Journal") {
        if (entry.id !== questData.id && questData.id !== "") {
          quests.push(questData);
          questData = JSON.parse(JSON.stringify(initialQuestData));
        }
        questData.id = entry.id;
      } else if (entry.TMP_type === "Journal") {
        if (entry.quest_name === 1) {
          questData.name = entry.text;
          questData.nameId = entry.info_id;
          questData.nameNextId = entry.next_id;
        } else {
          questData.entries.push(entry);
        }
      }
    }
    if (questData.id) quests.push(questData);
    return quests;
  },

  getActivePlugin(state) {
    if (!state.activePlugin.length) return;
    state.activePlugin.filter((val) => val.type === "Header")[0].num_objects =
      state.activePlugin.length - 1;

    return state.activePlugin;
  },

  getActiveHeader(state) {
    return state.activePlugin.filter((val) => val.type === "Header")[0];
  },

  getCellList(state) {
    return state.cellList;
  },

  getRaceList(state) {
    return state.raceList;
  },

  getClassList(state) {
    return state.classList;
  },

  getFactionList(state) {
    return state.factionList;
  },

  getJournalHighlight(state) {
    return state.journalHighlight;
  },

  getActivePluginTitle(state) {
    return state.activePluginTitle;
  },

  getAllNpcs(state) {
    let depNpcs = [];
    for (let dep of state.dependencies) {
      depNpcs.push(...dep.data.filter((val) => val.type === "Npc"));
    }
    let allNpcs = [
      ...state.activePlugin.filter((val) => val.type === "Npc"),
      ...depNpcs
    ];
    const uniqueObjMap = {};
    for (const object of allNpcs) {
      uniqueObjMap[object.id] = object;
    }

    const uniqueObjects = Object.values(uniqueObjMap);
    return uniqueObjects;
  },

  getAllCreatures(state) {
    let depCreatures = [];
    for (let dep of state.dependencies) {
      depCreatures.push(...dep.data.filter((val) => val.type === "Creature"));
    }
    let allCreatures = [
      ...state.activePlugin.filter((val) => val.type === "Creature"),
      ...depCreatures
    ];
    const uniqueObjMap = {};
    for (const object of allCreatures) {
      uniqueObjMap[object.id] = object;
    }

    const uniqueObjects = Object.values(uniqueObjMap);
    return uniqueObjects;
  },

  getAllTopics: (state) => (topicType) => {
    let depTopics = [];
    for (let dep of state.dependencies) {
      depTopics.push(
        ...dep.data.filter(
          (val) => val.TMP_type === topicType && val.type === "Dialogue"
        )
      );
    }
    let allTopics = [
      ...state.activePlugin.filter(
        (val) => val.TMP_type === topicType && val.type === "Dialogue"
      ),
      ...depTopics
    ];
    const uniqueObjMap = {};
    for (const object of allTopics) {
      uniqueObjMap[object.id] = uniqueObjMap[object.id]
        ? [...uniqueObjMap[object.id], object]
        : [object];
    }

    const uniqueObjects = Object.values(uniqueObjMap);

    return uniqueObjects;
  },

  getFiltersByInfoId: (state) => (info_id) => {
    if (state.activePlugin.find((val) => val.info_id == info_id))
      return state.activePlugin.find((val) => val.info_id == info_id).filters;
    else if (
      state.dependencies
        .flatMap((val) => val.data)
        .find((val) => val.info_id == info_id)
    )
      return state.dependencies
        .flatMap((val) => val.data)
        .find((val) => val.info_id == info_id).filters;
  },

  getOrderedEntriesByTopic:
    (state) =>
    ([topicId]) => {
      if (!topicId) return [];
      let pluginDialogue = [
        ...state.dependencies.map((val) => val.data),
        state.activePlugin
      ].map((val) =>
        val.filter((val) => val.type === "Info" && val.TMP_topic === topicId)
      );

      if (!pluginDialogue.flat(1).length) return [];

      const findByIdType = function (idType, id) {
        let entries = pluginDialogue.flatMap((plugin) =>
          plugin.filter((entry) => entry[idType] === id)
        );
        if (!entries.length) return false;
        let lastValue = entries.at(-1);
        let oldValues = pluginDialogue.flatMap((plugin) =>
          plugin.filter((entry) => entry.info_id === lastValue.info_id)
        );
        return {
          ...lastValue,
          old_values:
            oldValues.length > 1
              ? oldValues.filter((val) => val && val.TMP_dep)
              : []
        };
      };

      let firstElement = findByIdType("prev_id", "");

      const errorNoPrevId = {
        error_code: "NO_PREV_ID",
        error_text:
          "Ordering error! No elements with defined 'prev_id'. Make sure you uploaded all dependencies.",
        error_details: {}
      };

      if (!firstElement) return errorNoPrevId;

      let orderedDialogue = [firstElement];
      let nextEntry;
      while (true) {
        let nextEntries = [
          ...new Set([
            findByIdType("prev_id", orderedDialogue.at(-1).info_id),
            findByIdType("info_id", orderedDialogue.at(-1).next_id)
          ])
        ];
        for (let dependency of state.dependencies) {
          nextEntry =
            nextEntries.find((val) => val.TMP_dep === dependency.name) ||
            nextEntry;
        }
        nextEntry = nextEntries.find((val) => !val.TMP_dep) || nextEntry;
        if (nextEntry) {
          orderedDialogue.push(nextEntry);
          if (!nextEntry.next_id) break;
        } else break;
      }

      return orderedDialogue;
    },

  getBestOrderLocationForNpc:
    (state, getters) =>
    ([npcId, topicId, dialogueType, speakerType]) => {
      let orderedTopics = getters.getOrderedEntriesByTopic([
        topicId,
        dialogueType
      ]);
      if (!orderedTopics.length) return ["", ""];
      else if (
        orderedTopics.filter((val) => val[speakerType] === npcId).length
      ) {
        return [
          orderedTopics.filter((val) => val[speakerType] === npcId).slice(-1)[0]
            .info_id,
          orderedTopics.filter((val) => val[speakerType] === npcId).slice(-1)[0]
            .next_id
        ];
      } else {
        let selectedTopic;
        let testString = [];

        if (speakerType === "speaker_id") {
          testString.push("SPEAKER ID");
          selectedTopic = orderedTopics.filter((val) => val[speakerType] != "");
          if (selectedTopic.length > 1) {
            selectedTopic = selectedTopic.slice(
              0,
              Math.ceil(selectedTopic.length / 2)
            );
            selectedTopic =
              selectedTopic[Math.floor(Math.random() * Array.length)];
          } else if (selectedTopic.length > 0) {
            selectedTopic = selectedTopic[0];
          } else {
            selectedTopic =
              orderedTopics.length > 1 ? orderedTopics[1] : orderedTopics[0];
          }
        } else {
          testString.push("NOT SPEAKER ID");
          var filteredPriorityEntries;
          switch (speakerType) {
            case "speaker_cell":
              filteredPriorityEntries = orderedTopics.filter(
                (val) => !val.speaker_id
              );
              break;
            case "speaker_faction":
              filteredPriorityEntries = orderedTopics.filter(
                (val) => !val.speaker_id && !val.speaker_cell
              );
              break;
            case "speaker_class":
              filteredPriorityEntries = orderedTopics.filter(
                (val) =>
                  !val.speaker_id && !val.speaker_cell && !val.speaker_faction
              );
              break;
            case "speaker_race":
              filteredPriorityEntries = orderedTopics.filter(
                (val) =>
                  !val.speaker_id &&
                  !val.speaker_cell &&
                  !val.speaker_faction &&
                  !val.speaker_class
              );
              break;
            default:
              filteredPriorityEntries = orderedTopics.filter(
                (val) =>
                  !val.speaker_id &&
                  !val.speaker_cell &&
                  !val.speaker_faction &&
                  !val.speaker_class &&
                  !val.speaker_rank
              );
              break;
          }
          testString.push("LENGTH: " + filteredPriorityEntries.length);
          selectedTopic = filteredPriorityEntries.filter(
            (val) => val[speakerType] != ""
          );
          if (selectedTopic.length > 1) {
            testString.push("IF 1");
            selectedTopic = selectedTopic.slice(
              0,
              Math.ceil(selectedTopic.length / 2)
            );
            selectedTopic =
              selectedTopic[Math.floor(Math.random() * Array.length)];
          } else if (selectedTopic.length > 0) {
            testString.push("ELSE IF 1");
            selectedTopic = selectedTopic[0];
          } else if (filteredPriorityEntries.length > 0) {
            testString.push("ELSE IF 2");
            selectedTopic = filteredPriorityEntries[0];
          } else {
            testString.push("ELSE");
            selectedTopic =
              orderedTopics.length > 1
                ? orderedTopics.at(-2)
                : orderedTopics[0];
          }
        }
        testString.push(selectedTopic)
        let nextId
        if (state.activePlugin.find(val => val.prev_id === selectedTopic.info_id)) {
          nextId = state.activePlugin.find(val => val.prev_id === selectedTopic.info_id).info_id
        } else {
          for (let dep of state.dependencies) {
            nextId = selectedTopic.next_id
            if (dep.data.find(val => val.prev_id === selectedTopic.info_id)) nextId = dep.data.find(val => val.prev_id === selectedTopic.info_id).info_id
          }
        }

        return [selectedTopic.info_id, nextId, testString];
      }
    },

  getNpcById: (state, getters) => (npcId) => {
    let npcNames = getters.getAllNpcs.filter((val) => val.id === npcId);
    return npcNames.length ? npcNames[0] : {};
  },

  searchNpcs: (state, getters) => (searchString) => {
    return [...getters.getAllNpcs, ...getters.getAllCreatures].filter(
      (val) =>
        val.id
          .toUpperCase()
          .trim()
          .includes(searchString.toUpperCase().trim()) ||
        val.name
          .toUpperCase()
          .trim()
          .includes(searchString.toUpperCase().trim())
    );
  },

  searchTopics: (state, getters) => (searchString) => {
    return getters
      .getAllTopics("Topic")
      .filter((val) =>
        val[0].id.toUpperCase().includes(searchString.toUpperCase())
      );
  },

  getDialogueSpeaker: (state) => (speakerTypes) => {
    let dialogues = [];
    for (let speakerType of speakerTypes) {
      const dialogueTypes = ["Topic", "Greeting", "Persuasion"];
      for (let dialogueType of dialogueTypes) {
        if (
          state.activePlugin.filter((val) => val.TMP_type === dialogueType)
            .length
        ) {
          dialogues = [
            ...dialogues,
            ...state.activePlugin
              .filter((val) => val.TMP_type === dialogueType)
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
      let depDialogue = [];
      if (id === "Global Dialogue") {
        for (let dep of state.dependencies) {
          depDialogue = [
            ...depDialogue,
            ...dep.data
              .filter(
                (val) => val.TMP_type === dialogueType && val.type === "Info"
              )
              .filter(
                (topic) =>
                  !topic["speaker_id"] &&
                  !topic["speaker_cell"] &&
                  !topic["speaker_faction"] &&
                  !topic["speaker_class"] &&
                  !topic["speaker_rank"]
              )
          ];
        }
        let activeDialogue = state.activePlugin
          .filter((val) => val.TMP_type === dialogueType && val.type === "Info")
          .filter(
            (topic) =>
              !topic["speaker_id"] &&
              !topic["speaker_cell"] &&
              !topic["speaker_faction"] &&
              !topic["speaker_class"] &&
              !topic["speaker_rank"]
          );
        return [...depDialogue, ...activeDialogue];
      }
      for (let dep of state.dependencies) {
        depDialogue = [
          ...depDialogue,
          ...dep.data
            .filter(
              (val) => val.TMP_type === dialogueType && val.type === "Info"
            )
            .filter((topic) =>
              [
                topic["speaker_id"],
                topic["speaker_cell"],
                topic["speaker_faction"],
                topic["speaker_class"],
                topic["speaker_rank"]
              ].includes(id)
            )
        ];
      }
      let activeDialogue = state.activePlugin
        .filter((val) => val.TMP_type === dialogueType && val.type === "Info")
        .filter((topic) =>
          [
            topic["speaker_id"],
            topic["speaker_cell"],
            topic["speaker_faction"],
            topic["speaker_class"],
            topic["speaker_rank"]
          ].includes(id)
        );
      return [...depDialogue, ...activeDialogue];
    }
};

const actions = {
  parseLocalPlugin({ commit }, [plugin]) {
    commit("resetActivePlugin");
    commit("parsePluginData", plugin);
  },

  parseDependency({ commit }, [plugin, fileName]) {
    commit("setDependencies", [plugin, fileName]);
  },

  replaceDialogueEntry({ state, commit }, [info_id, newEntry]) {
    let oldEntryActivePlugin = state.activePlugin.find(
      (val) => val.info_id === info_id
    );
    if (oldEntryActivePlugin) Object.assign(oldEntry, newEntry);
    else {
      let depEntries = state.dependencies
        .map((val) => val.data)
        .flat(1)
        .filter((val) => val.info_id === info_id);
      console.log("DPENTRIES ", depEntries);
      if (newEntry.TMP_dep) delete newEntry.TMP_dep;
      if (depEntries.length) {
        commit("pasteDialogue", [
          newEntry,
          newEntry.TMP_topic,
          newEntry.TMP_type,
          newEntry.prev_id,
          newEntry.next_id,
          newEntry.info_id
        ]);
      }
    }
  }
};

const mutations = {
  setActiveHeader(state, header) {
    let oldHeader = state.activePlugin.find((val) => val.type === "Header");
    oldHeader.author = header.author;
    oldHeader.description = header.description;
    oldHeader.version = header.version;
    oldHeader.masters = header.masters;
    oldHeader.file_type = header.file_type;
  },

  addFilter(state, [filter, info_id]) {
    let slotCount = state.activePlugin.find((val) => val.info_id == info_id)
      .filters.length;
    filter = { ...filter, slot: "Slot" + slotCount.toString() };
    state.activePlugin
      .find((val) => val.info_id == info_id)
      .filters.push(filter);
  },

  addDialogue(
    state,
    [speakerType, speakerId, topicId, dialogueType, location_id, location_direction, text]
  ) {
    let prev_id = ''
    let next_id = ''
    console.log(speakerType, speakerId, topicId, dialogueType, location_id, location_direction, text)
    if (location_direction === 'next') {
      prev_id = location_id
      if (state.activePlugin.find(val => val.prev_id === location_id)) next_id = state.activePlugin.find(val => val.prev_id === location_id).info_id
      else {
        for (let dep of state.dependencies) {
          if (dep.data.find(val => val.prev_id === location_id)) next_id = dep.data.find(val => val.prev_id === location_id).info_id
        }
      }
    }
    else if (location_direction === 'prev') {
      next_id = location_id
      if (state.activePlugin.find(val => val.next_id === location_id)) prev_id = state.activePlugin.find(val => val.next_id === location_id).info_id
      else {
        for (let dep of state.dependencies) {
          if (dep.data.find(val => val.next_id === location_id)) prev_id = dep.data.find(val => val.next_id === location_id).info_id
        }
      }
    }

    let generatedId =
      Math.random().toString().slice(2, 15) +
      Math.random().toString().slice(2, 9);

    let topicObject = {
      dialogue_type: "Topic",
      flags: [0, 0],
      id: topicId,
      type: "Dialogue",
      TMP_topic: topicId,
      TMP_type: dialogueType
    };

    let questEntries = state.activePlugin.filter(
      (val) => val.TMP_type === dialogueType && val.TMP_topic === topicId
    );

    if (!questEntries.length)
      state.activePlugin = [...state.activePlugin, topicObject];

    let lastIdIndex = null;
    if (questEntries.length && questEntries.at(-1).info_id) {
      lastIdIndex = state.activePlugin.findIndex(
        (item) => item.info_id === questEntries.at(-1).info_id
      );
    }

    let newEntry = {
      data: {
        dialogue_type: "Topic",
        disposition: 0,
        player_rank: -1,
        speaker_rank: -1,
        speaker_sex: "Any"
      },
      filters: [],
      flags: [0, 0],
      info_id: generatedId,
      next_id: next_id,
      prev_id: prev_id,
      text: text,
      type: "Info",
      TMP_topic: topicId,
      TMP_type: dialogueType
    };
    if (speakerType) newEntry[speakerType] = speakerId;

    state.activePlugin.find((val) => val.info_id === prev_id) &&
      (state.activePlugin.find((val) => val.info_id === prev_id).next_id =
        generatedId);
    state.activePlugin.find((val) => val.info_id === next_id) &&
      (state.activePlugin.find((val) => val.info_id === next_id).prev_id =
        generatedId);

    if (lastIdIndex) state.activePlugin.splice(lastIdIndex, 0, newEntry);
    else state.activePlugin = [...state.activePlugin, newEntry];
  },

  pasteDialogue(
    state,
    [entry, npcId, topicId, dialogueType, location_id, location_direction, info_id]
  ) {
    let generatedId = info_id
      ? info_id
      : Math.random().toString().slice(2, 15) +
        Math.random().toString().slice(2, 9);

    let prev_id = ''
    let next_id = ''
    if (location_direction === 'next') {
      prev_id = location_id
      if (state.activePlugin.find(val => val.prev_id === location_id)) next_id = state.activePlugin.find(val => val.prev_id === location_id).info_id
      else {
        for (let dep of state.dependencies) {
          if (dep.data.find(val => val.prev_id === selectedTopic.info_id)) next_id = dep.data.find(val => val.prev_id === selectedTopic.info_id).info_id
        }
      }
    }
    else if (location_direction === 'prev') {
      next_id = location_id
      if (state.activePlugin.find(val => val.next_id === location_id)) prev_id = state.activePlugin.find(val => val.next_id === location_id).info_id
      else {
        for (let dep of state.dependencies) {
          if (dep.data.find(val => val.next_id === location_id)) prev_id = dep.data.find(val => val.next_id === location_id).info_id
        }
      }
    }

    let questEntries = state.activePlugin.filter(
      (val) => val.TMP_type === dialogueType && val.TMP_topic === topicId
    );

    let topicObject = {
      dialogue_type: "Topic",
      flags: [0, 0],
      id: topicId,
      type: "Dialogue",
      TMP_topic: topicId,
      TMP_type: dialogueType
    };

    if (!questEntries.length)
      state.activePlugin = [...state.activePlugin, topicObject];

    let lastIdIndex = null;
    if (questEntries.length && questEntries[0].info_id) {
      lastIdIndex = state.activePlugin.findIndex(
        (item) => item.info_id === questEntries.at(-1).info_id
      );
    }

    let newEntry = {
      ...entry,
      info_id: generatedId,
      next_id: next_id,
      prev_id: prev_id,
      TMP_topic: topicId,
      TMP_type: dialogueType
    };

    console.log(newEntry);

    state.activePlugin.find((val) => val.info_id === prev_id) &&
      (state.activePlugin.find((val) => val.info_id === prev_id).next_id =
        generatedId);
    state.activePlugin.find((val) => val.info_id === next_id) &&
      (state.activePlugin.find((val) => val.info_id === next_id).prev_id =
        generatedId);

    if (lastIdIndex) state.activePlugin.splice(lastIdIndex, 0, newEntry);
    else state.activePlugin = [...state.activePlugin, newEntry];
  },

  moveDialogueEntry(
    state,
    [info_id, old_prev_id, old_next_id, new_prev_id, new_next_id]
  ) {
    console.log([info_id, old_prev_id, old_next_id, new_prev_id, new_next_id]);
    if (state.activePlugin.find((val) => val.info_id == info_id)) {
      state.activePlugin.find((val) => val.info_id == info_id).prev_id =
        new_prev_id;
      state.activePlugin.find((val) => val.info_id == info_id).next_id =
        new_next_id;
    } else console.log("none INFO ID");

    if (state.activePlugin.find((val) => val.info_id == old_prev_id)) {
      state.activePlugin.find((val) => val.info_id == old_prev_id).next_id =
        old_next_id;
    } else console.log("none OLD PREV");
    if (state.activePlugin.find((val) => val.info_id == old_next_id)) {
      state.activePlugin.find((val) => val.info_id == old_next_id).prev_id =
        old_prev_id;
    } else console.log("none OLD NEXT");

    if (state.activePlugin.find((val) => val.info_id == new_prev_id)) {
      state.activePlugin.find((val) => val.info_id == new_prev_id).next_id =
        info_id;
    } else console.log("none NEW PREV");
    if (state.activePlugin.find((val) => val.info_id == new_next_id)) {
      state.activePlugin.find((val) => val.info_id == new_next_id).prev_id =
        info_id;
    } else console.log("none NEW NEXT");
  },

  deleteDialogueEntry(state, info_id) {
    let prev_id = state.activePlugin.find(
      (val) => val.type === "Info" && val.info_id === info_id
    ).prev_id;
    let next_id = state.activePlugin.find(
      (val) => val.type === "Info" && val.info_id === info_id
    ).next_id;
    if (state.activePlugin.find((val) => val.info_id === prev_id))
      state.activePlugin.find((val) => val.info_id === prev_id).next_id =
        next_id;
    if (state.activePlugin.find((val) => val.info_id === next_id))
      state.activePlugin.find((val) => val.info_id === next_id).prev_id =
        prev_id;
    state.activePlugin = state.activePlugin.filter(
      (val) => val.info_id !== info_id
    );
  },

  editDialogueEntry(state, [info_id, text]) {
    state.activePlugin.find(
      (val) => val.type === "Info" && val.info_id === info_id
    ).text = text;
  },

  addJournalQuest(state, [id, name]) {
    let generatedId =
      Math.random().toString().slice(2, 15) +
      Math.random().toString().slice(2, 9);
    let idEntry = {
      type: "Dialogue",
      flags: [0, 0],
      id: id,
      dialogue_type: "Journal",
      TMP_topic: id,
      TMP_type: "Journal"
    };
    let nameEntry = {
      type: "Info",
      flags: [0, 0],
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
    };
    state.activePlugin = [...state.activePlugin, idEntry];
    state.activePlugin = [...state.activePlugin, nameEntry];
  },

  addJournalEntry(state, [questId, entryText, entryDisposition]) {
    let generatedId =
      Math.random().toString().slice(2, 15) +
      Math.random().toString().slice(2, 9);
    let questEntries = state.activePlugin
      .filter((val) => val.TMP_type === "Journal")
      .filter((val) => val.TMP_topic === questId)
      .filter((val) => val.next_id === "");
    let lastId = "";
    let lastIdIndex = null;
    if (questEntries.length && questEntries[0].info_id) {
      lastId = questEntries[0].info_id;
      lastIdIndex = state.activePlugin.findIndex(
        (item) => item.info_id === lastId
      );
      state.activePlugin.filter((val) => val.info_id === lastId)[0].next_id =
        generatedId;
    }
    //console.log(lastIdIndex)
    let newEntry = {
      TMP_topic: questId,
      TMP_type: "Journal",
      type: "Info",
      flags: [0, 0],
      info_id: generatedId,
      prev_id: lastId,
      next_id: "",
      data: {
        dialogue_type: "Journal",
        disposition: parseInt(entryDisposition),
        speaker_rank: -1,
        speaker_sex: "Any",
        player_rank: -1
      },
      text: entryText,
      filters: []
    };
    if (lastIdIndex) state.activePlugin.splice(lastIdIndex + 1, 0, newEntry);
    else state.activePlugin = [...state.activePlugin, newEntry];
  },

  deleteJournalEntry(state, info_id) {
    let questEntries = state.activePlugin.filter(
      (val) => val.info_id === info_id
    );
    if (!questEntries.length) return;
    else {
      let next_id = questEntries[0].next_id;
      let prev_id = questEntries[0].prev_id;
      state.activePlugin = state.activePlugin.filter(
        (val) => val.info_id !== info_id
      );
      let nextEntry = state.activePlugin.filter(
        (val) => val.info_id === next_id
      );
      if (nextEntry.length) {
        state.activePlugin.filter((val) => val.info_id === next_id)[0].prev_id =
          prev_id;
      }
      let prevEntry = state.activePlugin.filter(
        (val) => val.info_id === prev_id
      );
      if (prevEntry.length) {
        state.activePlugin.filter((val) => val.info_id === prev_id)[0].next_id =
          next_id;
      }
    }
  },

  editJournalEntry(state, [entryId, entryText, entryDisp, entryFinished]) {
    let questEntries = state.activePlugin.filter(
      (val) => val.info_id === entryId
    );
    if (!questEntries.length) return;
    else {
      state.activePlugin.filter((val) => val.info_id === entryId)[0].text =
        entryText;
      state.activePlugin.filter(
        (val) => val.info_id === entryId
      )[0].data.disposition = parseInt(entryDisp);
      if (entryFinished) {
        state.activePlugin.filter(
          (val) => val.info_id === entryId
        )[0].quest_finish = 1;
      }
      if (
        !entryFinished &&
        state.activePlugin.filter((val) => val.info_id === entryId)[0]
          .quest_finish
      ) {
        delete state.activePlugin.filter((val) => val.info_id === entryId)[0][
          "quest_finish"
        ];
      }
    }
  },

  setActivePluginTitle(state, title) {
    state.activePluginTitle = title;
  },

  setJournalHighlight(state, filter) {
    state.journalHighlight = filter;
  },

  resetActivePlugin(state) {
    state.activePlugin = [];
  },

  addEntryToActive(state, entry) {
    state.activePlugin = [...state.activePlugin, entry];
  },

  parsePluginData(state, plugin) {
    let dialogueType;
    let dialogueId;
    state.activePlugin = plugin;
    for (let entry in state.activePlugin) {
      if (["Info", "Dialogue"].includes(state.activePlugin[entry].type)) {
        if (state.activePlugin[entry].type === "Dialogue") {
          dialogueType = state.activePlugin[entry].dialogue_type;
        }
        if (state.activePlugin[entry].id)
          dialogueId = state.activePlugin[entry].id;
        let dialogueEntry = {
          ...state.activePlugin[entry],
          TMP_topic: dialogueId,
          TMP_type: dialogueType
        };
        state.activePlugin[entry] = dialogueEntry;
      }
      if (["Cell"].includes(state.activePlugin[entry].type)) {
        state.cellList = [...state.cellList, state.activePlugin[entry].id];
      }
      if (["Race"].includes(state.activePlugin[entry].type)) {
        state.raceList = [...state.raceList, state.activePlugin[entry].id];
      }
      if (["Class"].includes(state.activePlugin[entry].type)) {
        state.classList = [...state.classList, state.activePlugin[entry].id];
      }
      if (["Faction"].includes(state.activePlugin[entry].type)) {
        state.factionList = [
          ...state.factionList,
          state.activePlugin[entry].id
        ];
      }
    }
    state.cellList = [...new Set(state.cellList)];
    state.raceList = [...new Set(state.raceList)];
    state.classList = [...new Set(state.classList)];
    state.factionList = [...new Set(state.factionList)];
  },

  setDependencies(state, [plugin, fileName]) {
    let dialogueType;
    let dialogueId;
    let pluginData = [];
    for (let entry of plugin) {
      entry = { ...entry, TMP_dep: fileName };
      if (["Info", "Dialogue"].includes(entry.type)) {
        if (entry.type === "Dialogue") {
          dialogueType = entry.dialogue_type;
        }
        if (entry.id) dialogueId = entry.id;
        let dialogueEntry = {
          ...entry,
          TMP_topic: dialogueId,
          TMP_type: dialogueType
        };
        pluginData.push(Object.freeze(dialogueEntry));
      } else if (["Cell"].includes(entry.type)) {
        state.cellList = [...state.cellList, entry.id];
      } else if (["Race"].includes(entry.type)) {
        state.raceList = [...state.raceList, entry.id];
      } else if (["Class"].includes(entry.type)) {
        state.classList = [...state.classList, entry.id];
      } else if (
        ["Faction", "Book", "Npc", "Header", "Creature"].includes(entry.type)
      ) {
        pluginData.push(Object.freeze(entry));
        if (entry.type === "Faction") {
          state.factionList = [...state.factionList, entry.id];
        }
      }
    }
    state.cellList = [...new Set(state.cellList)];
    state.raceList = [...new Set(state.raceList)];
    state.classList = [...new Set(state.classList)];
    state.factionList = [...new Set(state.factionList)];
    state.dependencies.push({ name: fileName, data: pluginData });
  },

  addToActiveArray(state, [destination, entry]) {
    if (state.activePlugin[destination]) {
      state.activePlugin[destination] = [
        ...state.activePlugin[destination],
        entry
      ];
    } else {
      state.activePlugin[destination] = [entry];
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
