<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格渲染 -->
   <el-table :data="rightsList" style="width:100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限管理"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{ row: { level }}">
          <span v-if="level === '0'">一级</span>
          <span v-else-if="level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList () {
      try {
        const { data, meta } = await this.$axios.get('rights/list')
        // console.log(data, meta)
        if (meta.status === 200) {
          this.rightsList = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
