const expressAsyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.expressAsyncHandler = expressAsyncHandler;
