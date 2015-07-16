/**
 * Notifcation service.
 */
var Notification = {
  id: '.grid-notifications',
  classList: [ 'error', 'success' ],

  render(options) {
    return $(this.id).text(options.msg).removeClass(this.classList).addClass(options.type);
  }
};

export default Notification;
