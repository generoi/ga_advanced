(function ($) {
  'use strict';

  Drupal.behaviors.gaAdvanced = {
    attach: function (context) {
      if (this.processed) return;
      this.processed = true;

      // Track scroll depth.
      $.scrollDepth();

      // Track facebook events
      if (FB && FB.Event) Drupal.gaEvents.attachFacebook();

      // Track colorbox links
      $(document)
        .on('click', 'a.colorbox-iframe', function () {
          event('Modla dialog', 'open', Drupal.googleanalytics.getPageUrl(this.href));
        })
        // Fivestar
        .on('click', '.fivestar-widget a', function () {
          event('Rate', $(this).text());
        });
    }
  };

  Drupal.gaEvents = Drupal.ga || {};

  Drupal.gaEvents.ga = function (type, args) {
    if (typeof ga !== 'undefined') window.ga.apply(window, ['send', type].concat(args));
    if (typeof _gaq !== 'undefined') window._gaq.push(['_track' + type.charAt(0).toUpperCase() + type.slice(1)].concat(args));
    if (window.DEBUG) console.log('track ' + type, args);
  };

  Drupal.gaEvents.event = function event() {
    var args = Array.prototype.slice.call(arguments);
    Drupal.gaEvents.ga('event', args);
  };

  Drupal.gaEvents.attachFacebook = function attachFacebook() {
    FB.Event.subscribe('edge.create', function (url) {
      Drupal.gaEvents.ga('social', 'facebook', 'like', Drupal.googleanalytics.getPageUrl(url));
    });
    FB.Event.subscribe('edge.remove', function (url) {
      Drupal.gaEvents.ga('social', 'facebook', 'unlike', Drupal.googleanalytics.getPageUrl(url));
    });
    FB.Event.subscribe('comment.create', function () {
      Drupal.gaEvents.ga('social', 'facebook', 'comment', Drupal.googleanalytics.getPageUrl(window.location.href));
    });
    FB.Event.subscribe('comment.delete', function () {
      Drupal.gaEvents.ga('social', 'facebook', 'uncomment', Drupal.googleanalytics.getPageUrl(window.location.href));
    });
    FB.Event.subscribe('message.send', function (url) {
      Drupal.gaEvents.ga('social', 'facebook', 'message', Drupal.googleanalytics.getPageUrl(url));
    });
  };
}(jQuery));
