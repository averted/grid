import _ from 'lodash';

/**
 * Notifcation service.
 */
var Notification = {
  id: 'grid-notifications',
  class: 'alert',

  render(options) {
    var el   = document.getElementById(this.id)
      , node = document.createElement('div');

    node.className += `${this.class} ${options.type}`;
    node.innerHTML = `${options.msg}`;

    el.insertBefore(node, el.firstChild);

    return this.setDuration();
  },

  setDuration(time) {
    return setTimeout(function() {
      Notification.removeAlert();
    }, time || 3000);
  },

  removeAlert() {
    var lastAlert = _.last(document.getElementsByClassName(this.class));

    return document.getElementById(this.id).removeChild(lastAlert);
  }
};

export default Notification;
