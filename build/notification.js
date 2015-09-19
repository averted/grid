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
        node = document.createElement('div'),
        msg = document.createElement('span'),
        title = document.createElement('span');

    node.className = this['class'];
    title.className = 'title';
    msg.className = 'msg';

    title.innerHTML = options.type.charAt(0).toUpperCase() + options.type.slice(1);
    msg.innerHTML = options.msg;

    node.appendChild(title);
    node.appendChild(msg);
    el.insertBefore(node, el.firstChild);

    setTimeout(function () {
      node.className += ' ' + options.type;
    }, 100);

    return this.setDuration();
  },

  setDuration: function setDuration(time) {
    return setTimeout(function () {
      Notification.removeAlert();
    }, time || 4000);
  },

  removeAlert: function removeAlert() {
    var lastAlert = _lodash2['default'].last(document.getElementsByClassName(this['class'])),
        notifications = document.getElementById(this.id);

    notifications.removeChild(lastAlert);
  }
};

exports['default'] = Notification;
module.exports = exports['default'];