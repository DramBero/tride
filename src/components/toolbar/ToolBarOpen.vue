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
  display: flex;
  align-items: center;
  padding: 10px 15px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
</style>
