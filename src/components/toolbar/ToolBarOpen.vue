<template>
  <button class="open-btn" @click="toggleOpenModal">Open</button>
</template>

<script>
export default {
  methods: {
    toggleOpenModal() {
      this.$store.commit("toggleOpenFile", true);
    }
  }
};
</script>

<style lang="scss">
.open-btn {
  font-family: "Pelagiad";
  font-size: 23px;
  padding: 15px;
  background-color: #cb9;
  &:hover {
    background-color: #dca;
  }
}
</style>
