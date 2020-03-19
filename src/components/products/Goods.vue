<template>
  <div class="goods">

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" class="input-with-select" v-model="Pnp">
      <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
    </el-input>
    <el-button class="addBtn" plain type="success" @click="goAddGoods">添加商品</el-button>

    <!-- 商品列表 -->
     <el-table
      :data="goodsList"
      style="width: 100%">
      <el-table-column
      type="index"
      :index="indexMethod"></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
      prop="add_time"
      label="创建时间">
      <template v-slot:default="{row}">
        {{row.add_time|dateFilter}}
      </template>
      </el-table-column>
      <el-table-column
      label="操作">
      <template v-slot:default="{row}">
        <el-button size="small" plain type="primary" icon="el-icon-edit">修改</el-button>
        <el-button size="small" plain type="danger" icon="el-icon-delete">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
      <!-- 分页组件 -->
    <!--
      size-change 修改每页条数触发
      current-change 修改当前页触发
      current-page: 当前页
      page-size: 每页的条数
      total: 总条数
      page-sizes
     -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      :total="total"
      :page-sizes="[10, 15, 20, 25]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      Pnp: '',
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList () {
      const { data, meta } = await this.$axios.get('goods', {
        params: {
          Pnp: this.Pnp,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(meta, data)
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      }
    },
    // 查找商品
    searchGoods () {
      console.log(this.Pnp)
      this.pagenum = 1
      this.getGoodsList()
    },
    // 展示添加商品对话框
    goAddGoods () {
      this.$router.push('/goods-add')
    },
    // 分页当前页变化
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    // 分页页码变化
    handleSizeChange (val) {
      // 更新当前页
      this.pagesize = val
      // 重新发送请求
      this.getGoodsList()
    },
    indexMethod (index) {
      console.log(index)
      return (this.pagenum - 1) * this.pagesize + index + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.goods{
   .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin: 0 20px;
  }
}
</style>
