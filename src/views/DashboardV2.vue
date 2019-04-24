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
                    {{dashboardVO.name}}
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
                    <v-select
                            dark
                            style="padding-left: 24px"
                        v-model="autoRefresh"
                        :items="refreshTimeOptions"
                        item-text="t"
                        item-value="v"
                        label="自动刷新时间"
                    >

                    </v-select>
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
            <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
                       v-if="dashboardVO.chartList.find(c => c.id === parseInt(item.i))"
                       :ref="`grid-${item.i}`"
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
                <ChartForm v-on:chart_submit="afterAddChart" :dashboardId="this.dashboardId"></ChartForm>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import VChartBaseCard from '../components/material/VChartBaseCard'
    import MyDatetimePicker from '../components/material/MyDatetimePicker'
    import moment from 'moment'
    import {Dashboard} from "../url";
    import ChartForm from "../components/form/ChartForm";
    import VueGridLayout from 'vue-grid-layout';


    export default {
        components: {VChartBaseCard, MyDatetimePicker, ChartForm, VueGridLayout},
        watch: {
            autoRefresh: function (val, oldVal) {
                console.log('自动更新时间变更：new: %s, old: %s', val, oldVal);
                if (val) {
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    this.timer = setInterval(() => {
                        console.log('开始执行定时更新任务');
                        this.layout.forEach(item => {
                            this.$refs[`chart-${item.i}`][0].autoRefresh(val);
                        });
                    }, val);
                }
            },
        },
        data() {
            return {
                showForm: false,
                globalInterval: {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60,
                    endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                },
                hasDefinedEndTime: false,
                dashboardVO: {},
                autoRefresh: 0,
                timer: null,

                layout: [],

                dashboardId: 1,
                heights: [],
                refreshTimeOptions: [
                    {
                        t: "每1分钟", v:1000*60
                    },
                    {
                        t: "每5分钟", v:1000*60*5
                    },
                    {
                        t: "每10分钟", v:1000*60*10
                    },
                ]
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
                this.globalInterval.endTime = time;
                this.hasDefinedEndTime = true;
            },
            refresh() {
                this.hasDefinedEndTime = false;
                this.globalInterval = {
                    startTime: moment().startOf('hour').valueOf() - 1000 * 60 * 60,
                    endTime: moment().startOf('hour').valueOf() + 1000 * 60 * 60,
                };
                this.$store.dispatch('alert', {content: '刷新数据中，请稍后'})
            },

            deleteChart(id) {
                console.log('想要删除图表' + id);
            },
            resizeEvent: function (i, newH, newW, newHPx, newWPx) {
                console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx);
                let ref = this.$refs[`chart-${i}`];
                // console.log(ref[0]);
                ref[0].viewReSize(newHPx, newWPx);
            },
            layoutUpdatedEvent(newLayout) {
                // console.log(JSON.stringify(newLayout));
                let layout = JSON.parse(JSON.stringify(newLayout));
                Dashboard.updateLayout(this.dashboardId, layout)
                    .then(resp => console.log("看板配置更新成功")
                    );
            },
            afterAddChart(chartId) {
                this.showForm = false;
                console.log('图表添加完成id = ' + chartId);
                let chart = this.layout.find(item => parseInt(item.i) === chartId);
                if (chart) {
                    // console.log('修改图表完成', chartId);
                    // this.getDashboardInfo();
                    // this.showForm = false;
                    // this.getDashboardInfo();
                    // this.$refs[chartId][0].refresh();
                } else {
                    let maxY = 0, newLayout = [];
                    if (this.layout.length > 0) {
                        maxY = this.layout.reduce((item1, item2) => item1.y > item2.y ? item1 : item2).y;
                    }
                    Object.assign(newLayout, this.layout);
                    newLayout.push({
                        'x': 0,
                        'y': maxY + 6,
                        'w': 4,
                        'h': 6,
                        'i': chartId.toString(),
                    });
                    // this.dashboardInfo.config = {
                    //     layout: newLayout,
                    // };
                    Dashboard.updateLayout(this.dashboardId, newLayout)
                        .then(resp => {
                            console.log("看板配置更新成功");
                            this.getChartDetails();
                            this.refresh();
                        })
                    // Dashboard.update(this.dashboardInfo).then(resp => {
                    //     console.log('添加图表完成', chartId);
                    //     Dashboard.get(this.boardId).then((resp) => {
                    //         this.dashboardInfo = resp.data;
                    //         this.refresh();
                    //         this.showForm = false;
                    //     });
                    // });
                }
            },

        },
        mounted() {
            this.dashboardId = this.$route.params.id;
            console.log(`当前看板的id为${this.dashboardId}`);
            this.getChartDetails();
        },
        beforeDestroy() {
            if (this.timer) {
                console.log('关闭定时更新任务');
                clearInterval(this.timer);
            }
        },
    }
</script>
<style>

</style>
