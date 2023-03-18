# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [1.0.2](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.1...vite-plugin-vuetify@1.0.2) (2023-01-28)


### Bug Fixes

* add leading slash to absolute paths on windows ([3ecd8e2](https://github.com/vuetifyjs/vuetify-loader/commit/3ecd8e2d8034137ca47ad8325df960dfb0efc08e)), closes [#274](https://github.com/vuetifyjs/vuetify-loader/issues/274)



### [1.0.1](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0...vite-plugin-vuetify@1.0.1) (2022-12-11)


### Bug Fixes

* support vite 4 ([b7d6661](https://github.com/vuetifyjs/vuetify-loader/commit/b7d6661a8b6fe3b87c95a3c5e3961cc6cb2e661d)), closes [#279](https://github.com/vuetifyjs/vuetify-loader/issues/279)



## [1.0.0](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.17...vite-plugin-vuetify@1.0.0) (2022-10-13)


### Features

* add transformAssetUrls ([c2e525b](https://github.com/vuetifyjs/vuetify-loader/commit/c2e525b3a3ad5582ffc50216a94c47b94f1c8fc9)), closes [#237](https://github.com/vuetifyjs/vuetify-loader/issues/237)


### Bug Fixes

* ignore non-standard query parameters ([183f9dc](https://github.com/vuetifyjs/vuetify-loader/commit/183f9dcc4db15afe9f5f4c46624301696c097750)), closes [#271](https://github.com/vuetifyjs/vuetify-loader/issues/271)



## [1.0.0-alpha.17](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.16...vite-plugin-vuetify@1.0.0-alpha.17) (2022-09-12)


### Bug Fixes

* resolve stylesheets when using configFile with optimizeDeps.exclude ([79f51cf](https://github.com/vuetifyjs/vuetify-loader/commit/79f51cff6907fce85f83d252baf70b91238e4b9c)), closes [#268](https://github.com/vuetifyjs/vuetify-loader/issues/268)



## [1.0.0-alpha.16](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.15...vite-plugin-vuetify@1.0.0-alpha.16) (2022-09-06)


### Bug Fixes

* support vite 3.1 ([51f13de](https://github.com/vuetifyjs/vuetify-loader/commit/51f13de891f1cdc329b3014067f8dfa7e77d85a3)), closes [#267](https://github.com/vuetifyjs/vuetify-loader/issues/267)



## [1.0.0-alpha.15](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.14...vite-plugin-vuetify@1.0.0-alpha.15) (2022-08-31)


### Features

* add styles.configFile option ([9142e9d](https://github.com/vuetifyjs/vuetify-loader/commit/9142e9d644ba1e4f86486440c29a318704090636)), closes [#263](https://github.com/vuetifyjs/vuetify-loader/issues/263) [#245](https://github.com/vuetifyjs/vuetify-loader/issues/245) [#221](https://github.com/vuetifyjs/vuetify-loader/issues/221)
* support "[@use](https://github.com/use) 'vuetify'" ([e578193](https://github.com/vuetifyjs/vuetify-loader/commit/e578193a685dd581f6f15ff6e5e99f1a6eebbf1c))



## [1.0.0-alpha.14](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.13...vite-plugin-vuetify@1.0.0-alpha.14) (2022-07-25)


### Bug Fixes

* transform imports in script setup lang="ts" ([322f6ba](https://github.com/vuetifyjs/vuetify-loader/commit/322f6ba511c0da4ffbb90e49bd7d467d993b8ac6))



## [1.0.0-alpha.13](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.12...vite-plugin-vuetify@1.0.0-alpha.13) (2022-07-23)


### Bug Fixes

* add vue and upath to dependencies ([ac5af82](https://github.com/vuetifyjs/vuetify-loader/commit/ac5af823f1bfd8bc79dc3eb353eed64adef34421)), closes [#242](https://github.com/vuetifyjs/vuetify-loader/issues/242)
* allow vite 3 ([a64f0c1](https://github.com/vuetifyjs/vuetify-loader/commit/a64f0c15ba71dbd5a323091328be50f70133724a)), closes [#256](https://github.com/vuetifyjs/vuetify-loader/issues/256)
* cache importers invalidation on Windows ([#255](https://github.com/vuetifyjs/vuetify-loader/issues/255)) ([ab0c22d](https://github.com/vuetifyjs/vuetify-loader/commit/ab0c22d1fb5d560686b8533e825290a413178b7c))
* load virtual requests with `?v=` query string ([#252](https://github.com/vuetifyjs/vuetify-loader/issues/252)) ([21bca2f](https://github.com/vuetifyjs/vuetify-loader/commit/21bca2f3c658168c371e850a8b6b1acc9757a0cf))
* passthrough sourcemaps ([dfdc815](https://github.com/vuetifyjs/vuetify-loader/commit/dfdc815ad175df9ffd8be5c4847d8fe29e442f39)), closes [#233](https://github.com/vuetifyjs/vuetify-loader/issues/233)
* resolve vuetify relative to cwd ([9bf71d4](https://github.com/vuetifyjs/vuetify-loader/commit/9bf71d4fd8596cf8333e3041f4307a851c7aba6a)), closes [#248](https://github.com/vuetifyjs/vuetify-loader/issues/248)
* skip certain files in pendingModules, timeout per file ([1543182](https://github.com/vuetifyjs/vuetify-loader/commit/15431824d3c7ee0bf6314822476c57d1be0448ee)), closes [#249](https://github.com/vuetifyjs/vuetify-loader/issues/249)
* use default export ([c5e01f5](https://github.com/vuetifyjs/vuetify-loader/commit/c5e01f5b0b1f018800be9b4e1a0cd2501a6f2a57)), closes [#227](https://github.com/vuetifyjs/vuetify-loader/issues/227)



## [1.0.0-alpha.12](https://github.com/vuetifyjs/vuetify-loader/compare/vite-plugin-vuetify@1.0.0-alpha.11...vite-plugin-vuetify@1.0.0-alpha.12) (2022-06-16)


### Features

* support meta.load-css() ([29039f3](https://github.com/vuetifyjs/vuetify-loader/commit/29039f37eca66c8c46744fd87c6d181af9e9d64b))
* support vuetify beta.4 ([f1a0976](https://github.com/vuetifyjs/vuetify-loader/commit/f1a09765e568c7ee5481dd576765939ffc1fe534))



## 1.0.0-alpha.11 (2022-05-21)


### Features

* rename packages ([c64493d](https://github.com/vuetifyjs/vuetify-loader/commit/c64493d2d9d68338b23d302a3467c1058cd055f1)), closes [#236](https://github.com/vuetifyjs/vuetify-loader/issues/236)
* **styles:** add sass option ([ddd68d9](https://github.com/vuetifyjs/vuetify-loader/commit/ddd68d99aedaa0088c5d89740d1a9b9c1bb74808))


### Bug Fixes

* add plugin order warning ([1957398](https://github.com/vuetifyjs/vuetify-loader/commit/1957398cd199bfde3bf1debb4f3abd6e474b0389))



## [1.0.0-alpha.10](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.9...@vuetify/vite-plugin@1.0.0-alpha.10) (2021-12-10)


### Features

* add stylesTimeout option ([93e830d](https://github.com/vuetifyjs/vuetify-loader/commit/93e830dd728610bfa83c5a93f85fcca6acb4f59d))


### Bug Fixes

* disable esModuleInterop ([b3ae4d1](https://github.com/vuetifyjs/vuetify-loader/commit/b3ae4d17e4319ab1b8c550d50b0cc2737a8d0719)), closes [#222](https://github.com/vuetifyjs/vuetify-loader/issues/222)
* wait for all other modules to resolve before writing styles ([274ce9c](https://github.com/vuetifyjs/vuetify-loader/commit/274ce9ced8da65107b7544f9cdb2d82d463be313)), closes [#225](https://github.com/vuetifyjs/vuetify-loader/issues/225)



## [1.0.0-alpha.9](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.8...@vuetify/vite-plugin@1.0.0-alpha.9) (2021-11-17)

**Note:** Version bump only for package @vuetify/vite-plugin





## [1.0.0-alpha.8](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.7...@vuetify/vite-plugin@1.0.0-alpha.8) (2021-11-15)

**Note:** Version bump only for package @vuetify/vite-plugin





## [1.0.0-alpha.7](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.6...@vuetify/vite-plugin@1.0.0-alpha.7) (2021-11-11)


### Bug Fixes

* ignore non-url ids ([774f264](https://github.com/vuetifyjs/vuetify-loader/commit/774f264e22b8df6933fbcff1f51a4e4b50a1cb2d))



## [1.0.0-alpha.6](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.5...@vuetify/vite-plugin@1.0.0-alpha.6) (2021-11-11)


### Features

* support external templates ([8b7fc70](https://github.com/vuetifyjs/vuetify-loader/commit/8b7fc7082cf177e122d83b97ec0521092c044a77)), closes [#215](https://github.com/vuetifyjs/vuetify-loader/issues/215)


### Bug Fixes

* support node 12 ([9ddf99b](https://github.com/vuetifyjs/vuetify-loader/commit/9ddf99b3a3222d86cf9dc5b8a7561bc0131d6832)), closes [#212](https://github.com/vuetifyjs/vuetify-loader/issues/212)
* support production mode ([1cfaf2e](https://github.com/vuetifyjs/vuetify-loader/commit/1cfaf2efb64b8b65c54c1948a00bd81508db9a13)), closes [#213](https://github.com/vuetifyjs/vuetify-loader/issues/213)



## [1.0.0-alpha.5](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.4...@vuetify/vite-plugin@1.0.0-alpha.5) (2021-10-03)


### Bug Fixes

* normalise windows paths ([706913d](https://github.com/vuetifyjs/vuetify-loader/commit/706913da0a865643019db9b2ee627c0400d9cbaa)), closes [#205](https://github.com/vuetifyjs/vuetify-loader/issues/205)
* resolve absolute style imports ([199a5bf](https://github.com/vuetifyjs/vuetify-loader/commit/199a5bf6fd75dc5f1be21a88ca300bf403eac397)), closes [#206](https://github.com/vuetifyjs/vuetify-loader/issues/206)



## [1.0.0-alpha.4](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.3...@vuetify/vite-plugin@1.0.0-alpha.4) (2021-09-17)


### Bug Fixes

* use find-cache-dir, normalise dos paths ([990ee15](https://github.com/vuetifyjs/vuetify-loader/commit/990ee15ae49f331ff2d59b5cf00829ac32eb4ecd)), closes [#202](https://github.com/vuetifyjs/vuetify-loader/issues/202)



## [1.0.0-alpha.3](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.2...@vuetify/vite-plugin@1.0.0-alpha.3) (2021-09-11)


### Bug Fixes

* always use posix paths ([7393eef](https://github.com/vuetifyjs/vuetify-loader/commit/7393eefbb6a8a79de3b265c335ab5d238d4fe95e))
* support more import paths ([4253e7b](https://github.com/vuetifyjs/vuetify-loader/commit/4253e7b7224393adae8a5bccec650d70fb8a9cde))
* trigger HMR when adding new style imports ([ad1637b](https://github.com/vuetifyjs/vuetify-loader/commit/ad1637b516a6d873927098f973d339710092582b)), closes [#196](https://github.com/vuetifyjs/vuetify-loader/issues/196)
* update style import regexp ([a6b5e26](https://github.com/vuetifyjs/vuetify-loader/commit/a6b5e269225c4a0577b30f59b208629d30fc934f))



## [1.0.0-alpha.2](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.1...@vuetify/vite-plugin@1.0.0-alpha.2) (2021-08-31)

**Note:** Version bump only for package @vuetify/vite-plugin





## [1.0.0-alpha.1](https://github.com/vuetifyjs/vuetify-loader/compare/@vuetify/vite-plugin@1.0.0-alpha.0...@vuetify/vite-plugin@1.0.0-alpha.1) (2021-08-30)


### Features

* support HMR ([39baa9d](https://github.com/vuetifyjs/vuetify-loader/commit/39baa9dd70a52656af8f7508a1e095a468483d19))



# [1.0.0-alpha.0](https://github.com/vuetifyjs/vuetify-loader/compare/v1.7.3...v1.0.0-alpha.0) (2021-08-28)


### Features

* add vite plugin ([b75f1d4](https://github.com/vuetifyjs/vuetify-loader/commit/b75f1d495079ba317b6abc87615f6d662ddb11de))
