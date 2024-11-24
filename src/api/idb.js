import Dexie, { DBCoreRangeType } from "dexie";
import { active } from "sortablejs";

let databases = {};

new Dexie("activePlugin");

export const createDB = function (name) {
  databases[name] = new Dexie(name);
};

export const getDB = function (name) {
  return databases[name];
};

export const deleteDB = function (name) {
  Dexie.delete(name);
  delete databases[name];
};

export const initPlugin = async function (pluginName) {
  createDB(pluginName);
  let activePlugin = getDB(pluginName);
  activePlugin.version(1).stores({
    pluginData: "TMP_index,type,TMP_is_active,TMP_topic,TMP_type,TMP_info_id,TMP_prev_id,TMP_next_id,TMP_speaker_id,TMP_speaker_cell,TMP_speaker_faction,TMP_speaker_class,TMP_speaker_rank,TMP_id",
  });
  await activePlugin.open().catch((err) => {
    console.error (err.stack || err)
  })
  return activePlugin;
}

export const getDependencies = async function () {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  const headers = await activePlugin.pluginData.where('type').equals('Header').toArray()
  if (!headers.length) {
    throw('NO_HEADERFOUND')
  }
  const header = headers[0]
  const dependecies = header.masters.map(val => val[0])
  return dependecies
}

export const fetchNPCData = async function (npcID) {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  try {
    const response = await activePlugin.pluginData
      .where("TMP_id").equals(npcID)
      .and(entry => entry['type'] === 'Npc' || entry['type'] === 'Creature')
      .toArray()
    if (response.length) {
      return response[0]
    } else {
      const dependecies = await getDependencies()
      for (let dep of dependecies) {
        let dependencyDB = databases[dep]
        if (!dependencyDB) {
          continue
        }
        let depResponse = await dependencyDB.pluginData
          .where("TMP_id").equals(npcID)
          .and(entry => entry['type'] === 'Npc' || entry['type'] === 'Creature')
          .toArray()
        
        if (depResponse.length) {
          return depResponse[0]
        }
        continue
      }
      throw('NPC_NOT_FOUND')
    }
    
  } catch (error) {
    throw(error)
  }
}

export const fetchQuestByID = async function (questID) {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  try {

    let entries = await activePlugin.pluginData
      .where("TMP_topic").equals(questID)
      .and(val => val.type === 'Info' && val.quest_name !== 1).toArray()
    let name = await activePlugin.pluginData
      .where("TMP_topic").equals(questID)
      .and(val => val.type === 'Info' && val.quest_name === 1).toArray()
    if (!name.length) {
      name = ''
    } else {
      name = name[0].text
    }

    return { name, entries }

  } catch (error) {
    throw(error)
  }
}

export const fetchTopicListByNPC = async function (npcID) {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  try {
    let entries = await activePlugin.pluginData
      .where({TMP_speaker_id: npcID})
      .toArray()
    let dialogue = {}
    dialogue.topics = [...new Set(entries.filter(val => val.TMP_type === 'Topic').map(entry => entry.TMP_topic))]
    dialogue.greetings = [...new Set(entries.filter(val => val.TMP_type === 'Greeting').map(entry => entry.TMP_topic))]
    dialogue.persuasions = [...new Set(entries.filter(val => val.TMP_type === 'Persuasion').map(entry => entry.TMP_topic))]
    return dialogue
  } catch (error) {
    throw(error)
  }
}

export const fetchAllDialogueNPCs = async function () {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  try {
    let resp
    await activePlugin.pluginData
      .orderBy("TMP_speaker_id")
      .uniqueKeys(keys => keys.filter(val => val !== ''))
      .then((response) => {
        resp = response
      })
    return resp
  } catch (error) {
    throw(error)
  }
}

export const fetchAllQuestIDs = async function () {
  if (!databases['activePlugin']) {
    throw('NO_INDEXEDDB_PLUGIN')
  }
  const activePlugin = databases['activePlugin']
  try {
    let resp = await activePlugin.pluginData
      .where("type").equals('Dialogue')
      .and(val => val.TMP_type === 'Journal').toArray()
    return resp
    
  } catch (error) {
    throw(error)
  }
}

export const getAllDialogue = async function(topicId) {
  const dependecies = await getDependencies()
  let dialogue = []
  try {
    for (let dep of dependecies) {
      let dependencyDB = databases[dep]
      if (!dependencyDB) {
        continue
      }
      let depResponse = await dependencyDB.pluginData
        .where("type").equals('Info')
        .and(entry => entry['TMP_topic'] === topicId)
        .toArray()
      dialogue = [...dialogue, depResponse]
    }
    const activePlugin = databases['activePlugin']
    const response = await activePlugin.pluginData
      .where("type").equals('Info')
      .and(entry => entry['TMP_topic'] === topicId)
      .toArray()
      dialogue = [...dialogue, response]
    return dialogue
  } catch (error) {
    throw(error)
  }

}

export const getOrderedEntriesByTopic = async function(topicId) {
  if (!topicId) return [];

  let pluginDialogue = await getAllDialogue(topicId)

  console.log('dialogue: ', pluginDialogue)

  if (!pluginDialogue.flat(1).length) return [];

  let dependencies = await getDependencies()

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

  if (!firstElement) {
    throw('NO_PREV_ID')
  };

  let orderedDialogue = [firstElement];
  let nextEntry;
  while (true) {
    let nextEntries = [
      ...new Set([
        findByIdType("prev_id", orderedDialogue.at(-1).info_id),
        findByIdType("info_id", orderedDialogue.at(-1).next_id)
      ])
    ];
    for (let dependency of dependencies) {
      nextEntry =
        nextEntries.find((val) => val.TMP_dep === dependency) ||
        nextEntry;
    }
    nextEntry = nextEntries.find((val) => val.TMP_is_active) || nextEntry;
    if (nextEntry) {
      orderedDialogue.push(nextEntry);
      if (!nextEntry.next_id) break;
    } else break;
  }
  return orderedDialogue;
}

export const importPlugin = async function (pluginData, pluginName, isActive) {
  let dialogueType;
  let dialogueId;
  let activePlugin = await initPlugin(isActive ? 'activePlugin' : pluginName);
  let tableLength = await activePlugin.pluginData.count()
  if (tableLength) {
    console.log('exists')
    await activePlugin.pluginData.clear()
  }
  let entries = [];

/*   let chunksAmount = Math.ceil(pluginData.length / 5000)

  for (let chunkIndex in chunksAmount) {
    let chunk = pluginData.slice((chunkIndex * 5000), ((chunkIndex + 1)))
  }
 */
  for (let index in pluginData) {
    let dialogueEntry;
    if (["Info", "Dialogue"].includes(pluginData[index].type)) {
      if (pluginData[index].type === "Dialogue") {
        dialogueType = pluginData[index].dialogue_type;
      }
      if (pluginData[index].id) {
        dialogueId = pluginData[index].id;
      }
      dialogueEntry = {
        type: "",
        ...pluginData[index],
        TMP_id: pluginData[index].id || '',
        TMP_topic: dialogueId,
        TMP_type: dialogueType,
        TMP_info_id: pluginData[index].info_id,
        TMP_prev_id: pluginData[index].prev_id,
        TMP_next_id: pluginData[index].next_id,
        TMP_speaker_id: pluginData[index].speaker_id,
        TMP_speaker_cell: pluginData[index].speaker_cell,
        TMP_speaker_faction: pluginData[index].speaker_faction,
        TMP_speaker_class: pluginData[index].speaker_class,
        TMP_speaker_rank: pluginData[index].speaker_rank,
        TMP_dep: pluginName,
        TMP_is_active: isActive,
        TMP_index: parseInt(index)
      };
    } else {
      dialogueEntry = {
        type: "",
        ...pluginData[index],
        TMP_id: pluginData[index].id || '',
        TMP_topic: "",
        TMP_type: "",
        TMP_info_id: "",
        TMP_prev_id: "",
        TMP_next_id: "",
        TMP_speaker_id: "",
        TMP_speaker_cell: "",
        TMP_speaker_faction: "",
        TMP_speaker_class: "",
        TMP_speaker_rank: "",
        TMP_dep: pluginName,
        TMP_is_active: isActive,
        TMP_index: parseInt(index)
      };
    }
    entries.push(dialogueEntry);
  }
  await activePlugin.transaction('rw', activePlugin.pluginData, async () => {
    await activePlugin.pluginData.bulkAdd(entries).catch((error) => {
      console.log("Dexie ERROR on importing123");
      console.log(error);
    });
  })
  if (isActive) {
    const dependecies = await getDependencies()
    for (let dep of dependecies) {
      await initPlugin(dep)
    }
  }


  return databases[isActive ? 'activePlugin' : pluginName];
};
