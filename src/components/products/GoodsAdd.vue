<template>
  <div class="goods-add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤1" description="基本信息"></el-step>
      <el-step title="步骤2" description="商品图片"></el-step>
      <el-step title="步骤3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="基本信息" name="0">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :props="props" v-model="form.goods_cat" :options="options"></el-cascader>
          </el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!-- action=图片上传地址
        name="file"上传的文件字段名
        headers=配置请求头
        list-type 文件列表的类型 text/picture/picture-card
        注意:1.不走axios，action需要拼全路径
        2.token无效的问题,没走拦截器-->
        <el-upload
          multiple
          :headers="headers"
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeTab: '',
      form: {
        goods_name: '',
        goods_cat: [], // 商品分类，绑定级联
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []// 图片数组，存储着上传的图片对象
      },
      fileList: '', // 预览的图片的列表
      headers: {
        Authorization: localStorage.getItem('token')
      },
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      options: [],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
    this.getCatList()
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab)
      // 需要的是数字
      this.active = +tab.index
    },
    // 获取商品列表数据
    async getCatList () {
      const { meta, data } = await this.$axios.get('categories?type=3')
      console.log(meta, data)
      if (meta.status === 200) {
        this.options = data
      }
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    // 文件上传成功
    handleSuccess (response, file, fileList) {
      // console.log(response)
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
        this.fileList = fileList
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 处理删除
    handleRemove (file) {
      // 根据file的名字,从pics中将对应的pic删除
      console.log(file)
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      // 将fileList中的文件也删除, 通过下标存储
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(index, 1)
    },
    // 处理预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加商品
    async addGood () {
    // 发送请求
      const res = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      const { msg, status } = res.meta
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*
  1. 给当前组件中所有的元素 添加了一个自定义属性  data-v123  仅限于模板中的
  2. 给当期那组件中写的所有样式也添加 一个自定义属性选择器 .ql-editor[data-v123]

  >>> css 本身支持的
  /deep/   less 支持的
  ::v-deep  sass
*/
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>
