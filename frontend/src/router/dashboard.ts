import { RouteConfig } from "vue-router";
import Dashboard from "@/views/DashboardView.vue";
import Users from "@/views/UsersView.vue";
// import { guard } from "@/utils/route-guards/super-admin";

export const dashboard: RouteConfig = {
  path: "/dashboard",
  component: Dashboard,
  children: [
    {
      path: "",
      name: "Dashboard",
      redirect: "users",
    },
    {
      path: "users",
      name: "Users",
      component: Users,
      //   beforeEnter: guard,
    },
  ],
};
