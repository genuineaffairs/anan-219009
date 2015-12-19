module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular/*.js',
      'app/lib/jquery/*.js',
      'app/lib/*.js',
      'app/js/*.js',
      'app/js/helpers/*.js',
      'app/js/services/*.js',
      'test/lib/angular/angular-mocks.js',
      'test/unit/*.js'
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/angular-scenario.js',
      'app/js/loader.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
