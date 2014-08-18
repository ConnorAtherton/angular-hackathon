/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

  build_dir: 'dist',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  files: {
    js: ['app/**/*.js', '!app/**/*.spec.js', '!app/assets/**/*.js'],
    jsunit: ['src/**/*.spec.js'],

    coffee: ['app/**/*.coffee', '!app/**/*.spec.coffee'],
    coffeeunit: ['app/**/*.spec.coffee'],

    atpl: ['app/src/**/*.tpl.jade', 'app/src/**/*.tpl.html', 'app/partials/**/*.tpl.jade', 'app/partials/**/*.tpl.html'],
    ctpl: ['app/common/**/*.tpl.jade', 'app/common/**/*.tpl.html'],

    html: ['app/*.html', 'app/*.jade'],
    sass: ['app/styles/**/*.scss']
  },

  /**
   * This is a collection of files used during testing only.
   */
  test: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-loading-bar/src/loading-bar.js',
      'vendor/angular-ui-utils/modules/route/route.js',
      'vendor/angular-socket-io/socket.min.js'
    ],
    css: [
      'vendor/bootstrap/dist/css/bootstrap.css',
      'vendor/angular-loading-bar/src/loading-bar.css'
    ],
    assets: []
  },
};
