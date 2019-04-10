<template>
        <v-expansion-panel>
            <v-expansion-panel-content
                    v-for="item in items"
                    :key="item.id"
            >
                <template slot="header">
                    <span>{{item.queryName}}<span style="font-style: italic">({{item | getDataType}})</span> ：{{item.desc}}</span>
                    <span style="float:right;margin-right:20px;"></span>
                </template>
                <v-list two-line>
                    <v-list-tile
                            @click=""
                    >
                        <v-list-tile-content>
                            <v-list-tile-title >来源</v-list-tile-title>
                            <v-list-tile-sub-title >{{item | getSource}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider
                    ></v-divider>

                    <v-list-tile one-line
                            @click=""
                    >
                        <v-list-tile-content>
                            <v-list-tile-title >状态</v-list-tile-title>
                        </v-list-tile-content>
                        <v-spacer></v-spacer>
                        <v-switch  style="max-width:40px" v-model="item.enable" @change="changeState(item)"></v-switch>
                    </v-list-tile>

                    <v-divider
                    ></v-divider>

                    <v-list-tile
                            @click=""
                    >
                        <v-list-tile-content>
                            <v-list-tile-title >创建时间</v-list-tile-title>
                            <v-list-tile-sub-title >{{item | getDate}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-expansion-panel-content>
        </v-expansion-panel>
</template>
<script>
    let moment = require('moment');
    export default {
        filters: {
            getDataType: (item) => item.distinct ? 'DISTINCT' : item.dataType.toUpperCase(),
            getSource: (item) => item.fileName ? `使用了原始字段 - ${item.fileName}` : '自定义脚本产生',
            getDate: (item) => new Date(item.createDate).toDateString(),
        },
        data() {
            return {

                items: [
                    {
                        id: 1,
                        desc : "desc",
                        queryName: 'das',
                        distinct: true,
                        fileName: 'da',
                        dataType: 'STRING',
                        variableType: 'dimension',
                        enable: true,
                        createDate: 1554886036000,
                    },
                ]
            }
        },
        methods: {

            changeState(item) {
                console.log(item);
            }
        }
    }
</script>