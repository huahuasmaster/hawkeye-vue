<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="image"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            鹰眼
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="purple"
          />
        </v-list-tile>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
        <!--<v-list-tile-->
          <!--disabled-->
          <!--active-class="primary"-->
          <!--class="v-list-item v-list__tile&#45;&#45;buy"-->
          <!--to="/upgrade"-->
        <!--&gt;-->
          <!--<v-list-tile-action>-->
            <!--<v-icon>mdi-package-up</v-icon>-->
          <!--</v-list-tile-action>-->
          <!--<v-list-tile-title class="font-weight-light">-->
            <!--Upgrade To PRO-->
          <!--</v-list-tile-title>-->
        <!--</v-list-tile>-->
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    logo: './img/vuetifylogo.png',
    // 计划侧栏子项：看板，数据源配置，指标变量配置，链路追踪（图表配置）
    links: [
      // {
      //   to: '/dashboard',
      //   icon: 'mdi-view-dashboard',
      //   text: '看板'
      // },
      {
        to: '/dashboardv2',
        icon: 'mdi-view-dashboard',
        text: '看板'
      },
      {
        to: '/datasource',
        icon: 'mdi-dns',
        text: '数据源'
      },
      // {
      //   to: '/metricvariable',
      //   icon: 'mdi-alphabetical',
      //   text: '指标变量'
      // },
      // {
      //   to: '/user-profile',
      //   icon: 'mdi-account',
      //   text: 'User Profile'
      // },
      // {
      //   to: '/table-list',
      //   icon: 'mdi-clipboard-outline',
      //   text: 'Table List'
      // },
      // {
      //   to: '/typography',
      //   icon: 'mdi-format-font',
      //   text: 'Typography'
      // },
      // {
      //   to: '/icons',
      //   icon: 'mdi-chart-bubble',
      //   text: 'Icons'
      // },
      // {
      //   to: '/maps',
      //   icon: 'mdi-map-marker',
      //   text: 'Maps'
      // },
      // {
      //   to: '/notifications',
      //   icon: 'mdi-bell',
      //   text: 'Notifications'
      // }
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
