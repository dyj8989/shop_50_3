<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss" >
/* 不加任何限制是，组件与组件之间的样式，是会互相影响的 */
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
#app .el-breadcrumb {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.mb-10 {
  margin-bottom: 10px !important;
}
</style>
