
var fonturl = 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/helvetiker_regular.typeface.json'



function affineGalePoints(bt){

	bt_arr = []
	for (i=0;i<6;i++){
		bt_arr.push(bt.subset(math.index([0,1],i)))
	}
	points = [0,1,2,3,4,5]
	bt = ccwSort(bt,points)
	var numPts = bt.length
	var linpoint = math.multiply(0.5,math.add(bt[0],bt[1]))
	var rotmat = math.matrix([[0,-1],[1,0]])
	var normVec = math.multiply(rotmat,linpoint)
	var continueFlag = true
	var div = 0.25
	while (continueFlag){
		continueFlag = false
		for(i=0;i<numPts;i++){
			if( math.dot(math.squeeze(bt[i]),math.squeeze(normVec)) == 0){
				continueFlag = true
				linpoint = math.add(math.multiply(div,bt[0]),math.multiply(1-div,bt[1]))
				div /= 2
				normVec = math.multiply(rotmat,linpoint)
				break
			}	
		}
	}
	console.log(linpoint)
	linpoint = math.multiply(1/math.norm(math.squeeze(linpoint)),linpoint)
	console.log(linpoint)
	console.log(normVec)

	var affGale = []
	for(i=0;i<numPts;i++){
		if( math.dot(math.squeeze(bt_arr[i]),math.squeeze(normVec)) < 0){
			var tempbt = math.squeeze(bt_arr[i])
			var temp_loc = math.dot(math.multiply(-1/math.norm(tempbt),tempbt),math.squeeze(linpoint))
			var temp_struct = {pn:'n',loc:temp_loc}
			affGale.push(temp_struct)
		}
		else if( math.dot(math.squeeze(bt_arr[i]),math.squeeze(normVec)) > 0){
			var tempbt = math.squeeze(bt_arr[i])
			var temp_lock = math.dot(math.multiply(1/math.norm(tempbt),tempbt),math.squeeze(linpoint))
			var temp_struct = {pn:'p',loc:temp_loc}
			affGale.push(temp_struct)
		}
	}
	console.log(affGale)
	return affGale

}

function fontWrapper(affGale,i,scene,xcoord){
	return function(font){
		var geometry = new THREE.TextGeometry( (i+1).toString(), {
			font: font,
			size: 0.1,
			height: 0.05,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.0006,
			bevelSize: 0.0005,
			bevelSegments: 5
		} );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		var text = new THREE.Mesh(geometry,material)
		text.position.set(xcoord,affGale[i].loc,0)
		scene.add(text)
		}
}

function addCircle(x,y,size,colorarg,scene){
			var geometry = new THREE.CircleGeometry( size,32 );
			// var geometry = new THREE.BoxGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial( { color: colorarg } );
			var circle = new THREE.Mesh( geometry, material );
			circle.position.set(x,y,0)
			scene.add( circle );
}


function addText(x,y,textarg,scene,size){
		return function(font){
		var geometry = new THREE.TextGeometry( textarg, {
			font: font,
			size: size,
			height: size/20,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.0006,
			bevelSize: 0.0005,
			bevelSegments: 5
		} );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		var text = new THREE.Mesh(geometry,material)
		text.position.set(x,y,0)
		scene.add(text)
		}
	
}


function dispAffGale(affGale){
	var scene = new THREE.Scene();
	var  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	// var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
	// camera.position.set( 0, 400, 700 );		
	var renderer = new THREE.WebGLRenderer();	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor (0xffffff, 1);
	document.body.appendChild( renderer.domElement );


	// var geometry = new THREE.CircleGeometry( 0.05,32 );
	// // var geometry = new THREE.BoxGeometry(1,1,1);
	// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// var sphere = new THREE.Mesh( geometry, material );
	// sphere.position.set(0,1,0)
	// scene.add( sphere );\

	var loader = new THREE.FontLoader();


	// loader.load( 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/gentilis_regular.typeface.json', function ( font ) {

	// 	var geometry = new THREE.TextGeometry( 1, {
	// 	font: font,
	// 	size: 0.1,
	// 	height: 0.05,
	// 	curveSegments: 12,
	// 	bevelEnabled: false,
	// 	bevelThickness: 1,
	// 	bevelSize: 1,
	// 	bevelSegments: 5
	// } );
	// var text = new THREE.Mesh(geometry,material)
	// text.position.set(0.5,0.5,0)
	// scene.add(text)

	// } );

	for(i = 0;i <6; i++){
		if (affGale[i].pn == 'p'){
			/*var geometry = new THREE.CircleGeometry( 0.05,32 );
			// var geometry = new THREE.BoxGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
			var circle = new THREE.Mesh( geometry, material );
			circle.position.set(0,affGale[i].loc,0)
			scene.add( circle );
*/
			addCircle(0,affGale[i].loc,0.05,0x000000,scene)
			//loader.load( 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/helvetiker_regular.typeface.json', fontWrapper(affGale,i,scene,-0.25))
			loader.load( fonturl, addText(-0.25,affGale[i].loc,(i+1).toString(),scene,0.1))



		}
		else{

			
			addCircle(0.05,affGale[i].loc,0.05,0x000000,scene)
			addCircle(0.05,affGale[i].loc,0.04,0xffffff,scene)
			loader.load( fonturl, addText(0.15,affGale[i].loc,(i+1).toString(),scene,0.1))
			//loader.load( 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/gentilis_regular.typeface.json', fontWrapper(affGale,i,scene,0.15))

		}
	}

	camera.position.z = 5;
	function animate() {
		requestAnimationFrame( animate );
		// controls.update()
		//cube.rotation.x += 0.1;
		//cube.rotation.y += 0.1;
		renderer.render( scene, camera );			
	}		
	animate();
	// for(i=0;i<6;i++)
}


function testwrapperAffine(){
	var bt = math.matrix([[0,1,-1,0,-1,1],[1,0,-1,-1,0,1]])
	// var bt = math.matrix([[-1,0,0.5],[-1,-1,1]])
	
	
	// console.log(sortedbt)
	AG = affineGalePoints(bt)
	dispAffGale(AG)
}