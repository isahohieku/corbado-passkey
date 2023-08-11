import Vue from "vue";
import Router, { RawLocation, Route, RouteConfig } from "vue-router";
import Home from "@/views/HomeView.vue";
import { dashboard } from "./dashboard";

Vue.use(Router);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  dashboard,
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const originalPush = Router.prototype.push;

Router.prototype.push = function push(path: RawLocation) {
  return originalPush
    .call<Router, [RawLocation], Promise<Route>>(this, path)
    .catch((err) => {
      if (
        err.name !== "NavigationDuplicated" &&
        !err.message.includes(
          "Avoided redundant navigation to current location"
        )
      ) {
        return err;
      }
    });
};

export default router;
