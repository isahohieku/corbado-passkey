<template>
  <corbado-auth
    :project-id="getProjectKey"
    conditional="no"
    :page="page"
    company-image-url="http://localhost:3000/img/logo.png"
  >
    <input id="username" name="username" required />
  </corbado-auth>
</template>

<script lang="ts">
import Vue from "vue";
import "@corbado/webcomponent";
import { PROJECT_ID } from "@/constants";

export default Vue.component("CorbadoForm", {
  props: {
    page: { type: String, default: "login" },
  },
  computed: {
    getProjectKey(): string {
      return PROJECT_ID;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
