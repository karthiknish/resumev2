export const generateBG = (screenWidth, screenHeight, animated) => {
  var elemW;
  var width = window.innerWidth;
  if (width >= 1366) {
    elemW = 300;
  } else if (width >= 1000) {
    elemW = 250;
  } else if (width >= 800) {
    elemW = 220;
  } else if (width >= 600) {
    elemW = 200;
  } else {
    elemW = 150;
  }

  var elemProps = {
    gridSizeX: Math.round(screenWidth / (elemW - 100)),
    gridSizeY: Math.round(screenHeight / (elemW - 120)),
    resize: animated ? "square-anim" : "square-anim",
  };

  return elemProps;
};