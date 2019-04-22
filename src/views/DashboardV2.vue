<template>
    <div>
        <v-toolbar
                id="core-toolbar"
                app
                color="bg-warning"
                prominent
        >
            <div class="v-toolbar-title">
                <v-toolbar-title
                        class="tertiary--text font-weight-light"
                >
                    Duangduang下单看板
                </v-toolbar-title>
            </div>

            <v-spacer/>
            <v-toolbar-items>
                <v-flex
                        align-center
                        layout
                        py-2
                >
                    <span style="color:white" class="font-weight-light">开始：</span>
                    <MyDatetimePicker :default-date="globalInterval.startTime"
                                      v-on:pick_datetime="time => globalInterval.startTime = time"
                                      style="margin-right: 16px"></MyDatetimePicker>
                    <span style="color:white" class="font-weight-light">结束：</span>
                    <MyDatetimePicker :default-date="globalInterval.endTime"
                                      v-on:pick_datetime="time => injectEndTime(time)"></MyDatetimePicker>
                    <v-btn flat color="success" @click="refresh">刷新</v-btn>
                    <v-btn flat color="success" @click="showForm = true">新增</v-btn>
                </v-flex>
            </v-toolbar-items>
        </v-toolbar>
        <!--<v-container-->
                <!--fill-height-->
                <!--fluid-->
                <!--grid-list-xl-->
        <!--&gt;-->
            <!--<v-layout wrap>-->
                <!--<v-flex-->
                        <!--md12-->
                        <!--sm12-->
                        <!--lg4-->
                        <!--v-for="item in chartDetails"-->
                <!--&gt;-->
                    <!--<VChartBaseCard-->

                            <!--color="white"-->
                            <!--:chart-detail="item"-->
                            <!--:query-interval="globalInterval"-->
                    <!--&gt;-->
                    <!--</VChartBaseCard>-->
                <!--</v-flex>-->
            <!--</v-layout>-->
        <!--</v-container>-->
        <grid-layout :layout.sync="layout" :col-num="12" :row-height="75" :is-draggable="true" :is-resizable="true"
                     :is-mirrored="false"
                     :vertical-compact="true" :margin="[15, 15]" :use-css-transforms="false"
                     @layout-updated="layoutUpdatedEvent">
            <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :ref="`grid-${item.i}`"
                       :max-h="dashboardVO.chartList.find(c => c.id === parseInt(item.i)).type === 'stats' ? 2 : 10"
                       drag-ignore-from=".mycontent" @resized="resizeEvent" :minH="1">
                <VChartBaseCard :ref="`chart-${item.i}`" @delete-chart="deleteChart"
                           :chartDetail="dashboardVO.chartList.find(c => c.id === parseInt(item.i))"
                           :queryInterval="globalInterval" color="white"/>
            </grid-item>
        </grid-layout>
        <v-dialog v-model="showForm" width="1000">
            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    新建图表
                </v-card-title>
                <ChartForm v-on:chart_submit="afterAddOver"></ChartForm>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import VChartBaseCard from '../components/material/VChartBaseCard'
    import VChartsTheme from '../plugins/v-charts-theme'
    import MyDatetimePicker from '../components/material/MyDatetimePicker'
    import moment from 'moment'
    import {Dashboard} from "../url";
    import ChartForm from "../components/form/ChartForm";
    import VueGridLayout from 'vue-grid-layout';


    export default {
        components: {VChartBaseCard, MyDatetimePicker, ChartForm, VueGridLayout},
        data() {
            return {
                showForm: false,
                globalInterval: {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60 *2,
                    endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                },
                dashboardVO: {},

                // chartDetails: [{
                //     id:1,
                //     type: 'line',
                //     period: '15分钟',
                //     name: "电子书城下单量",
                //     desc: "每日下单量，下单不等于支付",
                //     aggregations:[{metric:"count",metricAggregationType:"COUNT",alias:"下单量"}],
                //     dimensions:[],
                //     postAggregations:[]
                // },
                //     {
                //     id:2,
                //     type: 'stats',
                //     period: 'all',
                //     name: "电子书城订单总金额",
                //     desc: "每日下单总额（人民币），下单不等于支付",
                //     config: {
                //         prefix: '',
                //         suffix: '元',
                //     }
                // }
                // ],

                layout: [],

                theme: JSON.parse(VChartsTheme.themeJSON),
                themeName: VChartsTheme.themeName,
                dashboardId: 1,
                heights:[],
            }
        },
        methods: {
            getChartDetails() {
                // Dashboard.listChartsByDashboardId(1)
                //     .then((resp) => {
                //         console.log('获取到图表配置');
                //         this.chartDetails = resp;
                //         console.log(this.chartDetails);
                //     });
                Dashboard.get(this.dashboardId)
                    .then((resp) => {
                        console.log('获取到看板信息');
                        this.dashboardVO = resp;
                        this.layout = this.dashboardVO.config.layout;
                        // setTimeout(() => {
                        //     this.afterGridReady([]);
                        // }, 2000);
                    })
            },
            injectEndTime(time) {
                if (time <= this.globalInterval.startTime) {
                    return;
                }
                this.globalInterval.endTime = time
            },
            refresh() {
                this.globalInterval = {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60 *2,
                        endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                };
                this.$store.dispatch('alert',{content:'刷新数据中，请稍后'})
            },
            afterAddOver() {
                this.showForm = false;
                this.getChartDetails();
            },
            deleteChart(id) {
                console.log('想要删除图表'+id);
            },
            resizeEvent: function(i, newH, newW, newHPx, newWPx) {
                console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx);
                let ref = this.$refs[`chart-${i}`];
                console.log(ref[0]);
                ref[0].viewReSize(newHPx, newWPx);
            },
            layoutUpdatedEvent(newLayout) {
                console.log(JSON.stringify(newLayout));
            },
            afterGridReady(newLayout) {
                // console.log('开始获取grid高度');


                // this.dashboardVO.chartList
                //     .forEach(chart => {
                //         let height = this.$refs[`grid-${chart.i}`];
                //         console.log(`id = ${chart.id}`);
                //         console.log(height);
                //     });

                // this.$refs[`chart-${i}`]
            }

        },
        mounted() {
            this.dashboardId = this.$route.params.id;
            console.log(`当前看板的id为${this.dashboardId}`);
            this.getChartDetails();

        }
    }
</script>
<style>

</style>
