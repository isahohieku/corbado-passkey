<template>
  <v-container fluid h-full class="d-flex align-center justify-center">
    <v-row class="my-auto">
      <v-col>
        <corbado-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import CorbadoForm from "@/components/CorbadoForm.vue";

export default Vue.component("Home", {
  components: {
    CorbadoForm,
  },
});
</script>
