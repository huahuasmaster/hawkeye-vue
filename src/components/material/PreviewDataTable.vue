<template>
    <v-data-table
            key="1"
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
            <td v-for="(val, key, i) in item">{{val}}</td>

        </template>
    </v-data-table>
</template>
<script>
    import {Datasource} from "../../url";

    export default {
        props: ['datasourceId'],
        watch: {
            datasourceId(to, from) {
                this.getData();
            }
        },
        data() {
            return {
                headers: [],
                items: []
            }
        },
        methods: {
            getData() {
                Datasource.previewData(this.datasourceId)
                    .then(resp => {
                        let items = JSON.parse(resp);
                        if (!items || !items.length || items.length <= 0) {
                            return;
                        }
                        // console.log(Object.keys(items[0]));
                        let titles = Object.keys(items[0]);
                        this.headers = titles.map(title => {
                            return {
                                text: title,
                                value: title,
                                align: 'left'
                            }
                        });
                        items.splice(0,1);
                        this.items = items;
                        // console.log(items);
                        // this.headers
                    });
            }
        }
    }

</script>