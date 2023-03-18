# Roboto fontface

A simple package providing the [Roboto](http://www.google.com/fonts/specimen/Roboto) fontface. The font was created by [Christian Robertson](https://plus.google.com/110879635926653430880/about).

## Installing

Assuming you have [NodeJS](http://nodejs.org/), [NPM](https://www.npmjs.com/) and [Bower](http://bower.io/) installed globally just open up a terminal, navigate to your projects root directory and then execute

```
# install via NPM
$ npm install roboto-fontface --save

# install via Bower
$ bower install roboto-fontface --save
```


## Usage

There're several files in the `css/` subdirectory. Import them in your project
to have access to "Roboto" font face:

* `css/roboto/roboto-fontface.css` - whole font family compiled to CSS
* `css/roboto/sass/roboto-fontface.scss` - whole font family in SCSS
* `css/roboto/less/roboto-fontface.less` - whole font family in LESS

* `css/roboto-condensed/roboto-condensed-fontface.css` - whole font family compiled to CSS
* `css/roboto-condensed/sass/roboto-condensed-fontface.scss` - whole font family in SCSS
* `css/roboto-condensed/less/roboto-condensed-fontface.less` - whole font family in LESS

* `css/roboto-slab/roboto-slab-fontface.css` - whole font family compiled to CSS
* `css/roboto-slab/sass/roboto-slab-fontface.scss` - whole font family in SCSS
* `css/roboto-slab/less/roboto-slab-fontface.less` - whole font family in LESS

Importing whole family may be unnecessary and lead to huge build, so if you are
using SCSS or LESS, you can import only individual weights by importing for example:

* `css/roboto/sass/roboto-fontface-black.scss`
* `css/roboto/sass/roboto-fontface-black-italic.scss`

## Hinting

Some of the included font files have [hinting](http://en.wikipedia.org/wiki/Font_hinting).

| Files    | Hinting |
|----------|---------|
| `.woff`  | yes     |
| `.woff2` | ?       |
