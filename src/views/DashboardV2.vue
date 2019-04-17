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
                                      v-on:pick_datetime="time => injectEndTime"></MyDatetimePicker>
                    <v-btn flat  color="success" @click="showForm = true">新增</v-btn>
                </v-flex>
            </v-toolbar-items>
        </v-toolbar>
        <v-container
                fill-height
                fluid
                grid-list-xl
        >
            <v-layout wrap>
                <v-flex
                        md12
                        sm12
                        lg6
                        v-for="item in chartDetails"
                >
                    <VChartBaseCard

                            color="white"
                            :chart-detail="item"
                            :query-interval="globalInterval"
                    >
                    </VChartBaseCard>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog v-model="showForm" width="1000">
            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    新建图表
                </v-card-title>
                <ChartForm v-on:chart_submit="showForm = false;getChartDetails"></ChartForm>
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

    export default {
        components: {VChartBaseCard, MyDatetimePicker, ChartForm},
        data() {
            return {
                showForm: false,
                globalInterval: {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60 * 5,
                    endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                },

                chartDetails: [{
                    id:1,
                    type: 'line',
                    period: '15分钟',
                    name: "电子书城下单量",
                    desc: "每日下单量，下单不等于支付",
                    aggregations:[{metric:"count",metricAggregationType:"COUNT",alias:"下单量"}],
                    dimensions:[],
                    postAggregations:[]
                },
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
                ],

                theme: JSON.parse(VChartsTheme.themeJSON),
                themeName: VChartsTheme.themeName,
            }
        },
        methods: {
            getChartDetails() {
                Dashboard.listChartsByDashboardId(1)
                    .then((resp) => {
                        console.log('获取到图表配置');
                        this.chartDetails = resp.map((chart) => {
                            // if(chart.config) {
                            //     chart.config = JSON.parse(chart.config);
                            // }
                            return chart;
                        });
                        console.log(this.chartDetails);
                    });
            },
            injectEndTime(time) {
                if (time <= this.globalInterval.startTime) {
                    return;
                }
                this.globalInterval.endTime = time
            }
        },
        mounted() {
            this.getChartDetails();
        }
    }
</script>
