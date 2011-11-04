/** @preserve
 *
 * Changed v1.0.0
 *  DOM Change events, the way they should've worked.
 *  http://azoffdesign.com/changed
 *
 * Intended for use with the latest jQuery
 *  http://code.jquery.com/jquery-latest.js
 *
 * Copyright 2011, Jonathan Azoff
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * For API documentation, see the README file
 *  http://azof.fr/qnNgUi
 *
 * Date: Sunday, September 11th, 2011
 */

(function($, fn, events){

    "use strict"; var

    /**
     * We'll take the top-level 'changed' event name, mainly because W3 didn't get
     * 'change' right, so no sense in trusting them now :)
     */
    eventName = 'changed',


    /**
     * The key used for storing data on DOM elements, data that is used for
     * the changed event
     */
    datakey = eventName + 'Data',

    /**
     * A list of radio buttons bound by the changed event, used to make sure that
     * we can capture the "unchecked" portion of a radio's change event
     */
    checked = {},

    /**
     * Gets the data object for this element, necessary for the changed event to
     * process the element state.
     */
    getdata = function(element) {
        var target = $(element),
        data = target.data(datakey) || {};
        target.data(datakey, data);
        return data;
    },

    /**
     * Get's the value of an element, only if it would appear in a form submission
     */
    getvalue = function(element) {
        var valid = !element.is('[type=radio],[type=checkbox]') || element.is(':checked');
        return valid ? element.val() : undefined;
    },

    /**
     * The handler used for elements that actually have a useful "change" event.
     * Ironic name, I know.
     */
    correctchange = function() {
        var $this = $(this),
        value = getvalue($this);
        $this.trigger(eventName, [value]);
    },

    /**
     * Called when a text-based input text actually changes, not after blur!
     */
    textchange = function() { var
        $this = $(this),
        data = getdata($this),
        value = getvalue($this);
        if (value !== data.value) {
            data.value = value;
            correctchange.call($this);
        }
    },

    /**
     * Properly handles the transition between radio checks, by ensuring the
     * last radio checked in the name group triggers an unchecked changed event
     */
    addcheckdata = function(target) { var
        container = target.closest('form,body'),
        data = getdata(container), existing,
        name = target.attr('name');
        if (name in data) {
            existing = data[name];
            correctchange.call(existing); // call the unchecked change
        }
        data[name] = target;
    },

    /**
     * Removes checked data from the container element
     */
    removecheckdata = function(target) { var
        container = target.closest('form,body'),
        data = getdata(container),
        name = target.attr('name');
        if (name in checked) {
            delete checked[name];
        }
    },

    /**
     * Called after a radio is checked or unchecked, not just on check!
     */
    radiochange = function() { var
        $this = $(this),
        data = getdata(this);
        addcheckdata($this);
        correctchange.call(this);
    },

    /**
     * Initializes the internal data object for the changeable element
     */
    setupdata = function(target) { var
        data = { events: 'change' };
        if(target.is('[type=checkbox],[type=hidden],select')) {
            data.handler = correctchange;
        } else if (target.is('[type=radio]')) {
            if (target.is(':checked')) { addcheckdata(target); }
            data.handler = radiochange;
        } else if (target.is('[type=text],[type=password],textarea')) {
            data.value = getvalue(target);
            data.events  = 'input paste keyup';
            data.handler = textchange;
        }
        target.data(datakey, data);
        return data;
    },

    /**
     * Clears the internal data object for the changeable element
     */
    teardowndata = function(target) {
        var data = getdata(target);
        if (target.is('[type=radio]:checked')) {
            removecheckdata(target);
        } target.removeData(datakey);
        return data;
    };

    /**
     * Expose the jQuery.fn.changed shorthand. i.e. $('selector').changed(callback);
     */
    fn[eventName] = function(data, handler) {
         if ($.isFunction(handler)) {
             this.on(eventName, null, data, handler);
         } else if ($.isFunction(data)) {
             this.on(eventName, data);
         }
     };

    /**
     * Create rules for jQuery's internal "special event" system.
     * @link http://benalman.com/news/2010/03/jquery-special-events/
     */
    events[eventName] = {

        /**
         * Called when a "changed" listener is first bound to an element. It
         * loads the data for that element, and binds the correct listener.
         */
        setup: function(){
            var $this = $(this), data = setupdata($this);
            $this.on(data.events, data.handler);
        },

        /**
         * Called when the changed handler is removed from this element. Does some
         * cleanup on the element's data, and removes any listeners.
         */
        teardown: function(){
            var $this = $(this), data = teardowndata($this);
            $this.off(data.events, data.handler);
        }

    };

})(jQuery, jQuery.fn, jQuery.event.special);