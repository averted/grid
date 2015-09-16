'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Notifcation service.
 */
var Notification = {
  id: 'grid-notifications',
  'class': 'alert',

  render: function render(options) {
    var el = document.getElementById(this.id),
        node = document.createElement('div');

    node.className += this['class'] + ' ' + options.type;
    node.innerHTML = '' + options.msg;

    el.insertBefore(node, el.firstChild);

    return this.setDuration();
  },

  setDuration: function setDuration(time) {
    return setTimeout(function () {
      Notification.removeAlert();
    }, time || 3000);
  },

  removeAlert: function removeAlert() {
    var lastAlert = _lodash2['default'].last(document.getElementsByClassName(this['class']));

    return document.getElementById(this.id).removeChild(lastAlert);
  }
};

exports['default'] = Notification;
module.exports = exports['default'];