<template>
  <div>
    <img class="pay-icon-img" src="../../../assets/images/error.png">
    <p class="pay-text">支付失败</p>
    <p class="pay-message">{{message}}</p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        message:this.$route.query.message
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style scoped>
  .pay-icon-img{
    margin-top: 40%;
  }
  .pay-text{
    margin-top: 10px;
    font-size: 18px;
  }
  .pay-message{
    font-size: 16px;
  }
</style>
