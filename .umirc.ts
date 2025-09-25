import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    {path:"/home", component:"home"},
    {path:'/table', component:"student"},
    {path:'/courseGuide', component:"CourseGuid"},
    {
      path:'/studentManager',
      component:"StudentManager",
    }
  ],
  npmClient: 'npm',
});
