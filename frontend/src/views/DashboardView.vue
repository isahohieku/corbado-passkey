<template>
  <v-container class="position-fixed w-100 pa-0" style="height: 3000px" fluid>
    <div class="d-flex position-relative">
      <v-card
        class="transit radius-none sidebar mobile-panel"
        :class="{ 'is-collapsed': isCollapsed }"
      >
        <v-navigation-drawer permanent color="primary">
          <v-list class="back-button">
            <v-list-item class="primary">
              <v-list-item-content>
                <v-btn small icon color="primary" @click="togglemenu()"
                  ><v-icon color="white">mdi-chevron-left</v-icon></v-btn
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list-item class="primary" to="/admin/dashboard">
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                <div class="mx-auto" :class="{ favicon: !isCollapsed }">
                  <v-img src="/img/logo.png" alt="Mart logo" />
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="navItem in navItems"
              :key="navItem.route"
              :to="navItem.route"
              active-class="primary"
              exact
            >
              <v-list-item-icon>
                <v-icon color="white">{{ navItem.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="text-caption white--text">{{
                  navItem.label
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
      <div class="position-relative flex-grow">
        <app-bar @toggle="togglemenu" />
        <v-sheet
          id="scrolling-techniques-7"
          class="mt-16 pt-8 pb-16 min-height"
        >
          <router-view />
        </v-sheet>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import AppBar from "@/components/AppBar.vue";

type NavItem = {
  label: string;
  route: string;
  icon: string;
};

export default Vue.component("Admin", {
  components: { AppBar },
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    navItems(): NavItem[] {
      return [
        {
          label: "Users",
          route: "/dashboard/users",
          icon: "mdi-account-group",
        },
      ];
    },
  },
  methods: {
    togglemenu(): void {
      this.isCollapsed = !this.isCollapsed;
    },
  },
});
</script>
<style lang="scss" scoped>
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  top: 0;
}

.position-fixed {
  position: fixed;
  top: 0;
}

.flex-grow {
  flex-grow: 1;
}

.transit {
  transition: all ease-in-out 0.3s;
}

.transittion {
  transition: all ease-in-out;
}

.delay {
  transition-delay: 0.3s;
}

.min-height {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.favicon {
  width: 50px;
  padding: 30px 0px;
}

.radius-none {
  border-radius: 0;
}

.sidebar {
  width: 250px;
  height: 100vh;
}

.is-collapsed {
  width: 60px;
}

.back-button {
  display: none;
}

@media (max-width: 1020px) {
  .mobile-panel {
    left: -70px;
    position: absolute;
    z-index: 2;
    height: 100vh;
    width: 60px;
  }

  .is-collapsed {
    left: 0px;
  }

  .back-button {
    display: block;
  }
}
</style>
