<template>
    <div class="sidebar">
        <JournalFrame v-show="getSidebarActive === 'Journal'" :key="4"/>
        <HeaderFrame v-show="getSidebarActive === 'Header'" :key="5" />
    </div>
</template>

<script>
import JournalFrame from './journal/JournalFrame.vue'
import HeaderFrame from './plugin-header/HeaderFrame.vue'
export default {
  components: { JournalFrame, HeaderFrame },
    computed: {
        getSidebarActive() {
            return this.$store.getters['getSidebarActive']
        }
    }
}
</script>

<style lang="scss">
.sidebar {
    background-color: #986;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
  z-index: 2;
  //padding: 10px;
  min-width: 500px;
  max-width: 500px;
  height: 100%;
  max-height: 100%;
  font-family: "Pelagiad";
  position: relative;
}
</style>