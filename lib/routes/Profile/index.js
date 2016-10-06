module.exports = {
  path: 'student/{studentId}',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ProfileInfo'));
    });
  }
};
