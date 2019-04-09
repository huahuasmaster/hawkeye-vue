<template>
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
                                v-text="'MYSQL数据源'"
                        />
                        <p
                                class="category font-weight-thin"
                                v-text="'需要数据库开启binlog'"
                        />
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex>
                        <v-btn color="success" style="float: right;">新增</v-btn>
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
                      v-text="header.text"
              />
            </template>
            <template
                    slot="items"
                    slot-scope="{ index, item }"
            >
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td class="text-xs-right">{{ item.salary }}</td>
                <td class="text-xs-right">{{ item.country }}</td>
                <td class="text-xs-right">{{ item.city }}</td>
                <td class="justify-center layout px-0">
                    <v-icon
                            class="mr-2"
                            color="success"

                            @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                            color="error"
                            @click="deleteItem(item)"
                    >
                        mdi-close
                    </v-icon>
                </td>
            </template>
        </v-data-table>
    </material-card>
</template>
<script>
export default {
    data() {
        return {
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
                },
                { text: 'Actions', value: 'name', sortable: false,align:'center' }
            ],
        }
    }
}
</script>