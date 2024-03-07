export const generateAvatarColor = function () {
  let color = 'hsl(' + Math.random() * 360 + ', 25%, 65%)';
  return color;
};
