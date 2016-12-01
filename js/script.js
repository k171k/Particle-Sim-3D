window.onload = function(){
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	scene.fog = new THREE.FogExp2( 0x000000, 0.001);
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;


	var nbrPart = 100000,
	partSyst = [],
	area = 100;

	var AreaProp = { globalArea : 100, minSpeed: 0, maxSpeed: .1, gravityX: 0, gravityY: 0, gravityZ: 0, emitSize: 100, emitPosX: 0, emitPosY: 0, emitPosZ: 0 };
	
	var geometry = new THREE.Geometry();
	var material = 	new THREE.PointsMaterial( { vertexColors: THREE.VertexColors, blending: THREE.NormalBlending, transparent: true, sizeAttenuation: false, size: 2 });

	function generatePart(){
		for( var i = 0; i < nbrPart; i++){

			var _X = randomRange(-AreaProp.emitSize,AreaProp.emitSize);
			var _Y = randomRange(-AreaProp.emitSize,AreaProp.emitSize);
			var _Z = randomRange(-AreaProp.emitSize,AreaProp.emitSize);

			// var D = 1 / Math.sqrt( _X*_X + _Y*_Y + _Z*_Z );
			// var radius = randomRange(0,AreaProp.emitSize);
			// _X *= D*radius; 
			// _Y *= D*radius;
			// _Z *= D*radius;

			_X += AreaProp.emitPosX;
			_Y += AreaProp.emitPosY;
			_Z += AreaProp.emitPosZ;

			//var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( _X,  _Y, _Z ) );
			geometry.colors.push( new THREE.Color( Math.random(), Math.random(), Math.random() ) );

			var speed = randomRange(AreaProp.minSpeed, AreaProp.maxSpeed);
			var dirX = randomRange(-1,1);
			var dirY = randomRange( -1,1);
			var dirZ = randomRange(-1,1);
			partSyst.push( { vitesse:speed, direction : { x:dirX , y:dirY , z:dirZ } , acceleration : { x:0 , y:0 , z:0 }, speedLimit : 1 });
		}

		var particle = new THREE.Points( geometry, material);
		scene.add(particle);
	}

	//Fonction qui renvoie la particule qui depasse l'aire de jeux.
	function invisibleWall( newPos ){		
		if( newPos < AreaProp.globalArea && newPos > -AreaProp.globalArea ){
			return newPos;
		}else if( newPos >= AreaProp.globalArea ){
			return newPos-AreaProp.globalArea*2;
		}else if( newPos <= -AreaProp.globalArea ){
			return newPos+AreaProp.globalArea*2;
		}
	}

	var countAccel = 0;
	function partVelocity(){
		countAccel++;
		for(var i = 0; i < nbrPart; i++){
			if( countAccel <= 10 ){
				var accX = partSyst[i].vitesse*partSyst[i].direction.x ;
				var accY = partSyst[i].vitesse*partSyst[i].direction.y ;
				var accZ = partSyst[i].vitesse*partSyst[i].direction.z ;

				partSyst[i].acceleration.x += accX;
				partSyst[i].acceleration.y += accY;
				partSyst[i].acceleration.z += accZ;
			}
		}
	}

	var BlackHole = { _X: 0, _Y: 0, _Z: 0, size: 10 };
	noise.seed( Math.random() );
	function blackHole(){
		var bhX = 0;
		var bhY = 0;
		var bhZ = 0;
		var bhSize = BlackHole.size;
		var bhInfluence = (bhSize*bhSize) * (bhSize*bhSize);
		countFrame++;
		var noiseG = 981;
		for(var i = 0; i < nbrPart; i++){
			var PosX = scene.children[0].geometry.vertices[i].x;
			var PosY = scene.children[0].geometry.vertices[i].y;
			var PosZ = scene.children[0].geometry.vertices[i].z;

			var dist = PosX*PosX + PosY*PosY + PosZ*PosZ;
			var newDist = dist / bhInfluence;
			if( dist < bhSize ){
				scene.children[0].geometry.vertices[i].x = 0;
				scene.children[0].geometry.vertices[i].y =	0;
				scene.children[0].geometry.vertices[i].z =	0;
				scene.children[0].geometry.colors[i].r = 0;
				scene.children[0].geometry.colors[i].g = 0;
				scene.children[0].geometry.colors[i].b = 0;
			}else{
				if( dist > bhInfluence ){
					scene.children[0].geometry.vertices[i].x += partSyst[i].acceleration.x;
					scene.children[0].geometry.vertices[i].y +=	partSyst[i].acceleration.y;
					scene.children[0].geometry.vertices[i].z +=	partSyst[i].acceleration.z;
					scene.children[0].geometry.colors[i].r = 0;
					scene.children[0].geometry.colors[i].g = 0;
					scene.children[0].geometry.colors[i].b = 0;
				}else if( dist <= bhInfluence){			
					scene.children[0].geometry.colors[i].r = 1-newDist;
					scene.children[0].geometry.colors[i].g = 1-newDist;
					scene.children[0].geometry.colors[i].b = 1-newDist;
					partSyst[i].acceleration.x -= (PosX*(1-newDist))/noiseG;
					partSyst[i].acceleration.y -= (PosY*(1-newDist))/noiseG;
					partSyst[i].acceleration.z -= (PosZ*(1-newDist))/noiseG;
					scene.children[0].geometry.vertices[i].x += partSyst[i].acceleration.x;
					scene.children[0].geometry.vertices[i].y +=	partSyst[i].acceleration.y;
					scene.children[0].geometry.vertices[i].z +=	partSyst[i].acceleration.z;
				}
			}
		}
	}

	camera.position.z = 200;
	var countFrame = 0;
	function render() {
		requestAnimationFrame( render );
		controls.update();
		renderer.render( scene, camera );
		scene.children[0].geometry.verticesNeedUpdate = true;
		scene.children[0].geometry.colorsNeedUpdate = true;
		partVelocity();
		blackHole();
	}

	generatePart();
	render();
	// var GUIi = new dat.GUI();
	//gui.add(BlackHole, 'size', 1, 20);
	// gui.add(AreaProp, 'globalArea');
	// gui.add(AreaProp, 'gravityX', -1, 1);
	// gui.add(AreaProp, 'gravityY', -1, 1);
	// gui.add(AreaProp, 'gravityZ', -1, 1);

};