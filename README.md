Changed v1.0.0
=================
Tuesday, August 23rd 2011

Homepage: <http://azoffdesign.com/changed>

Changed is a jQuery Plugin that extends [jQuery's special events](http://benalman.com/news/2010/03/jquery-special-events/) to include support for a simulated "DOM Changed" event. The Changed event is a custom event that attempts to address two annoying inadequacies with the existing [DOM Change event](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-htmlevents):

1) DOM change, as [defined by the specification](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-htmlevents), says that change should only be triggered "when a control loses the input focus and its value has been modified since gaining focus". However, in the context of forms, this triggering criteria does not efficiently indicate the exact point at which the submitted form state has changed. 

For instance, consider a text input with an existing value of "aaa". If you were to type into this text input and change it's value to "bbb", you would not be able to detect this change until focus is lost (aka blur). Considering that most forms can be submitted using a carriage return, it's even conceivable that the form could be submitted without ever actually running the change handler before submission! But, even if you stick to the blur event as a reasonable criteria for DOM Change, consider that radio buttons don't ever trigger a DOM Change event when they are blurred and unchecked!

Now, to be fair, DOM Change doesn't *necessarily* promise any improvements to form state parsing, but this practical application illustrates it's relative uselessness in this context. Hence, the developer is often forced to write "boilerplate" code to support normalizing form input handlers. In this example, the boilerplate may look like a DOM Keyup hander, a handler which is triggered when the input changes the form's state.

In the jQuery spirit of "Write Less, Do More", Changed aims to solve this problem by providing this boilerplate for you, with
little hassle. Simply bind an event listener to the "changed" event using jQuery - the handler will then be accurately called on form state change until the element is removed from the DOM or the event is unbound.

2) The second problem, has less to do with DOM Change, and more to do with its default handler. In jQuery, the handler is passed
an event object, and is executed in the context of of the changed element. Referring back to our example in the first bullet, the event handler for DOM Change would let you get current text input value, via `event.target.value` or `this.value`. Not only are multiple property references slow, but the value itself is almost useless unless it is actually going to be submitted with the form. Hence, the developer is once again forced to write boilerplate code, ensuring that the input is actually qualified for submission before including it in the aggregate form state. For instance, this boilerplate may look like a validation around the checked property of a checkbox input.

Once again, Changed attempts to address this issue by passing in a non-standard second argument into the event handler. This value is a string containing the current form state for the Changed element. If the element is unqualified - not applicable for form submission - this value will be undefined. With this capability, you can now manage form state when the change happens without extra handlers or parsing with jQuery.
 
License
-------
Copyright 2011, Jonathan Azoff

Dual licensed under the MIT or GPL Version 2 licenses.

<http://jquery.org/license>

Usage
-----
```javascript
target.changed([ data ,] callback);         // shorthand
target.bind('changed', [ data ,] callback); // standard event binding
target.live('changed', [ data ,] callback); // using event delegation
```

+ `element:jQuery`
    The matched element(s) that will be monitored for future 'changed' events

+ `data:Object` `*optional*`
    An optional map of data to be exposed internally in the event handler, exposed as `event.data`

+ `callback`
    A handler function for 'changed' events. The function is passed two arguments, an event object and
    a string value of `element`. If `element`s value would not be passed in a regular form submission,
    then this value will be undefined

Example
------
In this example, we match all `<input>` elements, and bind a 'changed' event handler to them. The event
handler is passed the event object itself, plus the current qualified value of the element. If the element
is unqualified, i.e. it would not be submitted in a form submission, then the value will be undefined.

```javascript
$('input').changed("I'm data!", function(event, value){
    console.log(
        event.data, // "I'm data!" is passed here
        this,       // this is the element that changed
        value       // this will be the value of the changed element (if qualified)
    );
});
```

Submitting Bug Reports
----------------------
File all bug reports on the official [Issue Tracker](./issues), and all send complaints to `/dev/null`

Change Log
----------
 * __1.0.0__
  - Out of the gate, hurrah!