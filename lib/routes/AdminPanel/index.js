import requireAuth from '../../utils/requireAuth';
module.exports = {
  path: 'course/admin',
  onEnter:requireAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./AdminPanel'));
    });
  }
};
