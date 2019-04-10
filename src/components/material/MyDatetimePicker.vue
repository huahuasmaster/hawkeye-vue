<template>
    <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="wholeDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                    ref="text"
                    v-model="wholeDate"
                    :label="label"
                    prepend-icon="mdi-event"
                    v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" dark v-if="!showTime">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="confirm()">OK</v-btn>
        </v-date-picker>
        <v-time-picker v-model="time" dark v-if="showTime">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="confirm()">OK</v-btn>
        </v-time-picker>
    </v-menu>
</template>
<script>

    let moment = require('moment');
    export default {
        props: ['label', 'defaultDate'],
        computed: {},
        watch: {
            // defaultDate: (to, from) => {
            //     this.trans();
            // }
        },
        data() {
            return {
                //展示时钟
                showTime: false,
                menu: false,
                wholeDate: '',
                date: '',
                time: ''
            }
        },
        methods: {
            confirm() {
                // 处在第一步，则进入下一步
                if (!this.showTime) {
                    this.showTime = true;
                    return;
                }
                // 处在第二步，计算数据，发送给父组件
                this.wholeDate = this.date + ' ' + this.time + ':00';
                this.$refs.menu.save(this.date + ' ' + this.time);
                // console.log(this.wholeDate);
                // console.log(new Date(this.wholeDate).valueOf());
                this.$emit('pick_datetime', new Date(this.wholeDate).valueOf());
                this.menu = false;
                this.showTime = false;
            },
            trans() {
                this.wholeDate = moment(this.defaultDate).format('YYYY-MM-DD HH:mm');
                // console.log(this.wholeDate);
                // console.log(this.$refs.text);
                this.date = moment(this.defaultDate).format('YYYY-MM-DD');
                this.time = moment(this.defaultDate).format('HH:mm');
            }
        },
        mounted() {
            // console.log(new Date(this.defaultDate).toISOString());
            this.trans();
        }
    }

</script>