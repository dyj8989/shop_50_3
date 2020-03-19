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
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button class="addBtn" plain type="success" @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table border :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="180">
        <!-- 通过 作用域插槽 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <template v-slot:default="obj">
          <!-- {{obj.row}} -->
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(obj.row.id,obj.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot:default="obj">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="small"
            @click="showEditDialog(obj.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="delUser(obj.row.id)"
          ></el-button>
          <el-button type="success" plain icon="el-icon-check" size="small" @click="showAssingDialog(obj.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
      <!-- @size-change 每页条数的变化
         @current-change  当前页变化时触发
         :current-page 当前页
         :page-sizes 供用户选择的, 每页条数
         :page-size  当前每页的条数
         layout 指的是控件列表
         :total 总条数
      -->
    </el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input placeholder="请输入用户名称" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" placeholder="请输入用户密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 点击提交表单添加用户 -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="assignVisible" width="40%">
      <el-form ref="assignForm" :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
            <el-select v-model="assignForm.rid" placeholder="请选择角色">
              <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible= false">取 消</el-button>
        <!-- 点击提交表单添加用户 -->
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      query: '', // 查询参数
      pagenum: 1, // 当前页码
      pagesize: 2, // 每页显示条数
      userList: [], // 用户数据集合
      total: 0, // 总个数
      dialogVisible: false, // 控制添加对话框
      editVisible: false, // 控制修改对话框
      assignVisible: false, // 控制分配角色对话框
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验规则
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '用户长度在3到12字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '密码长度在3到12字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // 1.axios.post(url,data,config) config中一般可以配置一些额外的参数（请求头）
      // put patch 同 post
      // 2.axios.get(url,config) 可以配置params,也可以配置请求头等额外参数
      // 发送get获取用户的axios
      // delete 同 get
      try {
        const res = await this.$axios.get('users', {
          // 配置params
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        // console.log(res, '到这就说明成功了')
        const { data, meta } = res
        if (meta.status === 200) {
          this.userList = data.users
          this.total = data.total
          // console.log(this.userList)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
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
    async delUser (id) {
      // console.log(id)
      // 参数1: 内容
      // 参数2: 标题
      // 参数3: 配置 warning success error
      try {
        await this.$confirm('你确定要删除吗?', '温馨提示', {
          type: 'warning'
        })
        // console.log('到这里拜师成功了')
        // 点击确认时，发送ajax请求
        const res = await this.$axios.delete(`users/${id}`)
        const { meta } = res
        if (meta.status === 200) {
          // 删除成功
          this.$message.success('删除成功')
          // 如果当前只有一条了,删除后,当前页--
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染当前页
          this.getUserList()
        }
      } catch (e) {
        this.$message('取消删除')
        console.log(e)
      }
    },
    // 根据搜索关键字, 搜索数据展示
    searchUser () {
      // 搜索后, 需要将当前页改为第一页
      this.pagenum = 1
      this.getUserList()
      this.query = ''
    },
    // 改变用户的状态
    async changeState (id, flag) {
      console.log(id, flag)
      try {
        const res = await this.$axios.put(`users/${id}/state/${flag}`)
        console.log('成功了')
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示showAddDialog
    showAddDialog () {
      this.dialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        const res = await this.$axios.post('users', this.form)
        console.log(res)
        const { meta } = res
        if (meta.status === 201) {
          // 成功提示
          this.$message.success(meta.msg)
          // 先让total+1(增加总条数)
          this.total++
          // 将当前页，更新成最后一页 总条数1/每页多少条5
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 关闭对话框
          this.dialogVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 显示修改用户对话框
    showEditDialog (row) {
      console.log(row)
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 修改用户信息
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        // 校验成功
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, {
          email,
          mobile
        })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 展示修改角色对话框
    async showAssingDialog (row) {
      this.assignVisible = true
      // 回显基本数据
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      // 角色id,rid也要回显,发送请求
      const resUser = await this.$axios.get(`users/${row.id}`)
      console.log(resUser)
      if (resUser.meta.status === 200) {
        const rid = resUser.data.rid
        console.log(rid)
        // 若果是新添加的用户,给''
        this.assignForm.rid = rid === -1 ? '' : rid
      }
      // 发送ajax请求，获取用于分配的全部角色列表
      const { meta, data } = await this.$axios.get(`roles`)
      console.log(meta, data)
      if (meta.status === 200) {
        // 获取成功
        this.roleList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配角色
    // admin:0超级管理员
    // 1.给分配按钮添加点击事件
    // 2.分配时,基本非空校验,校验完成分配成功
    async assignRole () {
      // 从assignForm,id用户id,rid角色id
      const { id, rid } = this.assignForm
      // if (rid === '') {
      //   this.$message.error('请选择角色')
      //   return
      // }
      // 简化写法
      if (!rid) return this.$message.error('请选择角色')
      // 发送ajax请求,进行分配角色
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        // 提示
        this.$message.success(meta.msg)
        // 关闭对话框
        this.assignVisible = false
        // 重新渲染
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
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
