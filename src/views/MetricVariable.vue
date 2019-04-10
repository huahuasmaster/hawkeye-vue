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
    </div>
</template>
<script>
    export default {
        data() {
            return {
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
                    {
                        sortable: false,
                        text: '描述',
                        value: 'desc',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '数据源',
                        value: 'datasourceName',
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
            }
        }
    }
</script>