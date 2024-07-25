<template>
  <div id="app">
    <TableComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TableComponent from './components/TableComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    TableComponent,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>