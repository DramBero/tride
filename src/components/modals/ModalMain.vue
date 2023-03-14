<template>
  <div>
    <div class="window" :class="{ window_dialogue: dialogue }">
      <div class="window-header">
        <div class="window-header__left"></div>
        <div class="window-header__name">{{ header }}</div>
        <div class="window-header__right">
          <div class="window-header__close" @click="closeModal">
            <icon name="times" scale="1.3"></icon>
          </div>
        </div>
      </div>
      <div class="window__content">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";

export default {
  components: {
    Icon
  },
  props: {
    modalHide: String,
    header: String,
    dialogue: Boolean
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
  position: absolute;
  box-shadow: 0px 0px 9px 5px rgba(0, 0, 0, 0.15);
  top: 50%;
  left: 50%;
  width: 33%;
  max-height: 80vh;
  z-index: 99;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border: 2px solid rgb(202, 165, 96);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.85);
  font-family: "Pelagiad";
  font-size: 20px;
  color: rgb(202, 165, 96);
  &_dialogue {
    width: 70%;
    height: 70%;
  }
  &-header {
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    //border: 2px solid rgb(182, 145, 76);
    &__left {
      background-color: rgb(182, 145, 76);
      flex-grow: 1;
    }
    &__right {
      background-color: rgb(182, 145, 76);
      flex-grow: 1;
      position: relative;
    }
    &__name {
      background-color: rgba(0, 0, 0, 0);
      border-radius: 2px;
      padding: 8px 20px;
      height: 35px;
      transition: all .2s ease-in;
    }
    &__close {
      color: black;
      display: flex;
      align-items: center;
      top: 1px;
      height: 99%;
      cursor: pointer;
      position: absolute;
      border: 2px solid rgb(202, 165, 96);
      user-select: none;
      background-color: rgb(202, 165, 96);
      border-radius: 4px;
      padding: 0 10px;
      right: 15px;
      &:hover {
        background-color: rgba(0, 0, 0, 0);
      }
    }
  }
  &__content {
    border: 2px solid rgb(202, 165, 96);
    // padding: 5px;
    height: 100%;
    max-height: calc(100% - 35px);
  }
}
</style>
