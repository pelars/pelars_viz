require.config({
	paths: {
		vis : 'vis/dist/vis',
		timeline: 'timeline',
		requirejs: 'requirejs/require',
		jquery: 'jquery/dist/jquery',
		jqueryui: 'jquery-ui/jquery-ui',
		gridster: 'gridster/dist/jquery.gridster',
		threeD : 'threeD',
		FontUtils: 'FontUtils',
		TextGeometry: 'TextGeometry',
		OrbitControls: 'OrbitControls',
		'font.Helvetica': 'fonts/helvetiker_regular.typeface',
		'dat.gui': 'dat.gui/dat.gui',
		'threejs' : 'three.js/build/three.min',
		TrackballControls: 'TrackballControls'
		//	d3: 'd3/d3',
		//	datacard: 'data-card',
		//	datacardtest: 'data-card-test'
	},
	shim: {
		vis: {
			exports: 'vis'
		},
		timeline: {
			deps : ['vis']
		},
		audio:{
			deps : ['vis']
		},
		gridster: {
			deps: ['jquery']
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
		},
		TrackballControls: {
		  deps: [
		    'threejs'
		  ],
		  exports: 'THREE'
		},
		threeD : {
			deps: ['FontUtils','font.Helvetica','dat.gui','threejs','OrbitControls', 'TrackballControls']
		},
		//	datacard: {
		//		deps: ['d3','underscore']
		//	},
		//	datacardtest:{
		//		deps: ['datacard']
		//	}
	},
	packages: []
});

define(['jqueryui','jquery', 'gridster'],function () {
	
	   var gridster = [];

       $(function() {

           gridster[0] = $("#nondrag ul").gridster({
               widget_base_dimensions: [50, 50],
               widget_margins: [5, 5],
               namespace: '#nondrag',
               helper: 'clone',
               autogrow_cols: true,
                resize: {
                 enabled: true
               }
           }).data('gridster').disable();

           gridster[1] = $("#draggrid ul").gridster({
               widget_base_dimensions: [50, 50],
               widget_margins: [5, 5],
               autogrow_cols: true,
               namespace: '#draggrid'
              /* resize: {
                 enabled: true
               }*/
           }).data('gridster').disable();

           gridster[2] = $("#SSSUP ul").gridster({
               widget_base_dimensions: [50, 50],
               widget_margins: [5, 5],
               autogrow_cols: true,
               namespace: '#SSSUP'
           }).data('gridster').disable();

       });
	
	$(function() {
		$("#tabs").tabs();
	});

	$(function() {
		$( "#selectable" ).selectable({
			stop: function() {
				var result = $( "#select-result" ).empty();
				$( ".ui-selected", this ).each(function() {
					var index = $( "#selectable li" ).index( this );
					
					if(index == 0){
						requirejs(['widgets-filler']);
						return;
					}
					if(index == 1){
						requirejs(['data-card-test']);
						return;
					}
					
				});
			}
		});
	});
	
	 $(function() {
		 $( "#sortable" ).sortable();
		  $( "#sortable" ).disableSelection();
		  });

	$(function() {
		$( "#accordion" ).accordion({
			heightStyle: "fill"
		});
	});


	$(function() {
		$( "#accordion-resizer" ).resizable({
			minHeight: 600,
			minWidth: 800,
			resize: function() {
				$( "#accordion" ).accordion( "refresh" );
			}
		});
	});
//	requirejs(['datacard']);
//	requirejs(['data-card-test']);
//	requirejs(['widgets-filler']);
});