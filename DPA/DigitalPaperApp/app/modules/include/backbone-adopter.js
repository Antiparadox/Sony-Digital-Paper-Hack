//     Backbone.js Adopter
// 
//     This file is just a adopter for Backbone.Events to be used in
//     TypeScript 1.8 context.
// 
//     TypeScript 1.8 requires constructor() being defined in JS in
//     order to inherit JS class. But original Backbone.Events does
//     not have constructor. This fils add another
//     Backbone.EventsAdopter that adding constructor to
//     Backbone.Events.
//
//
//     Factory part is got from original Backbone.js easy to be
//     adopterd in other environment. Below is the license for it.
//
//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports', 'backbone'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone.EventsAdopter = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone.EventsAdopter = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root, EventsAdopter, _, $) {


  EventsAdopter = function() {
  };

  _.extend(EventsAdopter.prototype, root.Backbone.Events);
  // _.extend(EventsAdopter, root.Backbone.Events);

  
  return EventsAdopter;
});
