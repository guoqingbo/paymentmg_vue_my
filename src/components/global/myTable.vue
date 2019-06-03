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
            <render  v-if="sitem.render" :params="detailData" :render="sitem.render"></render>
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
        detailData:{}
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
      params:{
        type: Object,
      }
    },
    // watch: {
    //   tableRows: {
    //     handler(newValue, oldValue) {
    //       newValue.forEach((element,index) => {
    //         // 如果是详情
    //         // if(this.routeType=='detail'){
    //         //   element.disabled = true
    //         //   element.type = 'text'
    //         // }
    //         // this.formItem[element.name] = element.value
    //
    //         if(typeof element.value == 'undefined'){
    //           // 作用是监听输入框value的变化，使表单验证起作用
    //           this.$set(element, 'value','')
    //         }
    //         if(element.name){
    //           // this.formItem[element.name] = element.value
    //           this.$set(this.formItem, element.name, element.value)
    //         }
    //       })
    //     },
    //     deep: true,
    //     immediate: true
    //   }
    // },
    created(){
      this.getDetail()
    },
    methods:{
      // 获取表格中的数据
      getDetail(){
        if(this.url){
          this.apiGet(this.url,this.params).then(res=>{
            if(res.status == 200){
              this.detailData = res.data
              this.$emit('onGetAfter',res.data)
              this.tableRows.forEach(item=>{
                item.cols.forEach(sitem=>{
                  this.$set(sitem,'value',res.data[sitem.name])
                  // console.log(res.data)
                  // console.log(sitem.name)
                  // sitem.value = res.data[sitem.name]
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
