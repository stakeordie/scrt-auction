<template>
    <div class="site-clock">
        {{ theFormatedTime }}
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            theTime: new Date()
        }
    },
    computed: {
        theFormatedTime: function() {
            return moment(this.theTime).format("HH:mm:ss");
        }
    },
    methods: {
        updateEndTime() {
            this.theTime = new Date((new Date()).getTime());
        }
    },
    mounted() {
        this.updateEndTime();
        this.interval = setInterval(this.updateEndTime, 1000);
    },
    destroyed() {
        clearInterval(this.interval);
    }
}
</script>

<style>
    .site-clock {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        /* margin: 4px 12px 4px 0; */
        max-width: 100px;
        width: 100px;
        height: 30px;
        color: #EDC92B;  
        font-weight: bold;
        font-size: 18px;      
        overflow: hidden;
    }
</style>