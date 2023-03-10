<template>
  <div class="dialogue-card" @click="openDialogueModal">
    <span class="dialogue-card__name">{{ getNpc.name || speakerId }}</span>
    <div v-if="getNpcFace" class="dialogue-card__decoration"></div>
    <img class="dialogue-card__image" v-if="getNpcFace" :src="getNpcFace ? require('@/assets/images/faces/' + getNpcFace) : ''" :alt="getNpc.name || speakerId" :title="getNpc.name || speakerId">
  </div>
</template>

<script>
export default {
  props: {
    speakerType: {
      type: String
    },
    speakerId: {
      type: String
    }
  },
  computed: {
    getNpc() {
      return this.$store.getters['getNpcById'](this.speakerId)
    },
    getNpcFace() {
      let sex = this.getNpc.npc_flags % 2 ? 'f' : 'm'
      switch(this.getNpc.race) {
        case "Argonian": return 'argonian-' + sex + '.png'
        case "High Elf": return 'altmer-' + sex + '.png'
        case "Dark Elf": return 'dunmer-' + sex + '.png'
        case "Breton": return 'breton-' + sex + '.png'
        case "Wood Elf": return 'bosmer-' + sex + '.png'
        case "Imperial": return 'imperial-' + sex + '.png'
        case "Khajiit": return 'khajiit-' + sex + '.png'
        case "Nord": return 'nord-' + sex + '.png'
        case "Orc": return 'ord-' + sex + '.png'
        case "Redguard": return 'redguard-' + sex + '.png'
        default: return ''
      }
    }
  },
  methods: {
    openDialogueModal() {
      this.$store.commit("setDialogueModal", this.speakerId);
    }
  }
};
</script>

<style lang="scss">
.dialogue-card {
  font-family: "Pelagiad", "Sans serif";
  line-height: 23px;
  font-size: 18px;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid rgb(202, 165, 96);
  border-radius: 4px;
  word-break: break-word;
  min-width: 200px;
  max-width: 300px;
  flex-grow: 1;
  height: 220px;
  padding: 20px;
  text-align: center;
  color: rgb(202, 165, 96);
  cursor: pointer;
  transition: all 0.1s ease-in;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  align-items: center;
  //gap: 10px;
  &:hover {
    background: rgb(202, 165, 96);
    color: black;
    .dialogue-card__decoration {
      background: rgb(53, 44, 27);
      transform: translateY(-65%) rotate(-8deg) scale(1.2);
    }
  }
  &__decoration {
    position: absolute;
    top: 50%;
    transform: translateY(-65%) rotate(-8deg);
    width: 70%;
    height: 30%;
    clip-path: ellipse(45% 40% at 50% 50%);
    background: rgb(202, 165, 96);
    transition: all .25s ease-in;
  }
  &__image {
    object-fit: cover;
    //max-height: 80%;
    transition: all .15s ease-in;
    transform: scale(0.65);
    filter: sepia(10%) contrast(140%);
-webkit-filter: sepia(10%) contrast(140%);
-moz-filter: sepia(10%) contrast(140%);
  }
}
</style>
