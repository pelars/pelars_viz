require.config({
  shim: {
    TrackballControls: {
      deps: [
        'threejs'
      ],
      exports: 'THREE'
    },
    OrbitControls: {
      deps: [
        'threejs'
      ],
      exports: 'THREE'
    },
    FontUtils: {
      deps: [
        'threejs'
      ],
      exports: 'THREE'
    },
    TextGeometry: {
      deps: [
        'FontUtils'
      ],
      exports: 'THREE'
    },
    'font.Helvetica': {
      deps: [
        'TextGeometry'
      ],
      exports: '_typeface_js'
    }
  },
  paths: {
  	backbone: 'backbone/backbone',
    threejs: 'three.js/build/three.min',
    requirejs: 'requirejs/require',
    jquery: 'jquery/dist/jquery.min',
    //'grid.locale-en': 'bower_components/jqgrid/js/i18n/grid.locale-en',
    //'jquery.jqGrid': 'bower_components/jqgrid/js/jquery.jqGrid',
    TrackballControls: '/TrackballControls',
    FontUtils: 'FontUtils',
    TextGeometry: 'TextGeometry',
    OrbitControls: 'OrbitControls',
    'font.Helvetica': 'fonts/helvetiker_regular.typeface',
    'dat.gui': 'dat.gui/dat.gui'
  },
  packages: [

  ]
});

requirejs(['3d_viewer.js']);
