<template>
  <div class="workspace-controls">
    <div class="workspace-controls__button" :class="{'workspace-controls__button_active': getSidebarActive === 'Journal'}" @click="toggleSidebarActive('Journal')">
        <icon
            name="book-open"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>Journal</span>
    </div>
    <div class="workspace-controls__button" :class="{'workspace-controls__button_active': getSidebarActive === 'Header'}" @click="toggleSidebarActive('Header')">
        <icon
            name="file-alt"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>Header</span>
    </div>
    <div class="workspace-controls__button workspace-controls__button_wip" disabled :class="{'workspace-controls__button_active': getSidebarActive === 'Factions'}" >
        <icon
            name="users"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>Factions</span>
    </div>
<!--     <div class="workspace-controls__button workspace-controls__button_wip" disabled>
        <icon
            name="user"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>NPCs</span>
    </div> -->
    <div class="workspace-controls__button workspace-controls__button_wip" disabled>
        <icon
            name="book"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>Books</span>
    </div>
    <div class="workspace-controls__button workspace-controls__button_wip" disabled>
        <icon
            name="code"
            class="icon-controls"
            scale="2"
        ></icon>
        <span>Scripts</span>
    </div>
  </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons";
export default {
components: {
    Icon,
},
methods: {
    toggleSidebarActive(value) {
        this.$store.commit('toggleSidebarActive', value)
    }
},
computed: {
    getSidebarActive() {
        return this.$store.getters['getSidebarActive']
    }
}
}
</script>

<style lang="scss">
.workspace-controls {
    min-width: 70px;
    z-index: 5;
    height: 100%;
    background: rgb(49, 44, 28);
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    gap: 10px;
    &__button {
        width: 100%;
        user-select: none;
        cursor: pointer;
        min-height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .1s ease-in;
        display: flex;
        flex-direction: column;
        position: relative;
        gap: 5px;
        border-left: 3px solid rgba(216, 216, 216, 0);
        border-right: 3px solid rgba(216, 216, 216, 0);
        color: rgba(216, 216, 216, 0.5);
        &:hover {
            color: rgba(216, 216, 216, 0.8);
            .icon-controls {
                fill: rgba(216, 216, 216, 0.8);
            }
            
        }
        &_active {
            color: rgba(216, 216, 216, 1);
            border-left: 3px solid rgba(216, 216, 216, 1);
            .icon-controls {
                fill: rgba(216, 216, 216, 1);
            }
            &:hover {
                color: rgba(216, 216, 216, 1);
                .icon-controls {
                fill: rgba(216, 216, 216, 1);
            }
            }
        }
        &_wip {
            &::before {
                content: 'TBA';
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
                position: absolute;
                top: 15px;
                right: 10px;
                font-weight: 500;
                font-size: 12px;
                color: white;
                text-align: center;
                transform: rotate(10deg);
                border-radius: 4px;
                width: 40px;
                height: 15px;
                background: rgb(177, 64, 64);
            }
            &:hover {
                color: rgba(216, 216, 216, 0.5);
                cursor: default;
                .icon-controls {
                    fill: rgba(216, 216, 216, 0.5);
                }
            }
        }
        &:disabled {
            cursor: default;
            color: gray;
            .icon-controls {
                fill: gray;
            }
            &:hover {
                color: gray;
                .icon-controls {
                    fill: gray;
                }
            }
        }
    }
}

.icon-controls {
    fill: rgba(216, 216, 216, 0.5);
    transition: fill .2s ease-out;
}
</style>