/**
 * Annotation
 * @author Matthias Laug <laug@lieferando.de
 * @since 06.03.2012
 */
(function($) {   
    
    /**
     * initial function to 
     *
     * @author Matthias Laug
     * @since 07.03.2012
     */
    $.fn.annotate = function() {
        
        $('.ml-annotation').hide();
        
        return this.each(function(){

            //put live click event on each element, which can be annotated
            $(this).live('mouseenter', function(){
                var annotation = $(this).attr('data-annotate');
                $(this).mask($('#ml-annotation-' + annotation).html()).toolbox();
            });
            
            $(this).live('mouseleave', function(){
                $(this).unmask();
            });

        });
    };
    
    /**
     * append a toolbox to the mask element
     *
     * @author Matthias Laug
     * @since 07.03.2012
     */
    $.fn.toolbox = function() {
        if ( $('#ml-annotate-toolbox',this).length == 0 ){
            this.append('<div class="ml-annotate-toolbox">\n\
                            <a class="ml-do-annotate ml-like">like</a>\n\
                            <a class="ml-do-annotate ml-dislike">dislike</a>\n\
                            <a class="ml-do-annotate ml-remove">remove</a>\n\
                            <a class="ml-do-annotate ml-comment">comment</a>\n\
                        </div>');
            
            $('.ml-do-annotate').live('click', function(){
                $(this).sendInformationToServer();
            });
        }      
    }
    
    $.fn.sendInformationToServer = function () {
        $.ajax({
            url : 'reporting.php',
            type : 'POST',
            dataType : 'json',
            success : function(){
                
            }
        });
    }
    
})(jQuery);

/**
 * Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com)
 * 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *  
 * Following code is based on Element.mask() implementation from ExtJS framework (http://extjs.com/)
 *
 */
;
(function($){
	
    /**
	 * Displays loading mask over selected element(s). Accepts both single and multiple selectors.
	 *
	 * @param label Text message that will be displayed on top of the mask besides a spinner (optional). 
	 * 				If not provided only mask will be displayed without a label or a spinner.  	
	 * @param delay Delay in milliseconds before element is masked (optional). If unmask() is called 
	 *              before the delay times out, no mask is displayed. This can be used to prevent unnecessary 
	 *              mask display for quick processes.   	
	 */
    $.fn.mask = function(label, delay){
        var maskedElement
        $(this).each(function() {
            maskedElement = $.maskElement($(this), label);
        });
        return maskedElement
    };
	
    /**
	 * Removes mask from the element(s). Accepts both single and multiple selectors.
	 */
    $.fn.unmask = function(){
        $(this).each(function() {
            $.unmaskElement($(this));
        });
    };
	
    /**
	 * Checks if a single element is masked. Returns false if mask is delayed or not displayed. 
	 */
    $.fn.isMasked = function(){
        return this.hasClass("masked");
    };

    $.maskElement = function(element, label){
	
        //if this element has delayed mask scheduled then remove it and display the new one
        if (element.data("_mask_timeout") !== undefined) {
            clearTimeout(element.data("_mask_timeout"));
            element.removeData("_mask_timeout");
        }

        if(element.isMasked()) {
            $.unmaskElement(element);
        }
		
        if(element.css("position") == "static") {
            element.addClass("masked-relative");
        }
		
        element.addClass("masked");
		
        var maskDiv = $('<div class="loadmask"></div>');
		
        //auto height fix for IE
        if(navigator.userAgent.toLowerCase().indexOf("msie") > -1){
            maskDiv.height(element.height() + parseInt(element.css("padding-top")) + parseInt(element.css("padding-bottom")));
            maskDiv.width(element.width() + parseInt(element.css("padding-left")) + parseInt(element.css("padding-right")));
        }
		
        //fix for z-index bug with selects in IE6
        if(navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
            element.find("select").addClass("masked-hidden");
        }
		
        element.append(maskDiv);
		
        if(label !== undefined) {
            var maskMsgDiv = $('<div class="loadmask-msg" style="display:none;"></div>');
            maskMsgDiv.append('<div>' + label + '</div>');
            element.append(maskMsgDiv);
			
            //calculate center position
            maskMsgDiv.css("top", Math.round(element.height() / 2 - (maskMsgDiv.height() - parseInt(maskMsgDiv.css("padding-top")) - parseInt(maskMsgDiv.css("padding-bottom"))) / 2)+"px");
            maskMsgDiv.css("left", Math.round(element.width() / 2 - (maskMsgDiv.width() - parseInt(maskMsgDiv.css("padding-left")) - parseInt(maskMsgDiv.css("padding-right"))) / 2)+"px");
			
            maskMsgDiv.show();
        }
        
        return maskDiv;
		
    };
	
    $.unmaskElement = function(element){
        //if this element has delayed mask scheduled then remove it
        if (element.data("_mask_timeout") !== undefined) {
            clearTimeout(element.data("_mask_timeout"));
            element.removeData("_mask_timeout");
        }
		
        element.find(".loadmask-msg,.loadmask").remove();
        element.removeClass("masked");
        element.removeClass("masked-relative");
        element.find("select").removeClass("masked-hidden");
    };
 
})(jQuery);