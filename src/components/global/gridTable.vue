<template>
  <div class="grids"  :style="{'padding-bottom':padding}">
    <Table style="position:static;" stripe  :columns="columns" :data="res.rows" :url="url"  @on-selection-change="changeSelection"></Table>
    <Page v-if="params.limit!=-1" :total="res.total" class-name="pages" @on-change="changepage" @on-page-size-change='changesize' show-elevator show-sizer></Page>
  </div>
</template>
<script>
export default {
  data () {
    return {
        loading:false,
      padding:'30px',
      data: '',
      // params: Object.assign({page: 1, limit: 10, sort: 'createTime', order: 'desc'},this.$route.params),
      selection: []
    }
  },
  props: ['columns', 'url' ,'params'],
  created(){
 var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("firefox") > 0) {
      this.padding = "50px";
    }
  },
  mounted () {
    this.$store.state.list.url = this.url
    this.$store.state.list.params = this.params
    this.loadpage()
  },
  computed: {
    res () {
      return  this.$store.state.list.res.data?this.$store.state.list.res.data: this.$store.state.list.res      
    },
  },
  methods: {
    changepage (num) {
      this.$store.state.list.params.page = num
      this.loadpage()
    },
    changesize (num) {
      this.$store.state.list.params.limit = num
      this.loadpage()
    },
    changeSelection (selection) {
      this.selection = selection
    },
    columnsHandle (h, actions) {
      let array = []
      actions.forEach(element => {
        let obj = h('Button', {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              element.action()
            }
          },
        }, element.title)
        array.push(obj)
      })
      return array
    },
    async loadpage () {
        this.loading=true
      let res = await this.$store.dispatch('postApi')
      if(res.status!=200){
          this.$Message.warning(res.message)
      }
      this.loading=false
    }
  }
}
</script>

<style>

</style>


