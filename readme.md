## universal website

### Introduction

Dựa trên sso-admin, sso-passport, landing-page

Sử dụng Vue 3 (Composition API), Vue Router, Pinia, Vite, Express, MongoDB

Clone:

[Siêu thị Kingfoodmart](https://kingfoodmart.com/)

#### Features

- Admin
  - Authentication
  - Change password
  - Category
  - Product
  - Order
  - Dashboard
- Shopping
  - Home
  - Product
  - Cart
  - Checkout
  - No login

#### Tech stack

Node.js, VSCode, Ubuntu

Vue 3, Vue Router, Pinia, Vite, (TypeScript), ESLint

Ant Design Vue (Element Plus)

Express (AdonisJS) MPA (Shopping backend)

Express (AdonisJS) API (Admin backend)

MPA (Shopping), SPA (Admin)

Bootstrap 5.2 (include bootstrap-extended)

MongoDB (MariaDB), Redis

Nginx

Highcharts

### Auto import package, Vue component

https://github.com/antfu/unplugin-auto-import

without:

```javascript
import { computed, ref } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

with:

```javascript
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

Cài đặt:

```bash
npm install -D unplugin-auto-import
```

Cấu hình vite.config.ts:

```javascript
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({ /* options */ }),
  ],
})
```

https://github.com/antfu/unplugin-vue-components

Cài đặt:

```bash
npm install unplugin-vue-components -D
```

Cấu hình vite.config.ts:

```javascript
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

Ví dụ:

```javascript
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
} from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        AntDesignVueResolver(),
        ElementPlusResolver(),
      ],
    }),
  ],
})
```



It will automatically turn this:

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

into this:

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  name: 'App',

  components: {
    HelloWorld
  },
}
</script>
```

```
import { ElButton } from 'element-plus'

//    ↓ ↓ ↓ ↓ ↓ ↓

import { ElButton } from 'element-plus'
import 'element-plus/es/components/button/style/css'
```

### Ant Design Vue

Element Plus hỗ trợ Vue 3 trước Ant Design. Giờ Ant Design cũng hỗ trợ Vue 3. Ant Design thông dụng hơn Element Plus (thông dụng, nổi tiếng hơn không có nghĩa là tốt hơn). Ant Design bình thường là React, Ant Design Vue cho Vue.

https://element-plus.org/

https://github.com/element-plus/element-plus

https://www.antdv.com/

https://github.com/vueComponent/ant-design-vue

Cả EP và ADV đều sử dụng async-validator, dayjs.

#### On-demand Import

Auto import (Recommend)

You need to use an additional plugin to import components you used.

First you need to install unplugin-vue-components and unplugin-auto-import.

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

Then add the code below into your Vite config file (vite.config.ts).

```javascript
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```







#### Plan, steps

GitHub branch each step

Step 1: Get started

Create new project, setup linter, formatter

Step 2: SPA

Dummy pages (Home, Product, Cart, Checkout)

Step 3: SCSS, Bootstrap

Step 4: Axios, Fake Store API, Pinia

Step 5: Setup MariaDB database, seed by AdonisJS command

Setup database with data of fake API

Step 6: Admin frontend (SPA)

Step 7: Authentication

Redis token

AdonisJS Middleware

Vue Router Middleware

Step 8: Change password

Step 9: UI component library

Element Plus

Step 10: Admin CRUD

User

Product

Upload image

Step 10: AdonisJS Edge template

Step 11: Deploy

Deploy PM2, Nginx

Step 12: Checkout

Step 13: Order

status

Step 10: Validate (Vue, AdonisJS)

Step 14: Dashboard

Step 15: Security checklist

### Get started

#### Prerequisites

Node.js

Ubuntu (Linux)

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin). ESLint extension too.

JS, CSS, HTML knowledge

Git, GitHub

#### Create new project

$ npm create vite@latest

$ npm create vite@latest shopping --template vue

$ npm init vue@latest



```
$ cd shopping-cart/

$ npm create vite@latest
npx: installed 6 in 2.449s
✔ Project name: … shopping
✔ Select a framework: › vue
✔ Select a variant: › vue-ts

Scaffolding project in ~/shopping-cart/shopping...

Done. Now run:

  cd shopping
  npm install
  npm run dev

$ npm create vite@latest shopping --template vue
npx: installed 6 in 1.982s

Scaffolding project in ~/shopping-cart/shopping...

Done. Now run:

  cd shopping
  npm install
  npm run dev



$ npm init vue@latest
npx: installed 1 in 0.891s

Vue.js - The Progressive JavaScript Framework

✔ Project name: … shopping
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in ~/shopping-cart/shopping...

Done. Now run:

  cd shopping
  npm install
  npm run dev
```



package.json:

```json
{
  "name": "shopping",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview --port 5050",
    "typecheck": "vue-tsc --noEmit",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "pinia": "^2.0.13",
    "vue": "^3.2.33",
    "vue-router": "^4.0.14"
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.1.0",
    "@types/node": "^16.11.27",
    "@vitejs/plugin-vue": "^2.3.1",
    "@vue/eslint-config-typescript": "^10.0.0",
    "@vue/tsconfig": "^0.1.3",
    "eslint": "^8.5.0",
    "eslint-plugin-vue": "^8.2.0",
    "typescript": "~4.6.3",
    "vite": "^2.9.5",
    "vue-tsc": "^0.34.7"
  }
}
```



We have: Vue, Vue Router, Pinia, Vite, TypeScript support, ESLint.

Project Setup

npm install

Compile and Hot-Reload for Development

npm run dev

Type-Check, Compile and Minify for Production

npm run build

Lint with ESLint

npm run lint

```
npm run dev
```





http://localhost:3000/







#### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.



#### ESLint

Semi

Colon

Format, Lint on Save Vue, JS, JSON, TS, HTML

.vscode/settings.json

```
{
  "editor.formatOnSave": true,
  "[json]": {
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[typescript]": {
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[css]": {
    "editor.formatOnSave": true
  },
  "[html]": {
    "editor.formatOnSave": false
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "files.insertFinalNewline": true,
  "editor.detectIndentation": false,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true
}
```

Add some custom rules to .eslintrc.cjs

```
rules: {
  'semi': ['error', 'never'],
  'indent': ['error', 2],
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    },
  ],
  'operator-linebreak': ['error', 'before'],
  'comma-dangle': ['error', 'always-multiline'],
  'quotes': ['error', 'single'],
  'quote-props': ['error', 'consistent-as-needed'],
},
```

#### GitHub

Create new GitHub repository

```
$ git clone git@github.com:lockex1987/simple-ecommerce.git
Cloning into 'simple-ecommerce'...
warning: You appear to have cloned an empty repository.

$ cd simple-ecommerce/

# Add README.md file

$ git add .
huyennv9@VTCC-huyennv9:~/projects/simple-ecommerce$ git commit -m "First commit"
[master (root-commit) 83ca4a1] First commit
 1 file changed, 364 insertions(+)
 create mode 100644 README.md

~/projects/simple-ecommerce$ git push
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Delta compression using up to 12 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 2.62 KiB | 2.62 MiB/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To github.com:lockex1987/simple-ecommerce.git
 * [new branch]      master -> master

~/projects/simple-ecommerce$ git status
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
~/projects/simple-ecommerce$ git branch
* master


```



Create new branch

git branch step_1_get_started

git checkout step_1_get_started

Thêm file

git push -u origin step_1_get_started

Lệnh trên thực hiện một lần, những lần sau chỉ cần git push bình thường



git checkout master

git merge step_1_get_started

git push

### SPA

git branch step_2_spa

git checkout step_2_spa

git push -u origin step_2_spa

Add, edit files

git add .

git commit

git push

git checkout master

git merge step_2_spa

git push



Vue Router

Delete old file

This feature is already available in the previous step.

We will create 4 dummy pages: Home, Product, Cart, Checkout



main.ts

```typescript
import router from './router/index'

app.use(router)
```

router/index.ts

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
```

App.vue

```vue
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
```

Files

```
views
  HomeView.vue
  ProductView.vue
  CartView.vue
  CheckoutView.vue
```



### Vite, Bootstrap, SCSS

To suport `<style lang="scss"></style>`,  install preprocessor dependency "sass"

npm install sass --save-dev

npm install bootstrap

App.vue, or main.ts



```vue
<style lang="scss">
/* import '@/assets/base.css'; */
.nav {
  a {
    color: red;
  }
}
</style>
```



Output result inline in `head` tag:

```html
<style type="text/css">/* import '@/assets/base.css'; */
.nav a {
  color: red;
}</style>
```

No, first HTML code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script type="module" src="/@vite/client"></script>

  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simple eCommerce</title>
</head>

<body>
  <div id="app"></div>

  <script type="module" src="/src/main.ts?t=1653179127772"></script>
</body>
</html>
```

CSS is processed by JS.

scss/style.scss





### Axios, Fake API, Pinia

#### Axios

npm instal axios

#### Fake Store API

[Fake Store API](https://fakestoreapi.com/docs)



#### Pinia Store

stores/cart.ts

stores/products.ts

$subscribe



#### Format, Business

Skeleton

Home.vue: Product list

Product.vue: Product detail

Cart.vue: Chosen product list

Search.vue: Search product

Category?

IsInCart (Check quantity in cart)

Global mixin

### Setup database, seed

Setup MariaDB database, seed by AdonisJS command

Setup database with data of fake API

```sql
create database ecommerce character set=utf8mb4 collate=utf8mb4_vietnamese_ci;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `password` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_vietnamese_ci;

CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) NOT NULL,
  `price` float,
  `description` varchar(2000) NOT NULL,
  `image` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`)
);
```

Create AdonisJS admin backend

```
$ mkdir admin
lockex1987@cttd:~/projects/simple-ecommerce$ cd admin/
lockex1987@cttd:~/projects/simple-ecommerce/admin$ npm init adonis-ts-app@latest backend
Need to install the following packages:
  create-adonis-ts-app@latest
Ok to proceed? (y) y

     _       _             _         _ ____  
    / \   __| | ___  _ __ (_)___    | / ___| 
   / _ \ / _` |/ _ \| '_ \| / __|_  | \___ \ 
  / ___ \ (_| | (_) | | | | \__ \ |_| |___) |
 /_/   \_\__,_|\___/|_| |_|_|___/\___/|____/ 
                                             


CUSTOMIZE PROJECT
❯ Select the project structure · api
❯ Enter the project name · backend
❯ Setup eslint? (y/N) · true
❯ Setup prettier? (y/N) · false

RUNNING TASKS
❯ Scaffold project 47 ms
❯ Install dependencies 36 s
❯ Configure installed packages 19 s

[ success ]  Project created successfully

╭─────────────────────────────────────────────────╮
│    Run following commands to get started        │
│─────────────────────────────────────────────────│
│                                                 │
│    ❯ cd backend                                 │
│    ❯ node ace serve --watch                     │
│                                                 │
╰─────────────────────────────────────────────────╯

$ node ace serve --watch
[ info ]  building project...
[ info ]  starting http server...
[1653213755763] INFO (backend/61066 on cttd): started server on 0.0.0.0:3333
[ info ]  watching file system for changes
╭─────────────────────────────────────────────────╮
│                                                 │
│    Server address: http://127.0.0.1:3333        │
│    Watching filesystem for changes: YES         │
│                                                 │
╰─────────────────────────────────────────────────╯

```

AdonisJS Lucid, MariaDB, Greet ACE command

Database seeder: user, product

### Admin frontend (SPA)

Clone from shopping/frontend

Login

Change password

Product

Order

Dashboard

Nav

loginUser mixin (mapState)



### Authentication

Fake Vue login, no backend

AdonisJS Redis

AdonisJS Controller, CORS, Vue call API, cookie, sso

Check user_name, password

Redis token

AdonisJS Middleware

Vue Router Middleware

TODO: Rate Limit

### Change password

Event type

```
Event
  UIEvent
    InputEvent
    KeyboardEvent
    MouseEvent
```

Third party libraries (TypeScript):

- noti
- CV
- Pagi

Libraries written by me.

### UI component library

[Element Plus](https://element-plus.org/en-US/)

Use third-party libraries for more support, documentation. Limit use home-made libraries.

### Admin CRUD

Adonis pagination

Element Plus pagination

Add CSS, JS libraries by npm. No CDN, static files.

Debounce function TypeScript

User

Product

Upload image

### Facebook Messenger

```javascript
var chatbox = document.getElementById('fb-customer-chat');
    chatbox.setAttribute("page_id", "2307562982605619");
    chatbox.setAttribute("attribution", "biz_inbox");

    window.fbAsyncInit = function() {
      FB.init({
        xfbml            : true,
        version          : 'v12.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
```











