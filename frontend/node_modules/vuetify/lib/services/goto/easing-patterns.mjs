// linear
export const linear = t => t;
// accelerating from zero velocity
export const easeInQuad = t => t ** 2;
// decelerating to zero velocity
export const easeOutQuad = t => t * (2 - t);
// acceleration until halfway, then deceleration
export const easeInOutQuad = t => t < 0.5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t;
// accelerating from zero velocity
export const easeInCubic = t => t ** 3;
// decelerating to zero velocity
export const easeOutCubic = t => --t ** 3 + 1;
// acceleration until halfway, then deceleration
export const easeInOutCubic = t => t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// accelerating from zero velocity
export const easeInQuart = t => t ** 4;
// decelerating to zero velocity
export const easeOutQuart = t => 1 - --t ** 4;
// acceleration until halfway, then deceleration
export const easeInOutQuart = t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
// accelerating from zero velocity
export const easeInQuint = t => t ** 5;
// decelerating to zero velocity
export const easeOutQuint = t => 1 + --t ** 5;
// acceleration until halfway, then deceleration
export const easeInOutQuint = t => t < 0.5 ? 16 * t ** 5 : 1 + 16 * --t ** 5;
//# sourceMappingURL=easing-patterns.mjs.map