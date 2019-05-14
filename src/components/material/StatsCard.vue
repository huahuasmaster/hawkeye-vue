<template>
  <material-card
    v-bind="$attrs"
    class="v-card--material-stats"
    v-on="$listeners"
  >
    <v-card
      slot="offset"
      :class="`elevation-${elevation}`"
      :color="color"
      class="pa-4"
      dark
    >
      <v-icon
        size="40"
      >
        {{ icon }}
      </v-icon>
    </v-card>
    <div class="text-xs-right">
      <p
        class="category grey--text font-weight-light"
        v-text="title"
      />
      <h3
        class="title display-1 font-weight-light">
        {{ value }} <small>{{ smallValue }}</small>
      </h3>
    </div>

    <template slot="actions">
      <v-icon
        :color="subIconColor"
        size="20"
        class="mr-2"
      >
        {{ subIcon }}
      </v-icon>
      <span
        :class="subTextColor"
        class="caption font-weight-light"
        v-text="subText"
      />
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon
                  color="info"
                  v-on="on"
          >
            mdi-pencil
          </v-icon>
        </template>
        <v-list>
          <v-list-tile
                  key="edit"
                  @click="$emit('edit_it')"
          >
            <v-list-tile-title>编辑</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
                  key="delete"
                  @click="$emit('delete_it')"
          >
            <v-list-tile-title>删除</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>
  </material-card>
</template>

<script>
import Card from './Card'

export default {
  inheritAttrs: false,

  props: {
    ...Card.props,
    icon: {
      type: String,
      required: true
    },
    subIcon: {
      type: String,
      default: undefined
    },
    subIconColor: {
      type: String,
      default: undefined
    },
    subTextColor: {
      type: String,
      default: undefined
    },
    subText: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    smallValue: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss">
.v-card--material-stats {
  display: flex;
  flex-wrap: wrap;
  position: relative;

  .v-offset {
    display: inline-block;
    flex: 0 1;
    margin-top: 0;
    margin-left: 0;
    margin-right: auto;
    margin-bottom: 0 !important;
    max-width: auto;
    padding: 0 16px 0;
  }

  .v-card {
    border-radius: 4px;
    flex: 0 1 auto;
  }

  .v-card__text {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
  }

  .v-card__actions {
    flex: 1 0 100%;
  }
}
</style>
