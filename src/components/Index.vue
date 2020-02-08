<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <!-- el-menu: 主菜单
    default-active = '2' 默认激活的导航
    unique-opened 只保持一个打开
    el-submenu: 子菜单
        el-menu-item 子菜单展开内容-->
        <el-menu
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <!-- 标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      // this.confirm
      // 参数1：提示信息
      // 参数2：标题
      // 参数3：配置对象
      this.$confirm('亲，你确定要退出系统吗？', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          // 确认提示
          this.$message.success('退出成功')
          // 从本地清除 token
          localStorage.removeItem('token')
          // 跳转登录路由
          this.$router.push('/login')
        })
        .catch(() => {
          // 取消
          this.$message('取消退出')
        })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
// 默认情况下，vue开发的单页应用程序，不同组件之间的样式，是会互相影响的
// 1.使用模块的类名限制
// 2.scoped属性，给style标签添加上scoped属性，可以让样式只作用于当前组件模板中的内容
// 如果希望组件中的样式，只作用于当前组件模板中的内容，一般推荐加上scoped属性

// 原理：
// 1.给当前组件模板中所有的元素，都添加上了一个自定义属性 data-v-82b7485c
// 2.给style中的选择器，每个选择器，都加上了一个属性选择器
// div=>div[data-v-82b7485c]
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
}
</style>
