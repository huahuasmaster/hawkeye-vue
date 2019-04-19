<template>
  <v-content>
    <v-snackbar :color="$store.state.type" :value = "$store.state.showAlert" top right>
      {{$store.state.content}}
      <v-btn
              flat
              @click="$store.commit('cancelAlert')"
      >
        好的
      </v-btn>
    </v-snackbar>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
  </v-content>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: 'hwakeye by huahuasmaster'
    }
  }
}
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>
