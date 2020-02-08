<template>
  <div class="login">
    <el-form :model="form" label-width="80px" status-icon :rules="rules" ref="form">
      <img src="../assets/表情包/微信图片_20190708214449.gif" alt="头像" class="logoImg" />
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // required 非空校验
          // message 提示信息
          // trigger 触发条件 blur 失去焦点的时候进行校验 change 输入框内容改变时候触发
          // mix 和 max 长度校验
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须在3-12位',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码长度必须在6-12位',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    login () {
      // 先校验，再发送ajax请求
      // 拿到form表单组件，调用组件的校验方法
      // 参数1：是否校验成功boolean值
      // 参数2：是一个对象，包含了错误的校验字段（没用，会自动显示错误信息）

      this.$refs.form.validate((isValid, obj) => {
        // isValid 是否通过校验 obj 未通过校验的信息
        console.log(isValid, obj)
        if (!isValid) return
        // 通过校验该发ajax请求了
        console.log('发ajax')
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          // console.log(res)
          // res.data是服务端返回的数据
          const { meta, data } = res.data
          if (meta.status === 200) {
            // console.log(res.data.meta.msg)
            // 一登录成功，就存储token令牌到本地
            localStorage.setItem('token', data.token)
            // 1.默认的普通提示
            // this.$message(meta.msg)
            // 2.配置一个对象
            this.$message({
              type: 'success',
              message: meta.msg,
              duration: 1000
            })
            this.$router.push('/index')
            // 路由 name 的使用:  路由路径有时比较长, 其实可以起名字来跳转
            // this.$router.push({ name: 'index' })
          } else {
            // 3.直接调方法的同时，指定提示的类型
            this.$message.error('失败了')
          }
        })
        // axios.post(url,data).then(..).catch(..)
        // this.$axios.post('login', this.form).then(res => {
        //   const { meta, data } = res
        //   console.log(meta, data)
        // })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
    padding: 20px;
    padding-top: 70px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    .logoImg {
      width: 130px;
      height: 130px;
      border: 5px solid #fff;
      border-radius: 50%;
      position: absolute;
      top: -65px;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
    }
    .loginBtn {
      margin-right: 80px;
    }
  }
}
</style>
