<template>

</template>

<script>
    export default {
        name: "fun",
      data(){
          return {
            addFunModal:false,
            channelList:[],
            funListColumns:[
              {
                type: 'selection',
                width: 60,
                align: 'center'
              },
              {
                title: '服务商',
                key: 'channelName'
              },
              {
                title: '支付产品',
                key: 'payProductName'
              },
              {
                title: '功能名称',
                key: 'channelProductName'
              },
              {
                title: '功能分类',
                key: 'type',
                render: (h, params) => {
                  return h('span', this.filter.turn("funType",params.row.type))
                }
              },
              {
                title: '功能代码',
                key: 'channelProductCode'
              }
            ],
            funListData:[],
            selection:[],
            funSearchParams:{
              type:'0',
              channelCode:''
            },
          }
      },
      methods:{
        // 选择功能分类
        chooseFunType(item){
          this.funSearchParams.type = item.value
          this.funListData = []
        },
      }
    }
</script>

<style scoped>

</style>
