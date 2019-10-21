<template>
    <div class="nofound">
        <p>404</p>
        <p>哎呀! 找不到页面了!</p>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        // bodyBgImage: require('../../assets/images/login_bg.jpg')
      }
    },
    // mounted () {
    //   document.querySelector('body').setAttribute('style',
    //     'background: url('+this.bodyBgImage+') no-repeat;background-size: 100% 100%;'
    //   )
    // },
    // beforeDestroy() {
    //   document.querySelector('body').removeAttribute('style')
    // },
  }
</script>
<style scoped>
    .nofound{
        font-size: 40px;
        text-align: center;
        padding: 50px;
    }
</style>

