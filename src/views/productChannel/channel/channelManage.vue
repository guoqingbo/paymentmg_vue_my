<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :params="params"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :sucessMsg="sucessMsg"
             :mode="mode"></confirm>
  </div>
</template>
<script>
  import list from '@/components/global/list'
  import confirm from '@/components/global/confirm'
  export default {
    data () {
      return {
        columns: [
          {
            title: '序号',
            type:'index',
            width:70,
            align:'center'
          },
          {
            title: '渠道编码',
            key: 'channelCode',
            sortable: true,
          },
          {
            title: '渠道名称',
            key: 'channelName',
            sortable: true,
          },
          {
            title: '渠道性质',
            key: 'channelType',
            sortable: true,
            render: (h, params) => {
              // return h('span', this.turnChannelType(params.row.channelType))
            }
          },
          {
            title: '签约状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('span', this.filter.turn("signStatus",params.row.status))
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width:200,
            align:'center',
            render: (h, params) => {
              const actions = [
                {
                  title: "详情",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/channel/channelAddEditDetail/detail",
                      query: { id: params.row.id,routeType:"detail"},
                    });
                  }
                },
                {
                  title: "编辑",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/channel/channelAddEditDetail/edit",
                      query: { id: params.row.id },
                    });
                  }
                },
                {
                  title: "添加渠道产品",
                  action: () => {
                    this.$router.push({
                      path: "/productChannel/channel/channelProductAddEditDetail/add",
                      query: { channelId: params.row.id,channelName:params.row.channelName }
                    });
                  }
                }
              ];
              return this.common.columnsHandle(h, actions);
            }
          }
        ],
        params: {
          sort:'modifyTime',
          order:'desc'
        },
        url: '/channel/grid',
        searchItems:[],
        hannleItems: [
          {
            title: '新增渠道',
            icon: 'md-add',
            callback: () => {
              this.$router.push("/productChannel/channel/channelAddEditDetail/add");
            }
          }
        ],
        mode: "",
        content: "",
        sucessMsg: "",
      }
    },
    beforeCreate(){
      //获取渠道类型
      // if(!this.$store.state.global.channelType){
      //   this.$store.dispatch("getChannelType")
      // }
    },
    created(){
      // 设置渠道性质转化
      this.renderChannelType()
    },
    mounted () {

    },
    components: {list,confirm},
    methods: {
      renderChannelType(){
        //获取渠道类型
        // if(!this.$store.state.global.channelType){
        //   // 如果还没有渠道性质，则获取渠道性质
        //   this.$store.dispatch("getChannelType").then(res=>{
        //     this.setChannelType()
        //   })
        // }else{
        //   this.setChannelType()
        // }
        this.$store.dispatch("getChannelType").then(res=>{
          let channelType={}
          res.forEach(ele=>{
            channelType[ele.value] = ele.label
          })
          this.columns[3].render = (h, params) => {
            return h('span', channelType[params.row.channelType])
          }
        })
      }
    }
  }
</script>
