/*! ** GOB.mx - Grafica Base v3.0.0 */
//  ** ultima modificacion: '21-05-2020';

'use strict';

function _addEvent(e, evt, handler) {
    if (typeof handler !== 'function')
        return;

    if (e.addEventListener)
        e.addEventListener(evt, handler, false);
    else if (e.attachEvent)
        e.attachEvent("on" + evt, handler);
    else {
        var oldHandler = e["on" + evt];
    }
}
var _events = ["ready"];
var _myLib = function(item) {
    function eventWorker(item, event) {
        this.add = function(handler) {
            _addEvent(item, event, handler);
        };
    }
    for (var i = 0; i < _events.length; i++)
        this[_events[i]] = (new eventWorker(item, _events[i])).add;
};
var $gmx = function(item) {
    return new _myLib(item);
};
// Custom event for ready gobmx-framework
(function() {
    var root = './';
    var path = root + 'assets/';
    var imagesPath = path + 'images/';
    var scriptsPath = path + 'scripts/';
    var stylesPath = path + 'styles/';
    // ruta para los js del cdn
    var scriptsCDNPath = 'https://framework-gb.cdn.gob.mx/gm/v4/js/';
    var scriptsCDNPathQA = 'https://framework-gb.cdn.gob.mx/gm/v4/qa/js/jquery-ui-datepicker.js'

    // se revisa que no exista Modernizr primero para cargarlo al DOM, para despuÃ©s mandar a llamar la funcion de carga de scripts.
    if (!window.Modernizr) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptsCDNPathQA + 'modernizr.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    // Carga de pace
    var pace = document.createElement('script');
    pace.type = 'text/javascript';
    pace.src = scriptsCDNPathQA + 'pace.min.js';
    document.getElementsByTagName('head')[0].appendChild(pace);

    if (!window.jQuery) {
        // Cargar de jQuery
        var jq = document.createElement('script');
        jq.type = 'text/javascript';
        jq.src = scriptsCDNPathQA + 'jquery.min.js';
        document.getElementsByTagName('body')[0].appendChild(jq);
    }

    // Espera a que jquery sea cargadp
    setTimeout(function() {
        // Carga de bootstrap
        //carga archivo con scripts necesarios para bootstrap 4, incluyendo bootstrap.min.js
        var allScripts = document.createElement('script');
        allScripts.type = 'text/javascript';
        allScripts.src = scriptsCDNPathQA + 'bootstrapV4.min.js';
        document.getElementsByTagName('body')[0].appendChild(allScripts);


    }, 400)
})();