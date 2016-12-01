/********
Utilities
********/

var randomRange = function(min, max){
	return min + Math.random() * (max-min);
}

var randomRangeInt = function(min, max){
	return min + Math.floor( Math.random() * (max-min) );
}

/**********************************************
Fonction de ease-in-ease-out,ou:
t = la valeur actuelle (tmps, coord, etc..)
b = la valeur de depart
c = la valeur max de sortie
d = la valeur total (tmps total, tte coord, ...)
**********************************************/
Math.easeInOut = function ( t, b, c, d ){
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
}

Math.easeOutQuad = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};

Math.easeOutSine = function (t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
};

Math.linearTween = function (t, b, c, d) {
	return c*t/d + b;
};

Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

/***********************************
Simple fonction de produit en croix
a = la valeur max de sortie
b = la valeur max initial
c = la valeur que l'on veut modifier
***********************************/
Math.linearNormal = function( a, b, c){
	return a/b * c;
}