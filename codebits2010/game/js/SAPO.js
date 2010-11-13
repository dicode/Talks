/*global SAPO:true,window:true*/
if(typeof(SAPO) == 'undefined') {
    window.SAPO = {};
} else {
    window.SAPO = window.SAPO;
}

/**
 * @class SAPO
 */

/* {{{ SAPO.namespace() */
/**
 * @function {Object} SAPO.namespace Creates the SAPO namespace
 * @param {string} ns - namespace path
 * @return Object with SAPO namespace
 */
SAPO.namespace = function(ns) {

    if (!ns || !ns.length) {
        return null;
    }

    var levels = ns.split(".");
    var nsobj = SAPO;

    // SAPO is implied, so it is ignored if it is included
    for (var i=(levels[0] == "SAPO") ? 1 : 0; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }

    return nsobj;
};
/* }}} */

/** {{{ 
 * SAPO.extend() 
 */
/*
SAPO.extend = function(subclass, superclass) {
    var f = function() {};
    f.prototype = superclass.prototype;
    subclass.prototype = new f();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass.prototype;
    if (superclass.prototype.constructor == Object.prototype.constructor) {
        superclass.prototype.constructor = superclass;
    }
};
*/
/* }}} */

/* {{{ s$() */
/**
 * @function {DOMElement|Array} s$ Shortcut for document.getElementById
 * @param {string|Array} elementID|ArrayOfIDs Receives either an id or an
 * Array of id's
 * @return Either the DOM element for the given id or an array of elements
 * for the given ids
 */
function s$(element) 
{
    if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length; i < length; i++) {
            elements.push(s$(arguments[i]));
        }
        return elements;
    }
    if(typeof(element) == 'string') {
        element = document.getElementById(element);
    }
    return element;
}
/* }}} */

/* {{{ Function.bindObj() */
/**
 * @function {Function} bindObj Extends the native Function object.
 * Creates a delegate (callback) that sets the scope to obj. 
 * Call directly on any function. <br />Example: 
 * <code>this.myFunction.bindObj(this)</code> <br /> 
 * Will create a function that is automatically scoped to this.
 * @param {Object} obj The object for which the scope is set
 * @param {optional Array} args Overrides arguments for the call. 
 * (Defaults to the arguments passed by the caller)
 * @return The new function
 */
Function.prototype.bindObj = function() {

    if (arguments.length < 2 && arguments[0] === undefined) {
        return this;
    }
    var __method = this;
    var args = [];
    for(var i=0, total=arguments.length; i < total; i++) {
        args.push(arguments[i]);
    }
    var object = args.shift();

    return function() {
        return __method.apply(object, args.concat(function(tmpArgs){ 
                        var args2 = [];
                        for(var j=0, total=tmpArgs.length; j < total; j++) {
                            args2.push(tmpArgs[j]);
                        }
                        return args2;
                    }(arguments)));
    };

}; 

/* }}} */

/* {{{ Function.bindObjEvent() */
/**
 * @function {Function} bindObjEvent Extends the native Function object.
 * Creates a delegate (callback) that sets the scope to obj. 
 * Call directly on any function. <br />Example: 
 * <code>this.myFunction.bindObjEvent(this)</code> <br /> 
 * Will create a function that is automatically scoped to this.
 * @param {Object} event The default event 
 * @param {Object} obj The object for which the scope is set
 * @param {optional Array} args Overrides arguments for the call. 
 * (Defaults to the arguments passed by the caller)
 * @return The new function
 */
Function.prototype.bindObjEvent =  function() {
    var __method = this;
    var args = [];
    for(var i=0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    var object = args.shift();
    return function(event) {
        return __method.apply(object, [event || window.event].concat(args));
    };
};
/* }}} */

/** {{{ Object.extend() 
 *  **DEPRECATED**
 */
Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}; 
/* }}} */ 

 /* {{{ SAPO.extendObj() */
/**
 * @function {Object} ? Extends a given Object with a given set
 * of properties
 * @param {Object} destination - The original objecty
 * @param {Object} source - The new properties
 * @return The extended object
 */
SAPO.extendObj = function(destination, source) {
    for (var property in source) {
        if(source.hasOwnProperty(property)){
            destination[property] = source[property];
        }
    }
    return destination;
}; 
/* }}} */

/* {{{ SAPO.Browser */
/**
 * @class SAPO.Browser
 */
if(typeof(SAPO.Browser) == 'undefined') {

    SAPO.Browser = {
        /**
         * True if the browser is Internet Explorer
         * @var {boolean} ?
         */
        IE: false,

        /**
         * True if the browser is Gecko based
         * @var {boolean} ?
         */
        GECKO: false,

        /**
         * True if the browser is Opera
         * @var {boolean} ?
         */
        OPERA: false,

        /**
         * True if the browser is Safari
         * @var {boolean} ?
         */
        SAFARI: false, 

        /**
         * True if the browser is Konqueror
         * @var {boolean} ?
         */
        KONQUEROR: false, 

        /**
         * True if browser is Chrome
         * @var {boolean}
         */

        CHROME: false, 

        /**
         * The specific browser model
         * @var {string} ?
         */
        model: false, 

        /**
         * The browser version
         * @var {string} ?
         */
        version: false,

        /**
         * The user agent string
         * @var {string} ?
         */
        userAgent: false,

        /**
         * @function ? initialization function for the Browser object
         */
        init: function()
        {
            this.detectBrowser();
            this.setDimensions();
            this.setReferrer();
        }, 

        /**
         * @function ? Stores window dimensions
         */
        setDimensions: function()
        {
            //this.windowWidth=window.innerWidth !== null? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body !== null ? document.body.clientWidth : null;
            //this.windowHeight=window.innerHeight != null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null? document.body.clientHeight : null;
            var myWidth = 0, myHeight = 0;
            if( typeof( window.innerWidth ) == 'number' ) {
                myWidth = window.innerWidth;
                myHeight = window.innerHeight;
            } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                myWidth = document.documentElement.clientWidth;
                myHeight = document.documentElement.clientHeight;
            } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                myWidth = document.body.clientWidth;
                myHeight = document.body.clientHeight;
            }
            this.windowWidth = myWidth;
            this.windowHeight = myHeight;
        }, 

        /**
         * @function ? Stores the referrer
         */
        setReferrer: function()
        {
            this.referrer = document.referrer !== undefined? document.referrer.length > 0 ? escape(document.referrer) : false : false;
        },

        /**
         * @function ? Detects the browser and stores the found properties
         */
        detectBrowser: function()
        {
            var sAgent = navigator.userAgent;
            
            this.userAgent = sAgent;

            sAgent = sAgent.toLowerCase();

            if((new RegExp("applewebkit\/")).test(sAgent)) {

                if((new RegExp("chrome\/")).test(sAgent)) {
                    // 
                    // Chrome
                    //
                    this.CHROME = true;
                    this.model = 'chrome';
                    this.version = sAgent.replace(new RegExp("(.*)chrome\/([^\\s]+)(.*)"), "$2");
                } else {
                    //
                    // Safari
                    //
                    this.SAFARI = true;
                    this.model = 'safari';
                    this.version = sAgent.replace(new RegExp("(.*)applewebkit\/([^\\s]+)(.*)"), "$2");
                }
            } else if((new RegExp("opera")).test(sAgent)) {
                // 
                // Opera 
                //
                this.OPERA = true;
                this.model = 'opera';
                this.version = sAgent.replace(new RegExp("(.*)opera.([^\\s$]+)(.*)"), "$2");
            } else if((new RegExp("konqueror")).test(sAgent)) {
                // 
                // Konqueror
                //
                this.KONQUEROR = true;
                this.model = 'konqueror';
                this.version = sAgent.replace(new RegExp("(.*)konqueror\/([^;]+);(.*)"), "$2"); 
            } else if((new RegExp("msie\ ")).test(sAgent)) {
                // 
                // MSIE 
                //
                this.IE = true;
                this.model = 'ie';
                this.version = sAgent.replace(new RegExp("(.*)\\smsie\\s([^;]+);(.*)"), "$2");
            } else if((new RegExp("gecko")).test(sAgent)) {
                // 
                // GECKO 
                //
                // Supports only: 
                // Camino, Chimera, Epiphany, Minefield (firefox 3), Firefox, Firebird, Phoenix, Galeon, 
                // Iceweasel, K-Meleon, SeaMonkey, Netscape, Songbird, Sylera, 
                this.GECKO = true;
                var re = new RegExp("(camino|chimera|epiphany|minefield|firefox|firebird|phoenix|galeon|iceweasel|k\-meleon|seamonkey|netscape|songbird|sylera)");
                if(re.test(sAgent)) {
                    this.model = sAgent.match(re)[1];
                    this.version = sAgent.replace(new RegExp("(.*)"+this.model+"\/([^;\\s$]+)(.*)"), "$2");
                } else {
                    // probably is mozilla 
                    this.model = 'mozilla';
                    var reVersion = new RegExp("(.*)rv\:([^\)]+)(.*)");
                    if(reVersion.test(sAgent)) {
                        this.version = sAgent.replace(reVersion, "$2");
                    }
                }
            }
        }, 

        debug: function()
        {
            var str = "known browsers: (ie, gecko, opera, safari, konqueror) \n";
                str += [this.IE, this.GECKO, this.OPERA, this.SAFARI, this.KONQUEROR] +"\n";
                str += "model -> "+this.model+"\n";
                str += "version -> "+this.version+"\n";
                str += "\n";
                str += "original UA -> "+this.userAgent;

                alert(str);
        }
    };

    SAPO.Browser.init(); 

}
/* }}} */

/** {{{ SAPO.logReferer() 
 */
SAPO.logReferer = function(classURL) {


    /*
    var thisOptions = {
                s: (typeof(options) == 'object' && options['s']) ? options['s'] : 'js.sapo.pt',
                swakt: (typeof(options) == 'object' && options['swakt']) ? options['swakt'] : '59a97a5f-0924-3720-a62e-0c44d9ea4f16'
            }; 
    */

    var thisOptions = SAPO.extendObj({
                s:          'js.sapo.pt',
                swakt:      '59a97a5f-0924-3720-a62e-0c44d9ea4f16', 
                pg:         false,  // default will be classURL (arguments[0])
                swasection: false, // default will be classURL (arguments[0])
                swasubsection: '',
                dc:         '',
                ref:        false, 
                etype:      'libsapojs-view',
                swav:       '1',
                swauv:      '1', 
                bcs:        '1',
                bsr:        '1',
                bul:        '1',
                bje:        '1', 
                bfl:        '1',
                debug:      false
            }, arguments[1] || {}); 

    if(typeof(classURL) != 'undefined' && classURL != null) {

        if(!thisOptions.pg) {
            thisOptions.pg = classURL;
        }
        if(!thisOptions.swasection) {
            thisOptions.swasection = classURL;
        }
        if(!thisOptions.ref) {
            thisOptions.ref = location.href; 
        }

        var waURI = 'http://wa.sl.pt/wa.gif?';
        var waURISSL = 'https://ssl.sapo.pt/wa.sl.pt/wa.gif?';

        var aQuery = [
            'pg=' + encodeURIComponent(thisOptions.pg),
            'swasection=' + encodeURIComponent(thisOptions.swasection),
            'swasubsection=' + encodeURIComponent(thisOptions.swasubsection),
            'dc=' +  encodeURIComponent(thisOptions.dc),
            's=' + thisOptions.s,
            'ref=' + encodeURIComponent(thisOptions.ref),
            'swakt=' + thisOptions.swakt,
            'etype=' + encodeURIComponent(thisOptions.etype),
            'swav=' + encodeURIComponent(thisOptions.swav),
            'swauv=' + encodeURIComponent(thisOptions.swauv),
            'bcs=' + encodeURIComponent(thisOptions.bcs),
            'bsr=' + encodeURIComponent(thisOptions.bsr),
            'bul=' + encodeURIComponent(thisOptions.bul),
            'bje=' + encodeURIComponent(thisOptions.bje),
            'bfl=' + encodeURIComponent(thisOptions.bfl),
            ''
            ];

        if(location.protocol == 'https:') {
            var waLogURI = waURISSL;
        } else {
            var waLogURI = waURI;
        }

        var img = new Image();
        img.src = waLogURI+aQuery.join('&');
    }
}; 

/* }}} */

/** {{{ SAPO.require() 
 * @params: <object>
 *      object = [
 *          {
 *              url: 'url to load',  (/relative_sapo_path | http://absolute_url)
 *              check: object to check <optional>
 *          }
 *      ]
 *  OR 
 *      object = [
 *          <SAPO object 1> / <URI 1 string>,
 *          <SAPO object 2> / <URI 2 string>, 
 *          <SAPO object 3> > <URI 3 string>
 *      }
 *  OR
 *      object = [
 *          [<SAPO object 1>, <optional Version>],
 *          [<SAPO object 2>, <optional Version>],
 *          [<SAPO object 3>, <optional Version>]
 *      }
 * @params: <function> callBack
 */


/** {{{ SAPO._require(uri, callBack) PRIVATE 
 */
SAPO._require = function(uri, callBack)
{
    if(typeof(uri) != 'string') {
        return;
    }
    var script = document.createElement('script');

    var aHead = document.getElementsByTagName('HEAD'); 
    if(aHead.length > 0) {
        aHead[0].appendChild(script);
    }

    script.type = 'text/javascript'; 
    if(!document.attachEvent) {
        /* */
        script.onload = function(e) {
            if(typeof(callBack) != 'undefined') {
                callBack(); 
            }
        }; 

    } else {
        /* */
        script.onreadystatechange = function(e) {
            if(this.readyState == 'loaded') {
                if(typeof(callBack) != 'undefined') {
                    callBack(); 
                }
            }
        }; 
    }
    script.src = uri;

}; 
/* }}} */

SAPO.require = function(reqArray, callBack/*, async = false */) 
{
    var objectsToCheck = []; 
    var uriToAdd = []; 

    /** {{{ _isSAPOObject() 
     */
    var _isSAPOObject = function(param) {
        if(typeof(param) == 'string') {
            if(/^SAPO\./.test(param)) {
                return true;
            }
        }
        return false; 
    }; 
    /*}}} */

    /** {{{ _isObjectUri() 
     */
    var _isObjectUri = function(param) {
        if(typeof(param) == 'object' && param.constructor == Object) {
            if(typeof(param.uri) == 'string') {
                return true;
            }
        }
        return false;
    };
    /* }}} */ 

    /** {{{ _isObjectArray() 
     */
    var _isObjectArray = function(param) {
        if(typeof(param) == 'object' && param.constructor == Array) {
            return true;
        } 
        return false; 
    };
    /* }}} */

    /** {{{ _parseSAPOObject() 
     */
    var _parseSAPOObject = function(param) {

        var aSAPO = param.split('.');
        var sapoURI = aSAPO.join('/');
        sapoURI = 'http://js.sapo.pt/'+sapoURI+'/';

        return sapoURI;
    };
    /* }}} */

    /** {{{ _parseObjectUri() 
     */
    var _parseObjectUri = function(param) 
    {
        return param.uri; 
    };
    /* }}} */

    /** {{{ _objectEXists(objStr)
     */
    var _objectExists = function(objStr) {
        if(typeof(objStr) != 'undefined') {
            var aStrObj = objStr.split('.');
            var objParent = window;
            for(var k=0, aStrObjLength = aStrObj.length; k < aStrObjLength; k++) {
                if(typeof(objParent[aStrObj[k]]) != 'undefined') {
                    objParent = objParent[aStrObj[k]]; 
                } else {
                    return false; 
                }
            }

            return true; 
        }
    }; 
    /* }}} */

    /** {{{ requestRecursive() 
     */
    var requestRecursive = function() 
    {
        //console.log(uriToAdd);
        if(uriToAdd.length > 1) {
            SAPO._require(uriToAdd[0], requestRecursive);
            uriToAdd.splice(0,1);
        } else if(uriToAdd.length == 1) {
            if(typeof(callBack) != 'undefined') {
                SAPO._require(uriToAdd[0], callBack);
            } else {
                SAPO._require(uriToAdd[0]);
            }
            uriToAdd.splice(0,1);
        } else if(uriToAdd.length === 0){
            if(typeof(callBack) != 'undefined') {
                callBack(); 
            }
        }

    }; 
    /* }}} */

    if(typeof(reqArray) != 'undefined') {

        var cur = false; 

        var curURI = false; 

        if(typeof(reqArray) == 'string') {
            if(_isSAPOObject(reqArray)) {
                if(!_objectExists(reqArray)) {
                    uriToAdd.push(_parseSAPOObject(reqArray));
                }
            } else {
                uriToAdd.push(reqArray);
            }
        } else {
            for(var i=0, reqArrayLength=reqArray.length; i < reqArrayLength; i++) {
                cur = reqArray[i]; 
                if(_isSAPOObject(cur)) {
                    if(!_objectExists(cur)) {
                        objectsToCheck.push(cur); 
                        uriToAdd.push(_parseSAPOObject(cur));
                    }
                } else if(_isObjectArray(cur)) { 
                    if(cur.length > 0) {
                        if(_isSAPOObject(cur[0])) {
                            if(!_objectExists(cur[0])) {
                                if(cur.length === 2) {
                                    uriToAdd.push(_parseSAPOObject(cur[0])+cur[1]+'/');
                                } else {
                                    uriToAdd.push(_parseSAPOObject(cur[0]));
                                }
                            }
                        }
                    }
                } else {
                    if(typeof(cur) == 'string') {
                        uriToAdd.push(cur);
                    } else {
                        if(_isObjectUri(cur)) {
                            if(typeof(cur.check) == 'string') {
                                if(!_objectExists(cur.check)) {
                                    uriToAdd.push(_parseObjectUri(cur));
                                }
                            } else {
                                uriToAdd.push(_parseObjectUri(cur));
                            }
                        }
                    }
                }
            }
        }

        if(arguments.length == 3) {
            if(typeof(arguments[2]) == 'boolean') {
                if(arguments[2] === true) {
                    for(var l=0, uriToAddLength=uriToAdd.length; l < uriToAddLength; l++) {
                        SAPO._require(uriToAdd[l]);
                    }
                    if(typeof(callBack) != 'undefined') {
                        callBack(); 
                    }
                    return;
                }
            }
            requestRecursive();
        } else {
            requestRecursive();
        }

    }

};

/* }}} */


