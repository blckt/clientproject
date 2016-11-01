import requireAuth from '../../utils/requireAuth';
import './style.scss';

module.exports = {
  path: 'ide/:id',
  onEnter:requireAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/ide'));
    });
  }
};
