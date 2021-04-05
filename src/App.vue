<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" />
    <h2>一款聚合Msg|Dialog|Popup|ActionSheet|Toast等功能的轻量级Vue弹窗组件VPopup</h2>
    <DemoPage />
  </div>
</template>

<script>
import DemoPage from './components/popup/demo.vue'

export default {
  name: 'App',
  components: {
    DemoPage
  }
}
</script>

<style>
body {background: #f5f5f5; margin:0; padding: 0;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.logo {margin-top: 10px; width: 60px;}
h2 {color: #516a84; font-size: 14px; font-family:Georgia; margin: 0 auto; padding: 3px 15px 15px; width: 280px;}
::-webkit-scrollbar {display: none;}
</style>
