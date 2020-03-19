<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain class="mb-10" @click="showAddRoles">添加角色</el-button>
    <!-- 表格渲染 -->
    <!-- 通过 data 属性注入数组, prop 定义键名 label定义列名 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <!-- row当前角色 -->
          <p v-if="row.children.length===0">暂无权限</p>
          <!-- 一个一级权限, 应该独占一行 -->

          <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
            <!-- 右侧权限 -->
            <el-col :span="4">
              <el-tag closable @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <!-- 渲染二级权限, 一个二级权限, 独占一行 -->
              <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                <el-col :span="4">
                  <el-tag closable type="success" @close="delRight(row,l2.id)">{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <!-- 显示三级权限 -->
                  <el-tag
                    class="l3"
                    closable
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    type="warning"
                    @close="delRight(row,l3.id)"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(row)"
          ></el-button>
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="delRole(row.id)"
          ></el-button>
          <el-button
            plain
            size="small"
            type="success"
            icon="el-icon-check"
            @click="showAssignDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="40%">
      <el-form label-width="100px" :model="addRolesForm" :rules="rules" ref="addRolesForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加角色修改对话框  -->
    <el-dialog title="修改角色" :visible.sync="editRolesVisible" width="40%">
      <el-form label-width="100px" :model="editRolesForm" :rules="rules" ref="editRolesForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分配权限对话框 -->
    <!--  -->
    <el-dialog title="分配权限" :visible.sync="assignRolesVisible" width="40%">
      <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      addRolesVisible: false,
      editRolesVisible: false,
      assignRolesVisible: false,
      addRolesForm: {
        roleDesc: '',
        roleName: ''
      },
      editRolesForm: {
        roleDesc: '',
        roleName: '',
        id: ''
      },
      roleId: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleDesc: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: ['change', 'blur']
          }
        ],
        roleName: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取全部权限
    async getRoleList () {
      try {
        const { meta, data } = await this.$axios.get('roles')
        // console.log(meta, data)
        if (meta.status === 200) {
          this.roleList = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delRight (row, rightId) {
      console.log(row, rightId)
      try {
        const { data, meta } = await this.$axios.delete(
          `roles/${row.id}/rights/${rightId}`
        )
        // console.log(data,meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          row.children = data
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 展示添加角色谈话框
    showAddRoles () {
      this.addRolesVisible = true
    },
    // 添加角色
    async addRoles () {
      try {
        await this.$refs.addRolesForm.validate()
        // console.log('成功了')
        const { meta } = await this.$axios.post('roles', this.addRolesForm)
        // console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addRolesVisible = false
          this.$refs.addRolesForm.resetFields()
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除角色
    async delRole (id) {
      try {
        await this.$confirm('你确定要删除该角色', '温馨提示', {
          type: 'warning'
        })
        // 发送删除的ajax请求
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        }
      } catch (e) {
        this.$message('取消删除')
      }
    },
    // 展示修改对话框
    showEditDialog (row) {
      this.editRolesVisible = true
      this.editRolesForm.roleName = row.roleName
      this.editRolesForm.roleDesc = row.roleDesc
      this.editRolesForm.id = row.id
      console.log(row)
    },
    // 修改角色
    async editRoles () {
      try {
        // 校验表单
        await this.$refs.editRolesForm.validate()
        console.log('成功了')
        // 发送修改角色的ajax请求
        const { meta } = await this.$axios.put(
          `roles/${this.editRolesForm.id}`,
          this.editRolesForm
        )
        if (meta.status === 200) {
          this.editRolesVisible = false
          this.getRoleList()
          this.$message.success('修改成功')
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 展示分配权限
    async showAssignDialog (row) {
      try {
        this.roleId = row.id
        this.assignRolesVisible = true
        // 发送ajax请求,获取全部的权限数据
        const { data, meta } = await this.$axios.get('rights/tree')
        // console.log(data, meta)
        if (meta.status === 200) {
          // 进行数据展示
          this.data = data
          // 设置选中时,如果设置一级，所有的二级三级都会被全选(不一定)
          // 应该设置三级,如果真的所有的三级都被选中了,对应的二级和一级会自动选中
          // this.$refs.tree.setCheckedKeys([101])
          // 获取所有的三级权限的id,用于设置
          const arr = []
          row.children.forEach(l1 => {
            // 拿到一级
            l1.children.forEach(l2 => {
              // 拿到二级
              l2.children.forEach(l3 => {
                // 拿到三级
                arr.push(l3.id)
              })
            })
          })
          this.$refs.tree.setCheckedKeys(arr)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分配权限
    async assignRight () {
      try {
        // 获取选中的权限id(全选中的 和半选中的)
        // 只能获取到全部选中的 id,  勾选中的 id
        // console.log(this.$refs.tree.getCheckedKeys())
        // 还需要获取半选中的 id
        // console.log(this.$refs.tree.getHalfCheckedKeys())
        const ids = this.$refs.tree.getCheckedKeys()
        const halfs = this.$refs.tree.getHalfCheckedKeys()
        const rids = [...ids, ...halfs].join(',')
        // console.log(rids)
        const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, {
          rids
        })
        // console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.assignRolesVisible = false
          this.getRoleList()
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

<style lang="scss" scoped>
.roles {
  .l1 {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    &:last-child {
      border-bottom: none;
    }
  }
  .l2 {
    margin-bottom: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
