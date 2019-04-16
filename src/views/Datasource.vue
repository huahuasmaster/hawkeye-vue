<template>
    <div>
        <material-card
                color="green"
        >
            <template slot="header">
                <v-container
                        fill-height
                        fluid
                        grid-list-xl
                        style="padding: 0px"
                >
                    <v-layout wrap>
                        <v-flex>
                            <h4
                                    class="title font-weight-light mb-2"
                                    v-text="'MYSQL数据源'"></h4>
                            <p
                                    class="category font-weight-thin"
                                    v-text="'需要数据库开启binlog'"></p>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex>
                            <v-btn color="success" style="float: right;" @click="newDatasource">新增</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>

            </template>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    hide-actions
            >
                <template
                        slot="headerCell"
                        slot-scope="{ header }"
                >
              <span
                      class="font-weight-light text-warning text--darken-3"
                      v-text="header.text"></span>
                </template>
                <template
                        slot="items"
                        slot-scope="{ index, item }"
                >
                    <td>{{ item.id}}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ JSON.stringify(item.config) }}</td>
                    <td>{{ item.queryGranularity }}</td>

                    <td>
                        <v-switch v-model="item.enable"></v-switch>
                    </td>
                    <td class="justify-center layout px-0">
                        <v-icon color="success"
                                class="mr-2"

                                @click="checkVariables(item)"
                        >
                            mdi-alphabetical
                        </v-icon>
                        <v-icon
                                class="mr-2"
                                color="success"

                                @click="editMysql(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                color="error"
                                @click="deleteMysql(item)"
                        >
                            mdi-close
                        </v-icon>
                    </td>
                </template>
            </v-data-table>
        </material-card>
        <material-card
                color="green"
        >
            <template slot="header">
                <v-container
                        fill-height
                        fluid
                        grid-list-xl
                        style="padding: 0px"
                >
                    <v-layout wrap>
                        <v-flex>
                            <h4
                                    class="title font-weight-light mb-2"
                                    v-text="'埋点数据源'"></h4>
                            <p
                                    class="category font-weight-thin"
                                    v-text="'监听前端的埋点消息'"></p>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex>
                            <v-btn color="success" style="float: right;" @click="newDatasource">新增</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>

            </template>
            <v-data-table
                    :headers="buryHeaders"
                    :items="buryItems"
                    hide-actions
            >
                <template
                        slot="headerCell"
                        slot-scope="{ header }"
                >
              <span
                      class="font-weight-light text-warning text--darken-3"
                      v-text="header.text"></span>
                </template>
                <template
                        slot="items"
                        slot-scope="{ index, item }"
                >
                    <td>{{ item.id}}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.desc }}</td>
                    <td>{{ JSON.stringify(item.config) }}</td>
                    <td>{{ item.queryGranularity }}</td>

                    <td>
                        <v-switch v-model="item.enable"></v-switch>
                    </td>
                    <td class="justify-center layout px-0">
                        <v-icon
                                class="mr-2"
                                color="success"

                                @click="editMysql(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                color="error"
                                @click="deleteMysql(item)"
                        >
                            mdi-close
                        </v-icon>
                    </td>
                </template>
            </v-data-table>
        </material-card>
        <v-dialog v-model="showForm" width="500">
            <v-card>
                <DatasourceForm></DatasourceForm>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import DatasourceForm from '../components/form/DatasourceForm'
    export default {
        components: {DatasourceForm},
        data() {
            return {
                items: [
                    {
                        id: 1,
                        name: 'duangduang.t_order',
                        config: {
                            database: 'duangduang',
                            table: 't_order',
                        },
                        queryGranularity: '1天',
                        enable: true,
                    },
                    {
                        id: 1,
                        name: 'duangduang.t_order',
                        config: {
                            database: 'duangduang',
                            table: 't_order',
                        },
                        queryGranularity: '1小时',

                        enable: true,
                    }, {
                        id: 1,
                        name: 'duangduang.t_order',
                        config: {
                            database: 'duangduang',
                            table: 't_order',
                        },
                        queryGranularity: '1分钟',

                        enable: false,
                    }, {
                        id: 1,
                        name: 'duangduang.t_order',
                        config: {
                            database: 'duangduang',
                            table: 't_order',
                        },
                        queryGranularity: '1秒',

                        enable: true,
                    },
                ],
                buryItems: [
                    {
                        id: 6,
                        name: 'duangduang.login',
                        config: {
                            event: 'login',
                        },
                        desc: 'duangduang登录事件',
                        queryGranularity: '1小时',
                        enable: false,
                    },
                    {
                        id: 7,
                        name: 'duangduang.place_order',
                        config: {
                            event: 'place_order',
                        },
                        queryGranularity: '1天',

                        desc: 'duangduang下单事件',
                        enable: true,
                    }, {
                        id: 8,
                        name: 'duangduang.pay_order',
                        config: {
                            event: 'pay_order',
                        },
                        queryGranularity: '1分钟',

                        desc: 'duangduang支付订单',
                        enable: true,
                    },
                ],
                headers: [
                    {
                        sortable: false,
                        text: 'ID',
                        value: 'id',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '名称',
                        value: 'name',
                        align: 'left'

                    },
                    // {
                    //     sortable: false,
                    //     text: '描述',
                    //     value: 'desc',
                    //     align: 'right'
                    // },
                    {
                        sortable: false,
                        text: '配置信息',
                        value: 'config',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '预聚合粒度',
                        value: 'queryGranularity',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '状态',
                        value: 'enable',
                        align: 'left'
                    },

                    {text: 'Actions', value: 'name', sortable: false, align: 'center'}
                ],
                buryHeaders: [
                    {
                        sortable: false,
                        text: 'ID',
                        value: 'id',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '名称',
                        value: 'name',
                        align: 'left'

                    },
                    {
                        sortable: false,
                        text: '描述',
                        value: 'desc',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '配置信息',
                        value: 'config',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '预聚合粒度',
                        value: 'queryGranularity',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '状态',
                        value: 'enable',
                        align: 'left'
                    },
                    {text: 'Actions', value: 'name', sortable: false, align: 'center'}
                ],
                showForm: false,
            }
        },
        methods: {
            editMysql(item) {
                console.log("想要编辑：");
                console.log(item);
            },
            deleteMysql(item) {
                console.log("想要删除：");
                console.log(item);
            },
            checkVariables(item) {

            },
            newDatasource(type) {
                this.showForm = true;
            }
        }
    }
</script>