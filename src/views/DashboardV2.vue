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
                                      v-on:pick_datetime="time => globalInterval.endTime = time"></MyDatetimePicker>
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
    </div>
</template>

<script>
    import VChartBaseCard from '../components/material/VChartBaseCard'
    import VChartsTheme from '../plugins/v-charts-theme'
    import MyDatetimePicker from '../components/material/MyDatetimePicker'
    import moment from 'moment'

    export default {
        components: {VChartBaseCard, MyDatetimePicker},
        data() {
            return {
                globalInterval: {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60 * 5,
                    endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                },
                dailySalesChart: {
                    data: {
                        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                        series: [
                            [12, 17, 7, 17, 23, 18, 38]
                        ]
                    },
                    options: {
                        lineSmooth: this.$chartist.Interpolation.cardinal({
                            tension: 0
                        }),
                        low: 0,
                        high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                        chartPadding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    }
                },
                dataCompletedTasksChart: {
                    data: {
                        labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
                        series: [
                            [230, 750, 450, 300, 280, 240, 200, 190]
                        ]
                    },
                    options: {
                        lineSmooth: this.$chartist.Interpolation.cardinal({
                            tension: 0
                        }),
                        low: 0,
                        high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                        chartPadding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }
                    }
                },
                emailsSubscriptionChart: {
                    data: {
                        labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
                        series: [
                            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

                        ]
                    },
                    options: {
                        axisX: {
                            showGrid: false
                        },
                        low: 0,
                        high: 1000,
                        chartPadding: {
                            top: 0,
                            right: 5,
                            bottom: 0,
                            left: 0
                        }
                    },
                    responsiveOptions: [
                        ['screen and (max-width: 640px)', {
                            seriesBarDistance: 5,
                            axisX: {
                                labelInterpolationFnc: function (value) {
                                    return value[0]
                                }
                            }
                        }]
                    ]
                },
                headers: [
                    {
                        sortable: false,
                        text: 'ID',
                        value: 'id'
                    },
                    {
                        sortable: false,
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        sortable: false,
                        text: 'Salary',
                        value: 'salary',
                        align: 'right'
                    },
                    {
                        sortable: false,
                        text: 'Country',
                        value: 'country',
                        align: 'right'
                    },
                    {
                        sortable: false,
                        text: 'City',
                        value: 'city',
                        align: 'right'
                    }
                ],
                items: [
                    {
                        name: 'Dakota Rice',
                        country: 'Niger',
                        city: 'Oud-Tunrhout',
                        salary: '$35,738'
                    },
                    {
                        name: 'Minerva Hooper',
                        country: 'Curaçao',
                        city: 'Sinaai-Waas',
                        salary: '$23,738'
                    }, {
                        name: 'Sage Rodriguez',
                        country: 'Netherlands',
                        city: 'Overland Park',
                        salary: '$56,142'
                    }, {
                        name: 'Philip Chanley',
                        country: 'Korea, South',
                        city: 'Gloucester',
                        salary: '$38,735'
                    }, {
                        name: 'Doris Greene',
                        country: 'Malawi',
                        city: 'Feldkirchen in Kārnten',
                        salary: '$63,542'
                    }
                ],
                tabs: 0,
                list: {
                    0: false,
                    1: false,
                    2: false
                },
                chartDetails: [{
                    id:1,
                    type: 'line',
                    period: '15分钟',
                    name: "电子书城下单量",
                    desc: "每日下单量，下单不等于支付"
                },{
                    id:2,
                    type: 'stats',
                    period: 'all',
                    name: "电子书城订单总金额",
                    desc: "每日下单总额（人民币），下单不等于支付",
                    extra: {
                        prefix: '',
                        suffix: '元',
                    }
                }],

                theme: JSON.parse(VChartsTheme.themeJSON),
                themeName: VChartsTheme.themeName,
            }
        },
        methods: {
            complete(index) {
                this.list[index] = !this.list[index]
            }
        }
    }
</script>
