(function() {

var galaxysim = window.galaxysim = window.galaxysim || {};

galaxysim.LIGHT_YEAR = 9.4607 * Math.pow(10, 15);
galaxysim.MILKY_WAY_DIAMETER = 140 * 1000 * galaxysim.LIGHT_YEAR;
galaxysim.UNIVERSE_SCALE = 1000 / galaxysim.MILKY_WAY_DIAMETER;
galaxysim.UNIVERSE_SCALE_RECIPROCAL = 1.0 / galaxysim.UNIVERSE_SCALE;
galaxysim.LIGHT_YEAR_SCALED = galaxysim.LIGHT_YEAR * galaxysim.UNIVERSE_SCALE;
galaxysim.LIGHT_SPEED = 299792458;
galaxysim.LIGHT_SPEED_SCALED = galaxysim.LIGHT_SPEED * galaxysim.UNIVERSE_SCALE;
galaxysim.LIGHT_SPEED_SCALED_SQRD = galaxysim.LIGHT_SPEED_SCALED * galaxysim.LIGHT_SPEED_SCALED;
galaxysim.G = 6.673e-11;
galaxysim.G_SCALE = 0.5;
galaxysim.GRAVITATIONAL_CONSTANT = galaxysim.G_SCALE  * galaxysim.G;
galaxysim.GRAVITY_EPSILON = 3*Math.pow(10, 19);
galaxysim.TYPICAL_STAR_MASS = 2 * Math.pow(10, 30);

galaxysim.NUMBLACKHOLES = 1;    
galaxysim.BODYCOUNT = 500;
galaxysim.BODYCOUNT_VFX = 20000;
galaxysim.BODYCOUNT_GAS = 450;

})();
