CKEDITOR._scalar = {
	selectcontent : function(options) {
		$('<div></div>').content_selector(options);
	},
	contentoptions : function(options) {
		$('<div></div>').content_options(options);
	},
	selectWidget : function(options){
		$('<div></div>').widget_selector(options);
	},
	widgetOptions : function(options){
		$('<div></div>').widget_options(options);
	},
	flushEditor : function(editor,newContent,placeholder){
		//TODO:Replace this with a better solution...
		var inline = editor.editable().isInline();
		if(inline){
			$('#editorialPath').data('editorialPath').saveNode($(CKEDITOR._scalar.editor.editable().$).parents('.editorial_node'));
			var $editableBody = $(CKEDITOR._scalar.editor.editable().$).data('unloading',true);
			CKEDITOR._scalar.editor.destroy(true);
			$editableBody.prop('contenteditable',false).data('editor',null);
			$('#editorialPath').data('editorialPath').updateLinks($editableBody.parent());
            $editableBody.click();
		}else{

			var placeholders = CKEDITOR._scalar.editor.document.find('img.placeholder');
        	for(var i = 0; i < placeholders.count(); i++){
        		placeholders.getItem(i).remove();
        	}
        	var mediaWidgetLinks = [];
        	var links = CKEDITOR._scalar.editor.document.find('a');
        	for(var i = 0; i < links.count(); i++){
        		var link = links.getItem(i);
        		if($(link.$).attr('resource') || $(link.$).attr('data-widget')){
        			mediaWidgetLinks.push(link);
        		}
        	}

        	for(var link in mediaWidgetLinks){
        		var thisLink = mediaWidgetLinks[link];
        		var placeholder = CKEDITOR._scalar.addNewPlaceholder(thisLink,false);
				$(placeholder.$).data('link',thisLink);
				$(newContent.$).data('placeholder',placeholder);
				CKEDITOR._scalar.populatePlaceholderData(false,placeholder);
        	}
        	if(CKEDITOR._scalar.editor.document.find('img.linked.placeholder.align_right').count() > 0){
				CKEDITOR._scalar.editor.document.getBody().addClass('gutter');
			}else{
				CKEDITOR._scalar.editor.document.getBody().removeClass('gutter');
			}
			
		}
	},
	addNewPlaceholder : function(element,inLoader){
		if(typeof inLoader == 'undefined'){
			inLoader = true;
		}
		
		if(inLoader){
			if(element.attributes['resource'])
	        {
	            var thumbnail = element.attributes.href;
	            var title = "media";
	            var isMedia = true;
	        }else if(element.attributes['data-widget']){
	        	var thumbnail = $('link#approot').attr('href')+'views/melons/cantaloupe/images/widget_image_'+element.attributes['data-widget']+'.png';
	        	var title = element.attributes['data-widget']+" widget";
	        	var isMedia = false;
	        }
			var cssClass = (element.hasClass('inline')?'inline':'linked')+" placeholder";
			var placeholder = new CKEDITOR.htmlParser.element('img',{
				class : cssClass+' '+element.attributes['data-size'] + ' align_'+element.attributes['data-align'],
				src : thumbnail,
				title : title,
				contentEditable : 'false'
			});
		}else{
			if(element.hasAttribute('resource'))
	        {
	            var thumbnail = element.getAttribute('href');
	            var title = "media";
	            var isMedia = true;
	        }else if(element.hasAttribute('data-widget')){
	        	var thumbnail = $('link#approot').attr('href')+'views/melons/cantaloupe/images/widget_image_'+element.getAttribute('data-widget')+'.png';
	        	var title = element.getAttribute('data-widget')+" widget";
	        	var isMedia = false;
	        }
			var cssClass = (element.hasClass('inline')?'inline':'linked')+" placeholder";
			var placeholder = CKEDITOR._scalar.editor.document.createElement('img');
			var attributes = {
				class : cssClass+' '+element.getAttribute('data-size') + ' align_'+element.getAttribute('data-align'),
				src : thumbnail,
				title : title,
				contentEditable : 'false'
			};
			attributes['data-newLink'] = true;
			attributes['data-content'] = element.getIndex();
			placeholder.setAttributes(attributes);
		}

		placeholder.insertAfter(element);
		return placeholder;
	},
	populatePlaceholderData : function(e,newPlaceholder){
		var addContentOptions = function(placeholder){
			var $link = $($(placeholder.$).data('link').$);
        	var isMedia = $link.attr('resource') != undefined;
        	var isInline = $link.hasClass('inline');
        	var typeText = (isMedia?'media':'widget');
        	var messageText = 'Edit '+(isInline?'Inline':'Linked')+' Scalar '+(isMedia?'Media':'Widget');
        	var callBackName = '';
        	if(isInline){
        		callBackName = (isMedia?'inlineMedia':'widgetInline');
        	}else{
        		callBackName = (isMedia?'media':'widget')+"Link";
        	}
        	var callback = CKEDITOR._scalar[callBackName+'Callback'];
        	$link.data({
				  contentOptionsCallback : callback,
				  selectOptions : {
				  		isEdit:true,
				  		type:typeText,
				  		msg:messageText,
				  		element:$(placeholder.$).data('link'),
				  		callback:callback,
				  		inline:isInline
				  }
			});
		}
		if(typeof newPlaceholder != 'undefined'){
			addContentOptions(newPlaceholder);
			$(newPlaceholder.$).data('newlink',false);
		}else{
			if(CKEDITOR._scalar.editor.editable().isInline()){
				var placeholders = CKEDITOR._scalar.editor.editable().find('.placeholder');
				for(var i = 0; i < placeholders.count(); i++){
		    		var placeholder = placeholders.getItem(i);
		    		var links = CKEDITOR._scalar.editor.document.find('a');
		    		var link = null;
		    		for(var n = 0; n < links.count(); n++){
		    			if($(links.getItem(n).$).data('linkid') == $(placeholder.$).data('linkid')){
		    				link = links.getItem(n);
		    			}
		    		}
		    		$(placeholder.$).data('link',link);
		    		$(link.$).data('placeholder',placeholder);
		    		addContentOptions(placeholder);
		    	}
			}else{
		    	if(CKEDITOR._scalar.editor.document.find('img.linked.placeholder.align_right').count() > 0){
					CKEDITOR._scalar.editor.document.getBody().addClass('gutter');
				}
				
				var placeholders = CKEDITOR._scalar.editor.document.find('img.placeholder');
		    	for(var i = 0; i < placeholders.count(); i++){
		    		var placeholder = placeholders.getItem(i);
		    		var link = placeholder.getParent().getChild($(placeholders.getItem(i).$).data('content'));
		    		$(placeholder.$).data('link',link);
		    		$(link.$).data('placeholder',placeholder);
					addContentOptions(placeholder);
		    	}
		    }
		}

    	CKEDITOR._scalar.UpdatePlaceholderHoverEvents(CKEDITOR._scalar.editor);
	},
	updateEditMenuPosition : function(editor){
		CKEDITOR._scalar.editor = editor;
		$placeholder = CKEDITOR._scalar.$editorMenu.data('placeholder');
		if(typeof CKEDITOR._scalar.editor.editable() == 'undefined' || CKEDITOR._scalar.editor.editable() == null){
			var inline = false;
			if(typeof CKEDITOR._scalar.editor.document == undefined || CKEDITOR._scalar.editor.document == null){
				return false;
			}
		}else{
			var inline = CKEDITOR._scalar.editor.editable().isInline();
		}
		if(inline){
			$placeholder = $placeholder.find('.content');
		}
		CKEDITOR._scalar.$editorMenu.width($placeholder.width());
		var position = $placeholder.position();
		var framePosition = $(inline?CKEDITOR._scalar.editor.container.$:CKEDITOR._scalar.editor.document.$.defaultView.frameElement).offset();
		var frameScroll = inline?0:$('.cke_contents>iframe').contents().scrollTop();
		var pageScroll = $(window).scrollTop();
		var inlineOffset = -50;
		var topPos = inline?$placeholder.offset().top+inlineOffset:framePosition.top+position.top-frameScroll;
		var leftPos = framePosition.left+position.left+parseInt($placeholder.css('margin-left'))+parseInt($placeholder.css('padding-left'));
		if(!CKEDITOR._scalar.editor.editable().isInline() && frameScroll > position.top){
			topPos = framePosition.top;
		}
		CKEDITOR._scalar.$editorMenu.css({
			top:topPos,
			left:leftPos
		});
	},
	UpdatePlaceholderHoverEvents : function(editor){
		$('.scalarEditorMediaWidgetMenu').remove();
		CKEDITOR._scalar.$editorMenu = $('<ul class="caption_font scalarEditorMediaWidgetMenu"><li class="pull-left"><a href="#" class="deleteLink">Delete</a></li><li class="pull-right"><a href="#" class="editLink">Edit</a></li></ul>')
			.appendTo('body')
			.hover(function(){
				window.clearTimeout(CKEDITOR._scalar.editMenuTimeout);
			},function(){
				window.clearTimeout(CKEDITOR._scalar.editMenuTimeout);
				CKEDITOR._scalar.editMenuTimeout = window.setTimeout(function(){
					CKEDITOR._scalar.$editorMenu.hide();
				},50);
			});
		CKEDITOR._scalar.$editorMenu.find('.editLink').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			CKEDITOR._scalar.$editorMenu.hide();
			var element = CKEDITOR._scalar.$editorMenu.data('link');
			isEdit = true;

			if($(element.$).data('selectOptions').type!=null&&$(element.$).data('selectOptions').type=="widget"){
				console.log($(element.$).data('selectOptions'));
				CKEDITOR._scalar.selectWidget($(element.$).data('selectOptions'));
			}else{
				CKEDITOR._scalar.selectcontent($(element.$).data('selectOptions'));
			}
		});
		CKEDITOR._scalar.$editorMenu.find('.deleteLink').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			CKEDITOR._scalar.$editorMenu.hide();
			var element = CKEDITOR._scalar.$editorMenu.data('link');
			var inline = CKEDITOR._scalar.editor.editable().isInline();
			var doDelete = window.confirm("Are you sure you would like to delete this "+$(element.$).data('selectOptions').type+"? \n(Click \"OK\" to remove, click \"Cancel\" to keep.)");
			if(!doDelete){
				return false;
			}
			if(!inline){
				$(element.$).data('placeholder').remove(true);
				element.remove();
			}else{
				$($(element.$).data('placeholder').$).remove();
				$(element.$).remove();
				var $editableBody = $(CKEDITOR._scalar.editor.editable().$).data('unloading',true);
				CKEDITOR.instances[$editableBody.data('editor').name].destroy(true);
				$editableBody.prop('contenteditable',false).data('editor',null);
				$('#editorialPath').data('editorialPath').updateLinks($editableBody.parent());
	            $editableBody.click();
			}
			return false;
		});

		$(editor.editable().$).find('.placeholder').off('hover').hover(function(e){
			CKEDITOR._scalar.$editorMenu.show().width($(this).width()).data({
				link:$(this).data('link'),
				placeholder:$(this)
			});
			CKEDITOR._scalar.updateEditMenuPosition(editor);
			window.clearTimeout(CKEDITOR._scalar.editMenuTimeout);
		},function(e){
			window.clearTimeout(CKEDITOR._scalar.editMenuTimeout);
			CKEDITOR._scalar.editMenuTimeout = window.setTimeout(function(){
				CKEDITOR._scalar.$editorMenu.hide();
			},100);
		});
	},
	external_link : function(editor, options) {
		CKEDITOR.dialog.add( 'external_link', function(editor) {
			return {
				title : 'Insert External Link',
				width : 500,
				minHeight : 100,
				contents : [{
					id : 'general',
					label : 'External Link',
					elements : [{
						type : 'html',
						html : 'Add a hyperlink to an external site. Scalar will maintain a header bar that allows easy navigation back to your book (unless disallowed by the external site).'
					},{
						type : 'text',
						id : 'href',
						label : 'URL',
						'default' : 'http://',
						validate : CKEDITOR.dialog.validate.notEmpty( 'URL is a required field' ),
						required : true,
						setup : function(element) {
							if (null!==element.getAttribute('href')) this.setValue(element.getAttribute('href'));
						},
						commit : function(data) {
							data.href = this.getValue();
						}
					},{
						type : 'checkbox',
						id : 'target_blank',
						label : 'Open in a new browser window',
						'default' : false,
						setup : function(element) {
							if ('_blank'==element.getAttribute('target')) this.setValue('checked');
						},
						commit : function(data) {
							data.target = (this.getValue()) ? '_blank' : false;
						}
					}]
				}],
				onShow : function() {
					var sel = editor.getSelection(), element = sel.getStartElement();
					if (sel.getRanges()[0].collapsed) {
						alert('Please select text to transform into a link');
					    ckCancel = this._.buttons['cancel'],
					    ckCancel.click();
						return;
					}
					this.element = editor.document.createElement('a');
					this.element.setHtml(sel.getSelectedText());
					if (element) element = element.getAscendant('a', true);
					// Browsers won't allow href attribute to be re-written, so doing this round-about by always creating a new <a> but propogating it with the existing element's values if it exists
					if (!element || element.getName() != 'a' || element.data('cke-realelement' )) {
						this.setupContent(this.element);
					} else {
						this.setupContent(element);
					}
				},
				onOk : function() {
					var dialog = this, data = {};
					this.commitContent(data);
					if (data.href.length) this.element.setAttribute('href', data.href);
					if (data.target) this.element.setAttribute('target', data.target);
					editor.insertElement(this.element);
				}
			};
		});
		var _command = new CKEDITOR.dialogCommand('external_link');
		editor.addCommand('_external_link_dialog', _command);
		editor.execCommand("_external_link_dialog");
	},
	mediaLinkCallback : function(node,element){
		var isEdit = typeof element.$.href != 'undefined' && element.$.href != '';
		CKEDITOR._scalar.contentoptions({data:reference_options['insertMediaLink'],node:node,element:element,callback:function(options) {
					var node = options.node;
					delete(options.node);

					var $element = $(element.$);

					var placeholder = $element.data('placeholder');
					$element.data('placeholder',null);
					$.each(element.$.attributes,function(i,a){
			        	if(typeof a != 'undefined' && a.name.substring(0,5) == 'data-'){
			        		$element.removeAttr(a.name);
			        	}
			        });
			        $element.removeAttr('resource').removeData();

					if(typeof node.version !== 'undefined'){
						var href = node.version['http://simile.mit.edu/2003/10/ontologies/artstor#url'][0].value;
					}else{
						var href = node.current.sourceFile;
					}

					for (var key in options) {
						if(key == "featured_annotation"){
							href+='#'+options[key];
						}else{
							element.setAttribute('data-'+key, options[key]);
						}
					}

					element.setAttribute('href', href);

					//Also have to set cke-saved-href if this is an edit, so that we can actually change the href value!
					if(isEdit){
						element.data('cke-saved-href',href);
					}

					element.setAttribute('resource', node.slug);


					var inline = CKEDITOR._scalar.editor.editable().isInline();
					if(!isEdit){
						CKEDITOR._scalar.editor.insertElement(element);
					}else if(!inline){
						CKEDITOR._scalar.editor.updateElement(element);
					}

					var slug = node.slug;
					CKEDITOR._scalar.flushEditor(CKEDITOR._scalar.editor,element,isEdit?placeholder:'');
		}});
	},
	inlineMediaCallback : function(node,element){
		var isEdit = typeof element.$.href != 'undefined' && element.$.href != '';
		CKEDITOR._scalar.contentoptions({data:reference_options['insertMediaelement'],node:node,element:element,callback:function(options) {
				var node = options.node;
				delete(options.node);

				element.setAttribute('name','scalar-inline-media');  // Required to let empty <a> through
				var $element = $(element.$);

				var placeholder = $element.data('placeholder');
				$element.data('placeholder',null);
				
				$.each(element.$.attributes,function(i,a){
		        	if(typeof a != 'undefined' && a.name.substring(0,5) == 'data-'){
		        		$element.removeAttr(a.name);
		        	}
		        });
		        $element.removeAttr('resource').removeData();

				var classAttr = 'inline';

				if(typeof node.version !== 'undefined'){
					var href = node.version['http://simile.mit.edu/2003/10/ontologies/artstor#url'][0].value;
				}else{
					var href = node.current.sourceFile;
				}
				for (var key in options) {
					if(key == "featured_annotation"){
						href+='#'+options[key];
					}else if(key == "text-wrap"){
						if(options[key] == "wrap-text-around-media"){
							classAttr += ' wrap';
						}
					}else{
						element.setAttribute('data-'+key, options[key]);
					}
				}


				element.setAttribute('class', classAttr);

				element.setAttribute('href', href);
				//Also have to set cke-saved-href if this is an edit, so that we can actually change the href value!
				if(isEdit){
					element.data('cke-saved-href',href);
				}
				element.setAttribute('resource', node.slug);


				var inline = CKEDITOR._scalar.editor.editable().isInline();
				if(!isEdit){
					CKEDITOR._scalar.editor.insertElement(element);
				}else if(!inline){
					CKEDITOR._scalar.editor.updateElement(element);
				}
				CKEDITOR._scalar.flushEditor(CKEDITOR._scalar.editor,element,isEdit?placeholder:'');
		}});
	},
	widgetLinkCallback : function(widget, element){
		var isEdit = $(element.$).data('widget') != undefined;
		var href = null;
		var $element = $(element.$);

		var placeholder = $element.data('placeholder');
		$element.data('placeholder',null);
		
		var contentOptionsCallback = $element.data('contentOptionsCallback');
		var selectOptions = $element.data('selectOptions');
		var element = selectOptions.element;
		selectOptions.isEdit = true;
		$.each(element.$.attributes,function(i,a){
        	if(typeof a != 'undefined' && a.name.substring(0,5) == 'data-'){
        		$element.removeAttr(a.name);
        	}
        });

		$element.removeAttr('resource').removeData();


		for (var a in widget.attrs) {
			element.setAttribute(a, widget.attrs[a]);
			if(a == "href"){
				href = widget.attrs[a];
			}
		}

		$element.data({
			contentOptionsCallback: contentOptionsCallback,
			element: element,
			selectOptions: selectOptions
		});

		var inline = CKEDITOR._scalar.editor.editable().isInline();
		if(!isEdit){
			CKEDITOR._scalar.editor.insertElement(element);
		}else if(!inline){
			if(href!=null){
				element.data('cke-saved-href', href);
			}
			CKEDITOR._scalar.editor.updateElement(element);
		}
		CKEDITOR._scalar.flushEditor(CKEDITOR._scalar.editor,element,isEdit?placeholder:'');
	},
	widgetInlineCallback : function(widget, element){
		var isEdit = $(element.$).data('widget') != undefined;
		var href = null;
		var $element = $(element.$);

		var placeholder = $element.data('placeholder');
		$element.data('placeholder',null);

		var contentOptionsCallback = $element.data('contentOptionsCallback');
		var selectOptions = $element.data('selectOptions');
		var element = selectOptions.element;
		selectOptions.isEdit = true;
		$.each(element.$.attributes,function(i,a){
        	if(typeof a != 'undefined' && a.name.substring(0,5) == 'data-'){
        		$element.removeAttr(a.name);
        	}
        });

		$element.removeAttr('resource').removeData();


		element.setAttribute('name','scalar-inline-widget');  // Required to let empty <a> through
		var classAttr = "inlineWidget inline";
		for (var a in widget.attrs) {
			if(a == "data-textwrap"){
				if(widget.attrs[a] == 'wrap'){
					classAttr += ' wrap';
				}
			}else{
				element.setAttribute(a, widget.attrs[a]);
			}
			if(a == "href"){
				href = widget.attrs[a];
			}
		}


		element.setAttribute('class', classAttr);

		$element.data({
			contentOptionsCallback: contentOptionsCallback,
			element: element,
			selectOptions: selectOptions
		});

		var inline = CKEDITOR._scalar.editor.editable().isInline();
		if(!isEdit){
			CKEDITOR._scalar.editor.insertElement(element);
		}else if(!inline){
			if(href!=null){
				element.data('cke-saved-href', href);
			}
			CKEDITOR._scalar.editor.updateElement(element);
		}

		CKEDITOR._scalar.flushEditor(CKEDITOR._scalar.editor,element,isEdit?placeholder:'');
	}
};

CKEDITOR.plugins.add( 'scalar', {
    //icons: 'scalar1,scalar2,scalar3,scalar4,scalar5,scalar6,scalar7',
	icons: 'scalarkeyboard,scalar1,scalar2,scalar5,scalar6,scalar7,scalar8,scalar9',
    requires: 'dialog',
    init: function( editor ) {
			CKEDITOR._scalar.editor = editor;

			cke_loadedScalarInline = [];
			cke_loadedScalarInlineWidget = [];
			cke_loadedScalarLinkedWidget = [];

			cke_addedScalarScrollEvent = false;
			CKEDITOR._scalar.editor.on('mode',function(e){
				if(!cke_addedScalarScrollEvent){
					$(window).add($('.cke_wysiwyg_frame').contents()).off('scroll').on('scroll',$.proxy(function(e){
						if(typeof this == 'undefined'){
							return false;
						}
						if(typeof CKEDITOR._scalar.$editorMenu != "undefined" && CKEDITOR._scalar.$editorMenu.data('placeholder')!=undefined){
							CKEDITOR._scalar.updateEditMenuPosition(this);
						}
					},CKEDITOR._scalar.editor));
					cke_addedScalarScrollEvent = true;
				}
				if(typeof scalarapi == 'undefined'){
					$.getScript(widgets_uri+'/api/scalarapi.js');
				}
			});
	    var pluginDirectory = this.path;

	    CKEDITOR._scalar.editor.addContentsCss( pluginDirectory + 'styles/scalar.css' );
	    
        CKEDITOR._scalar.editor.addCommand( 'insertScalarKeyboard', {  // Keyboard
            exec: function( editor ) {
            	CKEDITOR._scalar.editor = editor;
            	var $keyboard = $('#language-keyboard');
            	if (!$keyboard.length) return;
            	$keyboard.show().css({
					top: (parseInt($(window).height()) - parseInt($keyboard.outerHeight()) - 20 + $(window).scrollTop()) + 'px',
					left: (parseInt($(window).width()) - parseInt($keyboard.outerWidth()) - 20) + 'px'
				});
            }
        });	    
	    
        CKEDITOR._scalar.editor.addCommand( 'insertScalar1', {
            exec: function( editor ) {
            				CKEDITOR._scalar.editor = editor;
							var sel = editor.getSelection();
							var isEdit = false;
							var element = sel.getStartElement();

							//Check to see if we currently have an anchor tag - if so, make sure it's a non-inline media link
							if ( element.data('widget') == null && element.getAscendant( 'a', true ) ) {
								element = element.getAscendant( 'a', true );
								if(element.getAttribute('resource')!=null && !element.hasClass('inline')){
									//Not inline
									isEdit = true;
								}
							}
							if(!isEdit){
				    		if (sel.getRanges()[0].collapsed) {
									alert('Please select text to transform into a media link');
				    			return;
								}else{
									var sel = editor.getSelection();
									element = editor.document.createElement('a');
									element.setHtml(sel.getSelectedText());
									$(element.$).data({
										element : element,
										contentOptionsCallback : CKEDITOR._scalar.mediaLinkCallback,
										selectOptions : {type:'media',changeable:false,multiple:false,msg:'Insert Scalar Media Link',element:element,callback:CKEDITOR._scalar.mediaLinkCallback}
									});
								}
							}
							CKEDITOR._scalar.selectcontent($(element.$).data('selectOptions'));
            }
        });
        CKEDITOR._scalar.editor.addCommand( 'insertScalar2', {
            exec: function( editor ) {
				CKEDITOR._scalar.editor = editor;
        		var sel = editor.getSelection();
						var element = sel.getStartElement();
						var isEdit = false;
						//Check to see if we currently have an anchor tag - if so, make sure it's a non-inline media link
						if ( element.data('widget') == null && element.getAscendant( 'a', true ) ) {
							element = element.getAscendant( 'a', true );
							if(element.getAttribute('resource')!=null && element.hasClass('inline')){
								//Is inline
								isEdit = true;
							}
						}

						if(!isEdit){
							element = editor.document.createElement('a')
							$(element.$).data({
								element : element,
								contentOptionsCallback : CKEDITOR._scalar.inlineMediaCallback,
								selectOptions : {type:'media',changeable:false,multiple:false,msg:'Insert Scalar Media Link',element:element,callback:CKEDITOR._scalar.inlineMediaCallback}
							});
						}

        		CKEDITOR._scalar.selectcontent($(element.$).data('selectOptions'));
					}
        });
        CKEDITOR._scalar.editor.addCommand( 'insertScalar5', {
            exec: function( editor ) {
            	CKEDITOR._scalar.editor = editor;
	    		var sel = editor.getSelection();
	    		if (sel.getRanges()[0].collapsed) {
	    			alert('Please select text to transform into a note link');
	    			return;
	    		}
        		CKEDITOR._scalar.selectcontent({changeable:true,multiple:false,onthefly:true,msg:'Insert Scalar Note',callback:function(node){
        			CKEDITOR._scalar.contentoptions({data:reference_options['insertNote'],callback:function(options) {
	        			var sel = editor.getSelection();
	            		element = editor.document.createElement('span');
	            		element.setHtml(sel.getSelectedText());
	            		element.setAttribute('class', 'note');
	        			element.setAttribute('rev', 'scalar:has_note');
	        			element.setAttribute('resource', node.slug);
            			for (var key in options) {
            				element.setAttribute('data-'+key, options[key]);
            			}
	        			editor.insertElement(element);
        			}});
        		}});
            }
        });
        CKEDITOR._scalar.editor.addCommand( 'insertScalar6', {
            exec: function( editor ) {
            	CKEDITOR._scalar.editor = editor;
	    		var sel = editor.getSelection();
	    		if (sel.getRanges()[0].collapsed) {
	    			alert('Please select text to transform into a link');
	    			return;
	    		}
        		CKEDITOR._scalar.selectcontent({changeable:true,multiple:false,onthefly:true,msg:'Insert link to Scalar content',callback:function(node){
        			CKEDITOR._scalar.contentoptions({data:reference_options['createInternalLink'],callback:function(options) {
	        			var sel = editor.getSelection();
	            		element = editor.document.createElement('a');
	            		element.setHtml(sel.getSelectedText());
	        				element.setAttribute('href', node.slug);
            			for (var key in options) {
            				element.setAttribute('data-'+key, options[key]);
            			}
	        			editor.insertElement(element);
        			}});
        		}});
            }
        });

        CKEDITOR._scalar.editor.addCommand( 'insertScalar7', {  // External link
            exec: function( editor ) {
            	CKEDITOR._scalar.editor = editor;
        		CKEDITOR._scalar.external_link(editor, {});
            }
        });

				//BEGIN WIDGET CODE

				CKEDITOR._scalar.editor.addCommand('insertScalar8',{ //Widget Link
					exec: function(editor){
            			CKEDITOR._scalar.editor = editor;
						var sel = editor.getSelection();
						var isEdit = false;
						var element = sel.getStartElement();

						//Check to see if we currently have an anchor tag - if so, make sure it's a non-inline widget link
						if ( element.data('widget') != null && element.getAscendant( 'a', true ) ) {
							element = element.getAscendant( 'a', true );
							if(element.getAttribute('resource')!=null && !element.hasClass('inline')){
								//Not inline
								isEdit = true;
							}
						}
						if(!isEdit){
							if (sel.getRanges()[0].collapsed) {
								alert('Please select text to transform into a widget link');
								return;
							}else{
								var sel = editor.getSelection();
								element = editor.document.createElement('a');
								element.setHtml(sel.getSelectedText());
								$(element.$).data({
									element : element,
									contentOptionsCallback : CKEDITOR._scalar.widgetLinkCallback,
								  selectOptions : {isEdit:false,type:'widget',msg:'Insert Inline Scalar Widget Link',element:element,callback:CKEDITOR._scalar.widgetLinkCallback,inline:false}
								});
							}
						}
						CKEDITOR._scalar.selectWidget($(element.$).data('selectOptions'));
					}
				});

				CKEDITOR._scalar.editor.addCommand('insertScalar9',{ //Widget Inline Link
					exec: function(editor){
            			CKEDITOR._scalar.editor = editor;

						var sel = editor.getSelection();
						var element = sel.getStartElement();
						var isEdit = false;
						//Check to see if we currently have an anchor tag - if so, make sure it's a non-inline media link
						if ( element.data('widget') != null && element.getAscendant( 'a', true ) ) {
							element = element.getAscendant( 'a', true );
							if(element.getAttribute('resource')!=null && element.hasClass('inline')){
								//Is inline
								isEdit = true;
							}
						}

						if(!isEdit){
							element = editor.document.createElement('a')
							$(element.$).data({
								element : element,
								contentOptionsCallback : CKEDITOR._scalar.widgetInlineCallback,
							  selectOptions : {isEdit:false,type:'widget',msg:'Insert Inline Scalar Widget Link',element:element,callback:CKEDITOR._scalar.widgetInlineCallback,inline:true }
							});
						}

						CKEDITOR._scalar.selectWidget($(element.$).data('selectOptions'));
					}
				});

				//END WIDGET CODE

		CKEDITOR._scalar.editor.ui.addButton( 'ScalarKeyboard', {
			label: 'Display Language Keyboard',
			command: 'insertScalarKeyboard',
			toolbar: 'characters'
		});
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar1', {
            label: 'Insert Scalar Media Link',
            command: 'insertScalar1',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar2', {
            label: 'Insert Inline Scalar Media Link',
            command: 'insertScalar2',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar5', {
            label: 'Insert Scalar Note',
            command: 'insertScalar5',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar6', {
            label: 'Insert Link to another Scalar Page',
            command: 'insertScalar6',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar7', {
            label: 'Insert External Link',
            command: 'insertScalar7',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar8', {
            label: 'Insert Scalar Widget Link',
            command: 'insertScalar8',
            toolbar: 'links'
        });
        CKEDITOR._scalar.editor.ui.addButton( 'Scalar9', {
            label: 'Insert Inline Scalar Widget Link',
            command: 'insertScalar9',
            toolbar: 'links'
        });

        CKEDITOR._scalar.editor.on('beforeGetData', function(e){
        	if(typeof CKEDITOR._scalar.editor.document == 'undefined') return;
        	var placeholders = CKEDITOR._scalar.editor.document.find('img.placeholder');
        	for(var i = 0; i < placeholders.count(); i++){
        		placeholders.getItem(i).remove();
        	}
		});
		CKEDITOR._scalar.editor.on('change', function(e){
    		if(CKEDITOR._scalar.editor.editable().isInline()){
    			$(CKEDITOR._scalar.editor.editable().$).find('.placeholder:not(.inline)').each(function(){
    				$link = $('a[data-linkid='+$(this).data('linkid')+']');
    				if($link.text().length <= 0 || !$link.is(':visible')){
    					$(this).remove();
    				}
    			});
    			return;
    		}
        	if(typeof CKEDITOR._scalar.editor.document == 'undefined') return;
        	var linked_placeholders = CKEDITOR._scalar.editor.document.find('img.linked.placeholder');
        	for(var i = 0; i < linked_placeholders.count(); i++){
        		var placeholder = linked_placeholders.getItem(i);
        		if($(placeholder.$).data('newlink')!==true){
	        		if($(placeholder.$).data('link') == null){
	        			var $link = $(CKEDITOR._scalar.editor.editable().$).find('a[data-index="'+$(placeholder.$).data('content')+'"]');
	        			if($link.is(':visible')){
	        				CKEDITOR._scalar.populatePlaceholderData();
	        				return;
	        			}
	        		}
	        		if(!$($(placeholder.$).data('link').$).is(':visible')){
	        			placeholder.remove();
	        		}
	        	}
        	}
		});
		CKEDITOR._scalar.editor.on( 'contentDom', CKEDITOR._scalar.populatePlaceholderData);
    },
    afterInit: function( editor ) {
    		if(editor.config.toolbar == "ScalarInline") return;
    		var placeholderContentPairs = [];
    		var updatePlaceholderIndicies = function(){
    			for(var i = 0; i < placeholderContentPairs.length; i++){
					placeholderContentPairs[i][0].attributes['data-content'] = placeholderContentPairs[i][1].getIndex();
					placeholderContentPairs[i][1].attributes['data-index'] = placeholderContentPairs[i][1].getIndex();
				}
    		}
			CKEDITOR._scalar.editor.dataProcessor.dataFilter.addRules( {
				elements: {
					'a' : function(element){
						if(element.attributes.resource || element.attributes['data-widget']){
							var placeholder = CKEDITOR._scalar.addNewPlaceholder(element);
	        				placeholderContentPairs.push([placeholder,element]);
	        				updatePlaceholderIndicies();
		        		}
	        			return element;
	        		}
	        	}
			} );
		    
		}
});