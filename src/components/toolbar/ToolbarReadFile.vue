<template>
  <div>
    <label class="text-reader">
      <input ref="file" type="file" @change="loadTextFromFile" />
      {{ active ? "Load active plugin" : "Load dependency" }}
    </label>
    {{ fileName }}
    {{ fileSize }}
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      fileName: "",
      fileSize: null
    };
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      this.fileName = ev.target.files[0].name;
      this.fileSize = this.formatBytes(ev.target.files[0].size);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.active) {
          this.$store.dispatch("parseLocalPlugin", [
            JSON.parse(e.target.result)
          ]);
        }
      };
      reader.readAsText(file);
    }
  }
};
</script>

<style>
input[type="file"] {
  display: none;
}
.text-reader {
  border: 2px solid rgb(202, 165, 96);
  border-radius: 2px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
