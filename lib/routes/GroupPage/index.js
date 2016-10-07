import requireAuth from '../../utils/requireAuth';
module.exports = {
  path: 'group/:id',
  onEnter:requireAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./GroupPage'));
    });
  }
};
