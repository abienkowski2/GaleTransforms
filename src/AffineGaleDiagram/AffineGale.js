
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
	linpoint = math.multiply(1/math.norm(math.squeeze(linpoint)),linpoint)

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
			var temp_loc = math.dot(math.multiply(1/math.norm(tempbt),tempbt),math.squeeze(linpoint))
			var temp_struct = {pn:'p',loc:temp_loc}
			affGale.push(temp_struct)
		}
	}
	return affGale

}



function addCircle(x,y,size,colorarg,scene){
			var geometry = new THREE.CircleGeometry( size,32 );
			// var geometry = new THREE.BoxGeometry(1,1,1);
			var material = new THREE.MeshBasicMaterial( colorarg );
			var circle = new THREE.Mesh( geometry, material );
			circle.position.set(x,y,0)
			scene.add( circle );
			return circle
}


function addTextAff(x,y,textarg,scene,size, color_arg){
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
		var material = new THREE.MeshBasicMaterial( color_arg );
		var text = new THREE.Mesh(geometry,material)
		text.position.set(x,y,0)
		scene.add(text)
		pushTextAff(text)
		}
	
}
var circles = []
var texts = []
function pushTextAff(text){
	texts.push(text)
}
var affScene 
var affRenderer
var affCamera
function affGaleInit(){
	affScene = new THREE.Scene();
	affRenderer = new THREE.WebGLRenderer();	
	affCamera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	affRenderer.setSize( window.innerWidth/3.75, window.innerHeight/3);
	affRenderer.setClearColor (0xffffff, 1);
	document.body.appendChild( affRenderer.domElement );
	affRenderer.render(affScene,affCamera)
	
	affCamera.position.z = 5;
	function animate() {
		requestAnimationFrame( animate );
		affRenderer.render( affScene, affCamera );			
	}		
	animate();
}

var colors = [{color: 0xff0000},{color: 0x00ff00},{color: 0x0000ff},{color: 0xff00ff},{color: 0xCA6F1E},{color: 0x8E44AD}]

function dispAffGale(affGale){

	var loader = new THREE.FontLoader();
	for(i = 0;i <6; i++){
		if (affGale[i].pn == 'p'){

			circles.push(addCircle(0,affGale[i].loc,0.05,{color:0x000000},affScene))
			loader.load( fonturl, addTextAff(-0.25,affGale[i].loc,(i+1).toString(),affScene,0.1, colors[i]))



		}
		else{

			
			circles.push(addCircle(0.05,affGale[i].loc,0.05,{color:0x000000},affScene))
			circles.push(addCircle(0.05,affGale[i].loc,0.04,{color:0xffffff},affScene))
			loader.load( fonturl, addTextAff(0.15,affGale[i].loc,(i+1).toString(),affScene,0.1, colors[i]))

		}
	}


}

function updateAffGale(affGale){
	for(i=0;i<circles.length;i++){
		affScene.remove(circles[i])
	}
	for(i=0;i<texts.length;i++){
		affScene.remove(texts[i])
	}
	dispAffGale(affGale)
	
}

function testwrapperAffine(){
	var bt = math.matrix([[0,1,-1,0,-1,1],[1,0,-1,-1,0,1]])
	// var bt = math.matrix([[-1,0,0.5],[-1,-1,1]])
	
	
	// console.log(sortedbt)
	AG = affineGalePoints(bt)
	dispAffGale(AG)
}
