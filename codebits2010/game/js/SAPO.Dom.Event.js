/*global SAPO:true, s$:true, window:true */
if(!SAPO.Dom || typeof(SAPO.Dom) == 'undefined') {
    SAPO.namespace('Dom');
}
/**
 * @class SAPO.Dom.Event 
 *
 * <strong>requires</strong> {@link SAPO}
 */
SAPO.Dom.Event = {

    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45, 


    /**
     * @function {DOMElement} ?
     * @param {Object} ev - event object
     * @return the first element on the given event
     */
    element: function(ev)
    {
        var node;
        if(ev.srcElement) {
            node = ev.srcElement; 
        } else {
            node = ev.target; 
        }
        if(node.nodeType == 3) {
            return node.parentNode;
        } else {
            return node; 
        }
    }, 

    /**
     * @function {DOMElement} ?
     * @param {Object} ev - event object
     * @param {String} elmTagName - tag name to find
     * @param {Boolean} force - force the return of the wanted type of tag,
     * or false otherwise
     * @return the first element which matches given tag name or the
     * document element if the wanted tag is not found
     */
    findElement: function(ev, elmTagName, force) 
    {
        var node = this.element(ev); 
        while(true) {
            if(node.nodeName.toLowerCase() === elmTagName.toLowerCase()) {
                return node;
            } else {
                node = node.parentNode; 
                if(!node.parentNode){
                    if(force){ return false; }
                    return document;
                }
            }
        }
    }, 


    /**
     * @function ? Dispatch an event to element
     * @param {DOMElement|String} element - element id or element
     * @param {String} eventName - event name 
     * @param {Object} memo - metadata for the event 
     */
    fire: function(element, eventName, memo)
    {
        element = s$(element);
        var ev, nativeEvents;
        if(document.createEvent){
            nativeEvents = {
                "DOMActivate": true, "DOMFocusIn": true, "DOMFocusOut": true,
                "focus": true, "focusin": true, "focusout": true,
                "blur": true, "load": true, "unload": true, "abort": true,
                "error": true, "select": true, "change": true, "submit": true,
                "reset": true, "resize": true, "scroll": true,
                "click": true, "dblclick": true, "mousedown": true,
                "mouseenter": true, "mouseleave": true, "mousemove": true, "mouseover": true,
                "mouseout": true, "mouseup": true, "mousewheel": true, "wheel": true,
                "textInput": true, "keydown": true, "keypress": true, "keyup": true,
                "compositionstart": true, "compositionupdate": true, "compositionend": true,
                "DOMSubtreeModified": true, "DOMNodeInserted": true, "DOMNodeRemoved": true,
                "DOMNodeInsertedIntoDocument": true, "DOMNodeRemovedFromDocument": true,
                "DOMAttrModified": true, "DOMCharacterDataModified": true,
                "DOMAttributeNameChanged": true, "DOMElementNameChanged": true
            };
        } else {
            nativeEvents = {
                "onabort": true, "onactivate": true, "onafterprint": true, "onafterupdate": true,
                "onbeforeactivate": true, "onbeforecopy": true, "onbeforecut": true,
                "onbeforedeactivate": true, "onbeforeeditfocus": true, "onbeforepaste": true,
                "onbeforeprint": true, "onbeforeunload": true, "onbeforeupdate": true, "onblur": true,
                "onbounce": true, "oncellchange": true, "onchange": true, "onclick": true,
                "oncontextmenu": true, "oncontrolselect": true, "oncopy": true, "oncut": true,
                "ondataavailable": true, "ondatasetchanged": true, "ondatasetcomplete": true,
                "ondblclick": true, "ondeactivate": true, "ondrag": true, "ondragend": true,
                "ondragenter": true, "ondragleave": true, "ondragover": true, "ondragstart": true,
                "ondrop": true, "onerror": true, "onerrorupdate": true,
                "onfilterchange": true, "onfinish": true, "onfocus": true, "onfocusin": true,
                "onfocusout": true, "onhashchange": true, "onhelp": true, "onkeydown": true,
                "onkeypress": true, "onkeyup": true, "onlayoutcomplete": true,
                "onload": true, "onlosecapture": true, "onmessage": true, "onmousedown": true,
                "onmouseenter": true, "onmouseleave": true, "onmousemove": true, "onmouseout": true,
                "onmouseover": true, "onmouseup": true, "onmousewheel": true, "onmove": true,
                "onmoveend": true, "onmovestart": true, "onoffline": true, "ononline": true,
                "onpage": true, "onpaste": true, "onprogress": true, "onpropertychange": true,
                "onreadystatechange": true, "onreset": true, "onresize": true,
                "onresizeend": true, "onresizestart": true, "onrowenter": true, "onrowexit": true,
                "onrowsdelete": true, "onrowsinserted": true, "onscroll": true, "onselect": true,
                "onselectionchange": true, "onselectstart": true, "onstart": true,
                "onstop": true, "onstorage": true, "onstoragecommit": true, "onsubmit": true,
                "ontimeout": true, "onunload": true
            };
        }


        if(element !== null){
            if (element == document && document.createEvent && !element.dispatchEvent) {
                element = document.documentElement;
            }

            if (document.createEvent) {
                ev = document.createEvent("HTMLEvents");
                if(typeof nativeEvents[eventName] === "undefined"){
                    ev.initEvent("dataavailable", true, true);
                } else {
                    ev.initEvent(eventName, true, true);
                }

            } else {
                ev = document.createEventObject();
                if(typeof nativeEvents["on"+eventName] === "undefined"){
                    ev.eventType = "ondataavailable";
                } else {
                    ev.eventType = "on"+eventName;
                }
            }

            ev.eventName = eventName;
            ev.memo = memo || { };

            if (document.createEvent) {
                element.dispatchEvent(ev);
            } else {
                element.fireEvent(ev.eventType, ev);
            }

            return ev;
        }
    },

    /**
     * @function ? Attach an event to element
     * @param {DOMElement|String} element - element id or element
     * @param {String} eventName - event name 
     * @param {Function} callBack - Receives event object as a
     * parameter. If you're manually firing custom events, check the 
     * eventName property of the event object to make sure you're handling
     * the right event.
     */
    observe: function(element, eventName, callBack) 
    {
        element = s$(element);
        if(element !== null) {
            if(eventName.indexOf(':') != -1) {
                eventName = 'dataavailable';
            }

            if(element.addEventListener) {
                element.addEventListener(eventName, callBack, false);
            } else {
                element.attachEvent('on' + eventName, callBack);
            }
        }
    }, 

    /**
     * @function ? Remove an event attached to an element 
     * @param {DOMElement|String} element - element id or element
     * @param {String} eventName - event name 
     * @param {Function} callBack - callback function 
     */
    stopObserving: function(element, eventName, callBack) 
    {
        element = s$(element);

        if(element !== null) {
            if(element.removeEventListener) {
                element.removeEventListener(eventName, callBack, false);
            } else {
                element.detachEvent('on' + eventName, callBack);
            }
        }
    },

    /**
     * @function ? stops event propagation and bubbling
     * @param {Object} event - event handle 
     */
    stop: function(event)
    {
        if(event.cancelBubble !== null) {
            event.cancelBubble = true;
        }
        if(event.stopPropagation) {
            event.stopPropagation(); 
        }
        if(event.preventDefault) {
            event.preventDefault(); 
        }
        if(window.event) {
            event.returnValue = false; 
        }
        if(event.cancel !== null) {
            event.cancel = true; 
        }
    }, 

    /**
     * @function {Object} ?
     * @param {Object} ev - event object
     * @return an object with the mouse X and Y position 
     */
    pointer: function(ev)
    {
        return {
                x: ev.pageX || (ev.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
                y: ev.pageY || (ev.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) 
        };
    },

    /**
     * @function {Number} ?
     * @param {Object} ev - event object
     * @return mouse X position 
     */
    pointerX: function(ev)
    {
        return this.pointer(ev).x;
    }, 

    /**
     * @function {Number} ?
     * @param {Object} ev - event object
     * @return mouse Y position
     */
    pointerY: function(ev) 
    {
        return this.pointer(ev).y;
    }, 




    debug: function(){}
};

