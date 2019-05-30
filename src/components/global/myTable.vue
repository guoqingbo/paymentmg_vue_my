<template>
  <div class="newtable">
    <table class="table"
           border
           width=100%>
      <tr v-for="(item,index) in tableRows" :key="index">
        <template v-for="(sitem,sindex) in item.cols" >
          <td class="title">{{sitem.title}}</td>
          <td  :colspan="sitem.colspan"
               :rowspan="sitem.rowspan">
            <render  v-if="sitem.render" :params="sitem" :render="sitem.render"></render>
            <template  v-else>
              {{sitem.value}}
            </template>
          </td>
        </template>
      </tr>
    </table>
    <div class="bottom-btn-box" v-if="btnShow">
      <Button @click='$router.back()' type="primary">返回</Button>
    </div>
  </div>
</template>
<script>
  import render from "@/components/global/render";
  export default {
    components: {render},
    data () {
      return {

      }
    },
    props: {
      btnShow: {
        type: Boolean,
        default: false
      },
      tableRows: {
        type: Array
      },
      url: {
        type: String,
        default: ''
      },
      parems:{
        type: Object,
        default: ''
      }
    },
    watch: {

    },
    created(){
      this.getDetail()
    },
    methods:{
      // 获取表格中的数据
      getDetail(){
        if(this.url){
          this.apiGet(this.url,this.parems).then(res=>{
            if(res.status == 200){
              this.tableRows.forEach(item=>{
                item.cols.forEach(sitem=>{
                  sitem.value = res.data[sitem.name]
                })
              })
            }
          })
        }
      }
    }
  }
</script>
<style scoped>
  .newtable .table{
    width:100%;
    border-collapse: collapse;
    border-spacing: 0 20px;
    border: 1px solid #e9eaec;
  }
  .newtable .table td {
    height: 40px;
    width: 11%;
    box-sizing: border-box;
    padding: 5px;
    text-align: center;
  }

  .newtable .table th {
    height: 40px;
    background-color: #EBEEF9;
  }

  .newtable .table td.title {
    background-color: #f8f8f9;
    width: 8%;
  }
  .bottom-btn-box {
    margin-top: 20px;
    text-align: center;
  }
</style>
