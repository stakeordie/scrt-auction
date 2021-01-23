<template>
    <transition 
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut">
        <div class="overlay" v-show="show"></div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
    },
}
</script>

<style lang="scss">
    .overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5000;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
    }
</style>