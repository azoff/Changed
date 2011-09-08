// http://benalman.com/news/2010/03/jquery-special-events/#introduction
(function($, fn, events){ var 
    
    eventName = 'changed',
    
    datakey = eventName + 'Data';
    
    fn[eventName] = shorthand;
    
    events[eventName] = {
        setup: setup,
        teardown: teardown
    };
    
    function shorthand(data, handler) {
        if ($.isFunction(handler)) {
            this.bind(eventName, data, handler);
        } else if ($.isFunction(data)) {
            this.bind(eventName, data);
        }
    }
    
    function setup() { var 
        $this = $(this),
        data = getdata($this);
        $this.data(datakey, data);
        $this.bind(data.events, data.handler);
    }
    
    function teardown() { var 
        $this = $(this),
        data = getdata($this);
        $this.removeData(datakey);
        $this.unbind(data.events, data.handler);
    }
    
    function getdata(target) {
        var data = target.data(datakey);
        if (!data) { data = {};
            switch(true) {
                case target.is('[type=text],textarea'):
                    data.events  = 'input paste keyup';
                    data.handler = textchange;
                    data.value = target.val();
                    break;
                case target.is('[type=radio],[type=checkbox]'):
                    data.events  = 'change';
                    data.handler = checkchange;
                    break;
                case target.is('select'):
                    data.events  = 'change';
                    data.handler = selectchange;
                    break;
            }
            target.data(datakey, data);
        }
        return data;
    }
    
    function textchange() { var
        $this = $(this),
        data = getdata($this),
        value = $this.val();
        if (value !== data.value) {
            data.value = value;
            $this.data(datakey, data);
            $this.trigger(eventName, [data.value]);
        }
    }
    
    function checkchange() { var 
        $this = $(this),
        value = $this.prop('checked') ? $this.val() : undefined;
        $this.trigger(eventName, [value]);
    }
    
    function selectchange() {
        var $this = $(this);
        $this.trigger(eventName, [$this.val()]);
    }
    
})(jQuery, jQuery.fn, jQuery.event.special);