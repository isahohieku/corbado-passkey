<template>
  <v-container style="max-width: 1400px">
    <v-card :elevation="0">
      <v-data-table
        class="pointer"
        :headers="headers"
        :items="loading ? [] : mapUsers(users) || []"
        :loading="loading"
        :options.sync="options"
        :server-items-length="count"
        item-key="id"
        data-cy="users-table"
        multi-sort
        :footer-props="{
          itemsPerPageOptions: [10, 25, 50],
        }"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="text-capitalize">Users</v-toolbar-title>
          </v-toolbar>

          <v-toolbar flat>
            <div class="d-flex align-center w-full">
              <v-icon small color="grey lighten-1">mdi-filter</v-icon>
              <p class="grey--text text-darken-1 mb-0">Filters</p>
              <v-select
                v-model="cities"
                :items="AllCities"
                item-value="value"
                item-text="title"
                label="City"
                solo
                dense
                multiple
                class="ml-3 max-w-200 text-caption"
              >
                <template v-slot:selection="{ item, index }">
                  <span v-if="index === 0">{{ item.title }}</span>
                  <span v-if="index === 1" class="text-grey text-caption">
                    (+{{ cities.length - 1 }})
                  </span>
                </template>
              </v-select>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    class="ml-3 font-weight-light mb-1 text-small"
                    color="white"
                    v-on="on"
                    >{{ periodType || "Birth Date" }}
                    <v-icon right class="_icon"> mdi-menu-down </v-icon></v-btn
                  >
                </template>
                <v-card class="d-flex mt-4">
                  <!-- Datepicker -->
                  <v-date-picker
                    v-model="dates"
                    :min="dates[0]"
                    no-title
                    range
                    class="mb-5"
                    color="primary"
                    @change="periodType = 'Custom'"
                  ></v-date-picker>
                </v-card>
              </v-menu>
              <v-btn
                text
                class="underline text-decoration-underline font-weight-light text-small"
                small
                color="grey"
                @click="resetFilters"
                >Reset</v-btn
              >
              <v-spacer> </v-spacer>
              <form @submit.prevent.stop="searchEntry">
                <div class="d-flex align-center">
                  <v-text-field
                    v-model="search"
                    class="w-300"
                    placeholder="Search"
                    clearable
                    data-cy="search"
                    color="grey"
                    @click:clear="resetSearch()"
                  >
                    <template v-slot:append-outer>
                      <template>
                        <v-btn
                          class="font-weight-light text-normal pl-0 pr-0 min-icon-width"
                          width="28"
                          height="28"
                          color="primary"
                          type="submit"
                          ><v-icon>mdi-magnify</v-icon></v-btn
                        >
                      </template>
                    </template>
                  </v-text-field>
                </div>
              </form>
            </div>
          </v-toolbar>
        </template>

        <template v-slot:[`item.image`]="{ item }">
          <v-avatar class="my-3" color="primary" size="40">
            <img :src="item.image" alt="John" />
          </v-avatar>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { DataOptions } from "vuetify/types";
import Vue from "vue";
import { fetchUsers } from "@/api";
import { User, UserAPI } from "@/types/users";
import endOfDay from "date-fns/endOfDay";
import { Dictionary } from "vue-router/types/router";
import isEqual from "lodash/isEqual";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

interface Header<T> {
  text: string;
  value: keyof T;
  width?: string;
  sortable?: boolean;
}

const formatDate = (
  date: string | undefined | null
): string | undefined | null => {
  if (!date) {
    return null;
  }
  return format(parseISO(new Date(date).toISOString()), "dd MMM, yyyy");
};

const formatJustDate = (date: string) => {
  return format(parseISO(new Date(date).toISOString()), "yyyy-MM-dd");
};

type OmittedUserProps = "birthDate" | "company" | "address";

type MappedUser = Omit<User, OmittedUserProps> & {
  birthDate: string | null;
  company: string;
  city: string;
};

export default Vue.component("Users", {
  data() {
    return {
      search: "",
      users: [] as UserAPI[],
      count: 0,
      loading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
      } as Partial<DataOptions>,
      AllCities: [
        { title: "Nashville", value: "nashville" },
        { title: "Manchester", value: "manchester" },
        { title: "Louisville", value: "louisville" },
        { title: "Fayetteville", value: "fayetteville" },
      ],
      cities: [] as string[],
      dates: [] as string[],
      menu: false,
      periodType: undefined as string | undefined,
      previousState: {} as Record<string, string>,
      selectedPredefinedDateRange: null as string | null,
      controller: new AbortController(),
    };
  },
  computed: {
    headers(): Header<MappedUser>[] {
      return [
        { text: "", value: "image", sortable: false },
        { text: "Full Name", value: "fullname", sortable: false },
        { text: "Email", value: "email" },
        {
          text: "Birth Date",
          value: "birthDate",
          width: "150px",
          sortable: false,
        },
        { text: "Age", value: "age", width: "80px" },
        { text: "City", value: "city", sortable: false },
        { text: "Company", value: "company", sortable: false },
      ];
    },
    getResultsAsLabel(): Record<string, string | undefined> {
      const cities = this.cities.length ? this.cities.join(",") : undefined;
      const periodType = this.periodType;
      const startDate = this.dates[0] || undefined;
      const endDate = this.dates[1] || undefined;

      const currentState = { cities, periodType, startDate, endDate };

      const isNewFilterSearch = !isEqual(this.previousState, currentState);

      const pageNumber = isNewFilterSearch
        ? "1"
        : this.options.page?.toString();
      const pageSize = isNewFilterSearch
        ? "10"
        : this.options.itemsPerPage?.toString();

      const sortBy = isNewFilterSearch
        ? undefined
        : this.options.sortBy?.length
        ? this.options.sortBy?.join(",")
        : undefined;
      const sortDesc = isNewFilterSearch
        ? undefined
        : this.options.sortDesc?.length
        ? this.options.sortDesc?.join(",")
        : undefined;

      return {
        cities,
        periodType,
        startDate,
        endDate,
        pageNumber,
        pageSize,
        sortBy,
        sortDesc,
      };
    },
  },
  watch: {
    $route: {
      handler(): void {
        this.doTheFetch(this.$route.query as Dictionary<string>);
      },
      immediate: true,
    },
    getResultsAsLabel(): void {
      const params = {
        query: {
          ...this.$route.query,
          ...this.getResultsAsLabel,
        },
      };
      this.$router.push(params);
    },
  },
  methods: {
    mapUsers(users: UserAPI[] | null): MappedUser[] | null {
      if (!users) {
        return null;
      }

      return users.map(
        ({
          firstName,
          lastName,
          company: { name },
          birthDate,
          address: { city },
          image,
          email,
          age,
        }) => {
          return {
            fullname: `${firstName} ${lastName}`,
            company: name,
            birthDate: formatDate(birthDate) as string,
            city,
            image,
            email,
            age,
          };
        }
      );
    },
    async fetchUsers(
      options: Record<string, string | undefined>
    ): Promise<void> {
      this.controller?.abort();
      const controller = new AbortController();
      const signal = controller.signal;
      this.controller = controller;

      try {
        this._fetchUsers(options, signal);
      } catch (e) {
        this.loading = false;
      }
    },
    async _fetchUsers(
      options: Record<string, string | undefined>,
      signal: AbortSignal
    ) {
      try {
        const {
          data: { users, count },
        } = await fetchUsers({ ...options }, signal);
        this.users = users;
        this.count = count;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    resetFilters(): void {
      const params = {
        query: {
          pageNumber: "1",
          pageSize: "10",
          search: undefined,
          sortBy: undefined,
          sortDesc: undefined,
        },
      };

      this.dates = [];

      this.$router.push(params);
    },
    resetSearch(): void {
      this.search = "";
      const params = {
        query: {
          ...this.$route.query,
          search: undefined,
          sortBy: undefined,
          sortDesc: undefined,
          pageNumber: "1",
          pageSize: "10",
        },
      };

      this.$router.push(params);
    },
    searchEntry(): void {
      const search = this.search.trim();
      if (!search) return;
      const params = {
        ...this.$route.query,
        ...this.getResultsAsLabel,
        search,
        pageNumber: "1",
      };
      if (params.search) {
        this.$router.push({ query: params });
      }
    },
    doTheFetch(query: Dictionary<string>): void {
      if (!Object.keys(query).length) {
        this.resetFilters();
        return;
      }

      const {
        pageNumber: page,
        pageSize: itemsPerPage,
        search,
        cities,
        startDate,
        endDate,
        periodType,
        sortBy,
        sortDesc,
      } = query;

      if (
        !isEqual(
          { page, itemsPerPage },
          { page: this.options.page, itemsPerPage: this.options.itemsPerPage }
        )
      ) {
        this.options.page = Number(page) || 1;
        this.options.itemsPerPage = Number(itemsPerPage) || 10;
        this.options.sortBy = sortBy ? sortBy.split(",") : [];
        this.options.sortDesc = sortDesc
          ? sortDesc.split(",").map((item) => (item === "false" ? false : true))
          : [];
      }

      search && (this.search = search as string);

      if (!page && !itemsPerPage) return;

      this.previousState = { cities, periodType, startDate, endDate }; // Save the current search cities

      const params = {
        ...this.getResultsAsLabel,
        ...query,
      };

      this.cities = cities ? (cities as string).split(",") : [];
      this.periodType = periodType ? (periodType as string) : undefined;

      if (startDate) this.dates[0] = formatJustDate(startDate as string);
      if (endDate) this.dates[1] = formatJustDate(endDate as string);

      delete params.periodType;

      this.loading = true;

      const isoFormatDates = {
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate
          ? endOfDay(new Date(endDate)).toISOString()
          : startDate
          ? endOfDay(new Date()).toISOString()
          : undefined,
      };

      this.fetchUsers({ ...params, ...isoFormatDates });
    },
  },
});
</script>
<style>
.v-toolbar__content {
  justify-content: space-between;
}

.max-w-200 {
  max-width: 200px !important;
}

.pointer tbody tr:hover {
  cursor: pointer;
}

.v-text-field__details {
  display: none;
}

._icon {
  font-size: 24px !important;
  color: rgba(0, 0, 0, 0.54) !important;
}

.text-normal {
  font-size: 16px !important;
}

.min-icon-width {
  min-width: unset !important;
}

.v-select__slot .v-label,
.text-small {
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
