<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    classObj() {
      let className = ''
      switch (this.$store.state.settings.theme) {
        case '#6959CD':
          className = 'purple-theme'
          break
        case '#F5222D':
          className = 'red-theme'
          break
        case '#304156':
          className = 'black-theme'
          break
        default:
          className = 'default-theme'
      }
      return {
        [className]: true
      }
    }
  }
}
</script>
