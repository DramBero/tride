<template>
  <div>
    <div class="window">
      <div class="window-header">
        <div class="window-header__left"></div>
        <div class="window-header__name">Header</div>
        <div class="window-header__right">
          <div class="window-header__close" @click="closeModal">Close</div>
        </div>
      </div>
      <div class="window__content">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalHide: String
  },
  methods: {
    closeModal() {
      this.$store.commit(this.modalHide);
    }
  }
};
</script>

<style lang="scss">
.window {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 33%;
  height: 33%;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border: 2px solid rgb(202, 165, 96);
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.85);
  font-family: "Pelagiad";
  font-size: 20px;
  color: rgb(202, 165, 96);
  &-header {
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    border: 2px solid rgb(182, 145, 76);
    &__left {
      background-color: rgb(182, 145, 76);
      flex-grow: 1;
    }
    &__right {
      background-color: rgb(182, 145, 76);
      flex-grow: 1;
    }
    &__name {
      background-color: rgba(0, 0, 0, 0);
      border-radius: 2px;
      padding: 2px 20px;
    }
    &__close {
      color: black;
      position: absolute;
      border: 1px solid rgb(202, 165, 96);
      user-select: none;
      padding: 0 10px;
      right: 15px;
      &:hover {
        background-color: rgb(202, 165, 96);
      }
    }
  }
  &__content {
    border: 2px solid rgb(202, 165, 96);
    padding: 5px;
    height: 100%;
  }
}
</style>
