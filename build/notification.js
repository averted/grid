/**
 * Notifcation service.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
    var alerts = document.getElementsByClassName(this['class']),
        lastAlert = alerts[alerts.length - 1],
        notifications = document.getElementById(this.id);

    notifications.removeChild(lastAlert);
  }
};

exports['default'] = Notification;
module.exports = exports['default'];