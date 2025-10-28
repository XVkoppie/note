import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Documentation',
      component: () => import('../views/Documentation.vue'),
      children: [
        {
          path: ':filename',
          name: 'Document',
          component: () => import('../views/Documentation.vue'),
          props: (route) => ({ initialFile: route.params.filename }),
        },
      ],
    },
  ],
})

export default router
