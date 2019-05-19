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
                    key="1"
                    :headers="headers"
                    :items="mysqlItems"
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
                    <td>{{ JSON.stringify(item.sourceInfo) }}</td>
                    <td>{{ item.queryGranularity }}</td>

                    <td>
                        <v-switch v-model="item.enable" @change="changeEnabled(item)"></v-switch>
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
                    key="2"
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
                    <td>{{ JSON.stringify(item.sourceInfo) }}</td>
                    <td>{{ item.queryGranularity }}</td>

                    <td>
                        <v-switch v-model="item.enable" @change="changeEnabled(item)"></v-switch>
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
                <DatasourceForm v-on:add_over="afterAddOver"></DatasourceForm>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import DatasourceForm from '../components/form/DatasourceForm'
    import {Datasource} from "../url";

    export default {
        components: {DatasourceForm},
        computed: {
            mysqlItems() {
                return this.items.filter(item => item.type === 'MYSQL')
            },
            buryItems() {
                return this.items.filter(item => item.type === 'BURY')
            },
        },
        data() {
            return {

                items: [],

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
            changeEnabled(item) {
                Datasource.updateEnable(item.id, item.enable)
                    .then(resp => {
                        this.$store.dispatch('alert', {type: "success", content: "修改成功"})
                    })
                    .catch(error => {
                        this.$store.dispatch('alert', {type: "error", content: "修改失败"})
                    })
            },
            newDatasource(type) {
                this.showForm = true;
            },
            getItems() {
                Datasource.list()
                    .then(resp => {
                        this.items = resp;
                    });
            },
            afterAddOver() {
                this.showForm = false;
                this.getItems();
            }
        },
        mounted() {
            this.getItems();
        }
    }
</script>