<template>
  <div class="dialogue-card" @click="openDialogueModal">
    {{ speakerId }}
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
  &:hover {
    background: rgb(202, 165, 96);
    color: black;
  }
}
</style>
