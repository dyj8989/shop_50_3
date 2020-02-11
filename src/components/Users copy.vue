<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addBtn" plain type="success">添加用户</el-button>
    <!-- 表格 -->
    <el-table border :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="180">
        <!-- 通过 作用域插槽 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <template v-slot:default="obj">
          <!-- {{obj.row}} -->
          <el-switch v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot:default="obj">
          <el-button type="primary" plain icon="el-icon-edit" size="small"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="delUser(obj.row.id)"
          ></el-button>
          <el-button type="success" plain icon="el-icon-check" size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change 每页条数的变化
         @current-change  当前页变化时触发
         :current-page 当前页
         :page-sizes 供用户选择的, 每页条数
         :page-size  当前每页的条数
         layout 指的是控件列表
         :total 总条数
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '', // 查询参数
      pagenum: 1, // 当前页码
      pagesize: 2, // 每页显示条数
      userList: [], // 用户数据集合
      total: 0 // 总个数
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      // 1.axios.post(url,data,config) config中一般可以配置一些额外的参数（请求头）
      // put patch 同 post
      // 2.axios.get(url,config) 可以配置params,也可以配置请求头等额外参数
      // 发送get获取用户的axios
      // delete 同 get
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          // 配置params
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          // 配置请求头
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          // console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            this.userList = data.users
            this.total = data.total
            // console.log(this.userList)
          } else {
            this.$message.error(meta.msg)
          }
        })
    },
    // 修改每条的条数
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 将当前页更新成第一页
      this.pagenum = 1
      // 重新渲染
      this.getUserList()
    },
    // 当前页变化时, 触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // val 用户选择的当前页
      this.pagenum = val
      // 重新渲染
      this.getUserList()
    },
    // 删除角色
    delUser (id) {
      // console.log(id)
      // 参数1: 内容
      // 参数2: 标题
      // 参数3: 配置 warning success error
      this.$confirm('你确定要删除吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          // 点击确认时，发送ajax请求
          axios
            .delete(`http://localhost:8888/api/private/v1/users/${id}`, {
              // 设置请求头
              headers: {
                Authorization: localStorage.getItem('token')
              }
            })
            .then(res => {
              console.log(res)
              const { meta } = res.data
              if (meta.status === 200) {
                // 删除成功
                this.$message.success('删除成功')
                // 如果当前只有一条了,删除后,当前页--
                if (this.userList.length === 1 && this.pagenum > 1) {
                  this.pagenum--
                }
                // 重新渲染当前页
                this.getUserList()
              } else {
                this.$message.error(meta.msg)
              }
            })
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin: 0 20px;
  }
}
</style>
