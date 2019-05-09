<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  font-size: 0;
  line-height: 0;
}
.clearfix {
  display: inline-block;
}
.clearfix {
  display: block;
}
.ivu-input{
    border-radius: 0!important;
}
.ivu-btn{
    border-radius: 0!important;
}
.ivu-select-selection {
     border-radius: 0!important;
}

.ivu-table td, .ivu-table th{
border-bottom:0 !important;

}
.ivu-table th{
    height:50px !important;
background-color: #EBEEF9 !important;
}
.ivu-table td{
    /* background-color: #F5F7FA !important; */
}

.ivu-table-wrapper{
    border:none !important;
    position:static;
}
tr.ivu-table-row:hover{
 /* box-shadow: 0 0 5px #1f2022; */
}
.ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover  {
    /* box-shadow: 0 0 10px #E6EAF7 !important; */
}
 .ivu-table .ivu-table-default .ivu-table-header tr{
background-color: #EBEEF9 !important;
}
.ivu-page-item-jump-next, .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev,.ivu-page-options-elevator input,.ivu-page-item,.ivu-modal-content {
    border-radius: 0 !important;
}
.ivu-table .ivu-table-body tr.ivu-table-row{
    background-color: #F5F7FA !important;
}
.ivu-table .ivu-table-body tr.ivu-table-row:nth-child(2n-1) {
    background-color: #fff !important;
  }
/* .ivu-form-item-error-tip{
    color:#303133;
    background:#FFEFE6;
    border:1px solid #FFB08F;
    z-index:99;
    top:-70%;
} */
.ivu-table-stripe .ivu-table-body tr:nth-child(2n) td{
    background-color: #F5F7FA !important;
}
.ivu-modal-header p, .ivu-modal-header-inner{
    text-align: center;
}
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu{
    color:#fff !important;
}

</style>
