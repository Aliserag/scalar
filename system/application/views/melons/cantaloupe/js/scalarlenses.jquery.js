/*!
 * Scalar Lens plugin
 * Author: Michael Morgan
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    const pluginName = 'ScalarLenses', defaults = {};

    function ScalarLenses( element, options) {
        this.element = element;
        this.options = $.extend( {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }


    ScalarLenses.prototype.init = function () {
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.options

      // reference for content-selector callback function
      let me = this;

      //
      /// the Lens object
      //
      let scalarLensObject = {
        "urn": $('link#urn').attr('href').replace("version", "lens"),
        "expanded": false,
        "submitted": false,
        "frozen": false,
        "frozen-items": [],
        "visualization": {
          "type": ""
        },
        "components": [
          {
            "content-selector": {
              "type": "",
              "items":[],
              "quantity": "",
              "units": "",
              "coordinates": ""
            },
          }
        ]
      };




      //
      /// HTML for the Lens
      //
      let lensHtml =
      '<div class="paragraph_wrapper">'+
        '<div class="body_copy">'+
          '<div class="row lens">'+
            '<div id="lens">'+
              '<div class="col-xs-12">'+
                '<div class="lens-expand-container" data-toggle="collapse" data-target="">'+
                  '<div class="lens-icon-wrapper col-xs-1">'+
                    '<span class="lens-icon"></span>'+
                  '</div>'+
                  '<div class="lens-content col-xs-11">'+
                    '<h3 class="lens-title heading_font heading_weight"> Tokyo Area Commercial Networks <span class="badge">0</span></h3>' +
                  '<div class="lens-tags">'+
                  //
                  /// Visualization dropdown
                  //
                  '<div id="visualization-btn" class="btn-group"><button id="visualization-button" type="button" class="btn btn-primary btn-xs dropdown-toggle caption_font" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                    'Select visualization<span class="caret"></span></button>'+
                    '<ul id="visualization-dropdown" class="dropdown-menu">'+
                      '<li><a><span class="dropdown-item-icon force"></span>Force-Directed</a></li>'+
                      '<li><a><span class="dropdown-item-icon grid"></span>Grid</a></li>'+
                      '<li><a><span class="dropdown-item-icon list"></span>List</a></li>'+
                      '<li><a><span class="dropdown-item-icon map"></span>Map</a></li>'+
                      '<li><a><span class="dropdown-item-icon radial"></span>Radial</a></li>'+
                      '<li><a><span class="dropdown-item-icon tree"></span>Tree</a></li>'+
                      '<li><a><span class="dropdown-item-icon word-cloud"></span>Word Cloud</a></li>'+
                    '</ul>'+
                  '</div>'+
                  //
                  /// Content selector dropdown
                  //
                  '<div class="btn-group"><button id="content-selector-button" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                      'Select items...<span class="caret"></span></button>'+
                    '<ul class="dropdown-menu">'+
                      '<li class="content-selector"><a>Specific items</a></li>'+
                      '<li><a data-toggle="modal" data-target="#modalByType">Items by type</a></li>'+
                      '<li><a data-toggle="modal" data-target="#modalByDistance">Items by distance</a></li>'+
                    '</ul>'+
                  '</div>'+

                '</div>'+ //lens-expanded container
              '</div>'+ // col-12 wrapper
            '</div>'+ // lens wrapper
          '</div>'+ // row
        '</div>'+ // body copy
      '</div>'+ // paragraph wrapper


      //
      /// Modal for items by Type
      //
      '<div id="modalByType" class="modal fade caption_font" role="dialog">'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-body">'+
              //'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
              '<p>Select all items of this type:</p>'+
              '<div class="btn-group"><button id="byType" type="button" class="btn btn-default btn-md dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                  'Select item...<span class="caret"></span></button>'+
                '<ul class="dropdown-menu">'+
                  '<li><a>Annotation</a></li>'+
                  '<li><a>Comment</a></li>'+
                  '<li><a>Media</a></li>'+
                  '<li><a>Page</a></li>'+
                  '<li><a>Path</a></li>'+
                  '<li><a>Tag</a></li>'+
                '</ul>'+
              '</div>'+
            '</div>'+ // modal body
            '<div class="modal-footer">'+
              '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'+
              '<button id="typeDone" type="button" class="btn btn-primary" data-dismiss="modal">Done</button>'+
          '  </div>'+
          '</div>'+ // modal content
        '</div>'+ // modal dialog
      '</div>'+

      //
      // Modal for items by Distance
      //
      '<div id="modalByDistance" class="modal fade caption_font" role="dialog">'+
        '<div class="modal-dialog">'+
          '<div class="modal-content">'+
            '<div class="modal-body">'+
              //'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
              '<p>Add any item that is within</p>'+
              '<div class="row">'+
                '<div class="col-sm-10">'+
                  '<div class="col-sm-5">'+
                    '<input id="distanceQuantity" type="text" class="form-control" aria-label="..." placeholder="Enter distance">'+
                  '</div>'+
                  '<div class="col-sm-5">'+
                    '<div class="btn-group">'+
                      '<button id="distanceUnits" type="button" class="btn btn-default btn-md dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                        'Select unit...<span class="caret"></span></button>'+
                      '<ul class="dropdown-menu">'+
                        '<li><a>miles</a></li>'+
                        '<li><a>kilometers</a></li>'+
                      '</ul>'+
                    '</div>'+ // distance dropdown
                  '</div>'+
                '</div>'+
              '</div>'+ // row
              '<p>of these coordinates:</p>'+
              '<div class="row">'+
                '<div class="col-sm-10">'+
                  '<div class="col-sm-5">'+
                    '<input id="latitude" type="text" class="form-control" aria-label="..." placeholder="Latitude (decimal)">'+
                  '</div>'+
                  '<div class="col-sm-5">'+
                    '<input id="longitude" type="text" class="form-control" aria-label="..." placeholder="Longitude (decimal)">'+
                  '</div>'+
                '</div>'+
              '</div>'+ // row
            '</div>'+ // modal body
            '<div class="modal-footer">'+
              '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'+
              '<button id="distanceDone" type="button" class="btn btn-primary" data-dismiss="modal">Done</button>'+
          '  </div>'+
          '</div>'+
        '</div>'+
      '</div>';



      // function to populate dropdown value
      // handles multiple instances of dropdowns
      $(function(){

        $(".dropdown-menu").on('click', 'li a', function(ev){
          ev.preventDefault();
          let buttonValue = $(this).parent().parent().siblings(".btn:first-child").html($(this).text()+' <span class="caret"></span>');
          buttonValue
          $(this).parent().parent().siblings(".btn:first-child").val($(this).text());

          // Display icons inside visualization dropdown button
          switch($(this).text()) {
            case 'Force-Directed':
              buttonValue.prepend('<span class="dropdown-item-icon force light"></span>');
              me.saveLens();
              break;
            case 'Grid':
              buttonValue.prepend('<span class="dropdown-item-icon grid light"></span>');
              me.saveLens();
              break;
            case 'List':
              buttonValue.prepend('<span class="dropdown-item-icon list light"></span>');
              me.saveLens();
              break;
            case 'Map':
              buttonValue.prepend('<span class="dropdown-item-icon map light"></span>');
              me.saveLens();
              break;
            case 'Radial':
              buttonValue.prepend('<span class="dropdown-item-icon radial light"></span>');
              me.saveLens();
              break;
            case 'Tree':
              buttonValue.prepend('<span class="dropdown-item-icon tree light"></span>');
              me.saveLens();
              break;
            case 'Word Cloud':
              buttonValue.prepend('<span class="dropdown-item-icon word-cloud light"></span>');
              me.saveLens();
              break;
            //
            // trigger content-selector
            //
            case 'Specific items':
              $('<div></div>').content_selector({
                changeable: true,
                multiple: true,
                onthefly: true,
                msg: 'Choose items to be included in this lens.',
                callback: me.handleAddTags
              });
              $('#byType').val(" ").text("Select item...");
              $('#distanceUnits').val(" ").text("Select unit...");
              $('#distanceQuantity, #latitude, #longitude').val("");
              //delete scalarLensObject["components"][0]["content-selector"]["content-type"];
              delete scalarLensObject["components"][0]["content-selector"]["quantity"];
              delete scalarLensObject["components"][0]["content-selector"]["units"];
              delete scalarLensObject["components"][0]["content-selector"]["coordinates"];
              break;
            case 'Items by type':
              $('#distanceQuantity, #latitude, #longitude').val("");
              $('#distanceUnits').val(" ").text("Select unit...");

              delete scalarLensObject["components"][0]["content-selector"]["items"];
              delete scalarLensObject["components"][0]["content-selector"]["quantity"];
              delete scalarLensObject["components"][0]["content-selector"]["units"];
              delete scalarLensObject["components"][0]["content-selector"]["coordinates"];

              break;
            case 'Items by distance':
              delete scalarLensObject["components"][0]["content-selector"]["items"];
              delete scalarLensObject["components"][0]["content-selector"]["content-type"];
              $('#byType').val("Select item...");
              break;
          }


            // store visualization-type value as kebab-case
            scalarLensObject["visualization"]["type"] = $('#visualization-button').val().split(/[_\s]/).join("-").toLowerCase();
            // store content-selector type as kebab-case
            scalarLensObject["components"][0]["content-selector"]["type"] = $('#content-selector-button').val().split(/[_\s]/).join("-").toLowerCase();

            me.saveLens();
        });


        //
        /// store 'items by type' modal content-type
        //
        $('#typeDone').click(function(){
          scalarLensObject["components"][0]["content-selector"]["content-type"] = $('#byType').val().split(/[_\s]/).join("-").toLowerCase();

          // JSON updates content button text
          let updateByType = scalarLensObject["components"][0]["content-selector"]["content-type"];

          // retrieve plural name types for selections
          if(updateByType === 'page' || updateByType === 'media'){
            $('#content-selector-button').text('All ' + scalarapi.model.scalarTypes[updateByType].plural).append('<span class="caret"></span>');
          } else {
            $('#content-selector-button').text('All ' + scalarapi.model.relationTypes[updateByType].bodyPlural).append('<span class="caret"></span>');
          }

          console.log(scalarLensObject);

          me.saveLens();

        });


        //
        /// store 'items by distance' values
        //
        $('#distanceDone').click(function(){
          // quantity
          scalarLensObject["components"][0]["content-selector"]["quantity"] = $('#distanceQuantity').val();
          // units
          scalarLensObject["components"][0]["content-selector"]["units"] = $('#distanceUnits').val();
          // coordinates
          scalarLensObject["components"][0]["content-selector"]["coordinates"] = $('#latitude').val() + ', ' + $('#longitude').val();



          let units = scalarLensObject["components"][0]["content-selector"]["units"];
          let abbreviateUnits;

          // abbreviate units for display
          if(units === "miles") {
            abbreviateUnits = "mi";
          } else if(units === "kilometers") {
            abbreviateUnits = "km";
          }

          let quantity = scalarLensObject["components"][0]["content-selector"]["quantity"];
          let coordinates = scalarLensObject["components"][0]["content-selector"]["coordinates"];

          // JSON updates content button text
          let updateByDistance = quantity + ' ' + abbreviateUnits + ' from ' + coordinates;

          $('#content-selector-button').text('Items ≤ ' + updateByDistance + '').append('<span class="caret"></span>');

          console.log(scalarLensObject);

          me.saveLens();

        });



      //
      /// show saved metadata values
      //

        if($("[property|='scalar:isLensOf']")){
          // convert metadata div content into a JSON object
          let metaData = JSON.parse($("[property|='scalar:isLensOf']").html());
          console.log(metaData);

          scalarLensObject = metaData;

          let newButtonValue = $('#visualization-button').text(scalarLensObject.visualization.type).css({'text-transform':'capitalize'}).append(' <span class="caret"></span>');

          // Display icons inside visualization dropdown button
          switch(scalarLensObject.visualization.type) {
            case 'force-directed':
              newButtonValue.prepend('<span class="dropdown-item-icon force light"></span>');
              break;
            case 'grid':
              newButtonValue.prepend('<span class="dropdown-item-icon grid light"></span>');
              break;
            case 'list':
              newButtonValue.prepend('<span class="dropdown-item-icon list light"></span>');
              break;
            case 'map':
              newButtonValue.prepend('<span class="dropdown-item-icon map light"></span>');
              break;
            case 'radial':
              newButtonValue.prepend('<span class="dropdown-item-icon radial light"></span>');
              break;
            case 'tree':
              newButtonValue.prepend('<span class="dropdown-item-icon tree light"></span>');
              break;
            case 'word-cloud':
              newButtonValue.prepend('<span class="dropdown-item-icon word-cloud light"></span>');
              break;
            default:
              $('#visualization-button').text('Select visualization...').css({'text-transform':'none'}).append(' <span class="caret"></span>');

          }


          /// show saved content-type

          let newContentButtonText = scalarLensObject["components"][0]["content-selector"]["content-type"];

          switch(scalarLensObject["components"][0]["content-selector"]["type"]){

            case 'specific-items':
              delete scalarLensObject["components"][0]["content-selector"]["content-type"];
              delete scalarLensObject["components"][0]["content-selector"]["quantity"];
              delete scalarLensObject["components"][0]["content-selector"]["units"];
              delete scalarLensObject["components"][0]["content-selector"]["coordinates"];

              let newItemsValue = scalarLensObject["components"][0]["content-selector"]["items"];

              if(newItemsValue.length <= 1){
                $('#content-selector-button').html('&#8220;'+ newItemsValue + '&#8221;').append('<span class="caret"></span>');
              } else if(newItemsValue.length > 1){
                let remainingItems = newItemsValue.length - 1;
                $('#content-selector-button').html('&#8220;'+ newItemsValue[0] + '&#8221;' + ' and ' + remainingItems + ' more...').append('<span class="caret"></span>');
              }

              break;

            case 'items-by-type':
              // retrieve plural name types for selections
              if(newContentButtonText === 'page' || newContentButtonText === 'media'){
                $('#content-selector-button').text('All ' + scalarapi.model.scalarTypes[newContentButtonText].plural).append('<span class="caret"></span>');
              } else {
                $('#content-selector-button').text('All ' + scalarapi.model.relationTypes[newContentButtonText].bodyPlural).append('<span class="caret"></span>');
              }

              delete scalarLensObject["components"][0]["content-selector"]["items"];

              break;

            case 'items-by-distance':

                delete scalarLensObject["components"][0]["content-selector"]["items"];

                let units = scalarLensObject["components"][0]["content-selector"]["units"];
                let abbreviateUnits;

                // abbreviate units for display
                if(units === "miles") {
                  abbreviateUnits = "mi";
                } else if(units === "kilometers") {
                  abbreviateUnits = "km";
                }

                let quantity = scalarLensObject["components"][0]["content-selector"]["quantity"];
                let coordinates = scalarLensObject["components"][0]["content-selector"]["coordinates"];

                // JSON updates content button text
                let updateByDistance = quantity + ' ' + abbreviateUnits + ' from ' + coordinates;

                $('#content-selector-button').text('Items ≤ ' + updateByDistance + '').append('<span class="caret"></span>');

              break;
            default:
              $('#content-selector-button').text('Select items...').append('<span class="caret"></span>');
          }

          //me.saveLens();
          console.log(scalarLensObject);

        }






      });



      // append html when plugin is called
      $("[property|='sioc:content']").append(lensHtml);


      // ajax call to post user lens selections
      ScalarLenses.prototype.saveLens = function() {
        this.baseURL = $('link#parent').attr('href');
        $.ajax({
          url: this.baseURL + "api/relate",
          type: "POST",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(scalarLensObject),
          async: true,
          context: this,
          success: function success(data) {
            console.log(data);
          },
          error: function error(response) {
            console.log(response);
          }
        });
      }



      //
      /// callback for content-selector
      //
      ScalarLenses.prototype.handleAddTags = function(nodes) {
        if (nodes && nodes.length != 0) {
          //console.log(nodes);

          // extract the 'slug' property of each node and put into an array;
          // this gets stored in the "items" property
          let nodeTitle = nodes.map(node => node.title);
          // set JSON object value
          scalarLensObject["components"][0]["content-selector"]["items"] = nodeTitle;

          // show selections in content-selector button

          if(nodeTitle.length <= 1){
            $('#content-selector-button').html('&#8220;'+ nodeTitle + '&#8221;').append('<span class="caret"></span>');
          } else if(nodeTitle.length > 1){
            let remainingItems = nodeTitle.length - 1;
            $('#content-selector-button').html('&#8220;'+ nodeTitle[0] + '&#8221;' + ' and ' + remainingItems + ' more...').append('<span class="caret"></span>');
          }

          console.log(scalarLensObject);

          me.saveLens();

        }


      } // handleAddTags callback






    }; // init function




    // plugin wrapper around the constructor,
    // to prevent against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new ScalarLenses( this, options ));
            }
        });
    }



})( jQuery, window, document );
