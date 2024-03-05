exports.generateAvatarColor = function () {
  color = 'hsl(' + Math.random() * 360 + ', 25%, 65%)';
  return color;
};

exports.isBoolean = (text) =>
  typeof text === Boolean || text === 'false' || text === 'true';

exports.isTrue = (text) => text === true || text === 'true';
