<template>
  <v-app-bar
    app
    absolute
    elevation="2"
    color="white"
    scroll-target="#scrolling-techniques-7"
  >
    <v-btn icon text @click="toggleMenu()"> <v-icon>mdi-menu</v-icon></v-btn>
    <v-spacer></v-spacer>
    <template>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon text v-bind="attrs" v-on="on">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item @click="logOut">
                <v-list-item-icon class="mr-4">
                  <v-icon>mdi-exit-to-app</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>
<script lang="ts">
import Vue from "vue";
import { PROJECT_ID } from "@/constants";
import Corbado from "@corbado/webcomponent";
import { User } from "@/types/users";

type NavItem = {
  label: string;
  route: string;
  icon?: string;
};

export default Vue.component("AppBar", {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoggedIn: false,
      drawer: false,
      group: null,
      width: document.documentElement.clientWidth,
      session: new Corbado.Session(PROJECT_ID),
      currentUser: null as User | null,
    };
  },
  computed: {
    adminNavItems(): NavItem[] {
      return [
        {
          label: "Users",
          route: "/dashboard/users",
          icon: "mdi-account-multiple",
        },
      ];
    },
  },
  watch: {
    currentUser() {
      if (!this.currentUser) {
        this.$router.push({ name: "Home" });
      }
    },
  },
  mounted(): void {
    this.session.refresh((user: User) => {
      this.currentUser = user;
    });
  },
  methods: {
    async logOut(): Promise<void> {
      this.session.logout();
    },
    toggleMenu(): void {
      this.$emit("toggle");
    },
  },
});
</script>
