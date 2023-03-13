<template>
  <div v-if="code">
    <div class="results" :class="{ results_lua: language === 'Lua' }">
      <span
        class="script-language"
        :class="{ 'script-language_lua': language === 'Lua' }"
        >{{ language }}</span
      >
      <prism-editor
        class="editor-code"
        v-model="luaCode"
        :readonly="!editMode"
        :wordwrap="false"
        :highlight="language === 'Lua' ? highlighterLua : highlighterBasic"
        lineNumbers
      ></prism-editor>
    </div>
  </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-javascript";

export default {
  components: {
    PrismEditor
  },
  props: {
    code: {
      type: String
    },
    language: {
      type: String
    },
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      luaCode: ""
    };
  },
  beforeMount() {
    this.luaCode = this.code;
  },
  methods: {
    highlighterLua(code) {
      return highlight(code, languages.lua);
    },
    highlighterBasic(code) {
      return highlight(code, languages.javascript);
    }
  }
};
</script>

<style lang="scss">

.editor-code {
  .prism-editor {
    &__line-numbers {
      padding-right: 10px;
    }
  }
}
.results {
  border: 1px solid rgba(170, 169, 98, 0.7);
  font-family: "Consolas";
  background: rgb(32, 32, 22);
  line-height: 20px;
  position: relative;
  //overflow-x: scroll;
  //white-space: pre-line;
  min-width: 50%;
  border-radius: 4px;
  font-size: 14px;
  padding: 0px;
  margin: 10px 20px;
  &:focus {
    background: rgb(59, 59, 59);
  }
  &_lua {
    border: 1px solid rgba(98, 150, 170, 0.7);
    background: rgb(17, 30, 36);
    .dialogue-answers-answer-results__result {
      color: rgb(159, 169, 223);
    }
  }
  &__result {
    overflow-x: scroll;
    display: block;
    padding: 0 10px;
  }
}

.script-language {
  background: rgba(170, 169, 98, 0.5);
  width: 100%;
  display: block;
  color: rgb(237, 238, 167);
  padding: 0 10px;
  //margin-bottom: 5px;
  font-size: 16px;
  font-weight: 500;
  &_lua {
    color: rgb(167, 236, 238);
    background: rgba(98, 150, 170, 0.5);
  }
}
</style>