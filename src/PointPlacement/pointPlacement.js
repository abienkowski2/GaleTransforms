//var THREE = require( 'three' );
//var MeshLine = require( 'three.meshline' );
var spheres
function pointPlacement(){
    if (Detector.webgl) { // make sure we can use webgl
        // create the renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth/2.5, window.innerHeight/2.5);
        document.body.appendChild( renderer.domElement );
    
        // and the camera
        var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        var scene = new THREE.Scene();
        // and something to look at
        var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        var colors = [{color: 0xff0000},{color: 0x00ff00},{color: 0x0000ff},{color: 0xff00ff},{color: 0xffff00},{color: 0xffffff}]
        spheres = []
        for(i =0;i<6;i++){
            var material=new THREE.MeshBasicMaterial( colors[i]);
            spheres.push( new THREE.Mesh( geometry, material))
            spheres[i].position.set(2*i,2*i,0)
            scene.add(spheres[i])
        }
		spheres[0].position.set(0,0,0)
		spheres[1].position.set(3,0,0)
		spheres[2].position.set(0,3,0)
		spheres[3].position.set(0,0,3)
		spheres[4].position.set(3,0,3)
		spheres[5].position.set(0,3,3)


		renderer.render(scene,camera)
		//animate()
        

        // initialise controls
        var drag_controls = new THREE.PointDragControls();
		drag_controls.init( scene,camera,renderer)//, {auto_render: true});    	
		var orbit_controls = new THREE.OrbitControls( camera, document, renderer.domElement );
		orbit_controls.update();
		orbit_controls.ignoreObjects = scene.children; // or the objects you want drag control over
        function animate(){
			requestAnimationFrame( animate );
			//orbit_controls.update()
			renderer.render(scene,camera)
			
		}
		
		animate()
		/*console.log('orig scene',scene)
		function requestRender(){
			console.log('requestrender', scene)
			
			renderer.render(scene,camera)
		}
		//drag_controls.init( scene,camera,renderer);
		window.addEventListener("mousemove",requestRender,false)
		window.addEventListener("mouseclick",requestRender,false)*/
		window.addEventListener('mouseup', updateFunc,false);
    }
    else{	
        var warning = Detector.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
        
    }

            
}
function updateFunc(event){
	console.log('update func')
	gale_diag_matrix = updateGaleDiagram(getPos())
	updateEdges(gale_diag_matrix)
	affineGale = affineGalePoints(gale_diag_matrix);
	updateAffGale(affineGale)

}
var face = -1
function addFace(gale,points){
	if 	(face != -1){
		spheres[0].parent.remove(face)
	}
	if (isFace(gale,points)){
		console.log('adding face',points)
		var geometry = new THREE.Geometry();
		for (i = 0;i<points.length;i++){
			ind = points[i]
			geometry.vertices.push(new THREE.Vector3(spheres[ind].matrixWorld.elements[12],spheres[ind].matrixWorld.elements[13],spheres[ind].matrixWorld.elements[14]))
		}
		if (points.length == 3){
			geometry.faces.push(new THREE.Face3(0,1,2))
			geometry.faces.push(new THREE.Face3(2,1,0))
		}
		else if(points.length == 4){
			geometry.faces.push(new THREE.Face3(0,1,2))
			geometry.faces.push(new THREE.Face3(2,1,0))
			geometry.faces.push(new THREE.Face3(0,2,3))
			geometry.faces.push(new THREE.Face3(3,2,0))
			geometry.faces.push(new THREE.Face3(1,3,0))
			geometry.faces.push(new THREE.Face3(0,3,1))
		}
		var material=new THREE.MeshBasicMaterial( {color:0xff0000});
		face = new THREE.Mesh( geometry, material)
		spheres[0].parent.add(face)
	}
	
}
var edges = []
function updateEdges(gale){
	console.log(spheres)
	for (i=0;i<edges.length;i++){
		spheres[0].parent.remove(edges[i])
	}
	for (i=0;i<spheres.length;i++){
		spheres[i].matrixWorldNeedsUpdate = true
	}
	addEdges(gale)
	
}

function addEdges(gale){
	
	for (start=0;start<6;start++){
		for(end=start+1;end<6;end++){
			//console.log([start,end])
			if (isFace(gale,[start,end])){
					//console.log('adding line')
					//var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth:10 });
					var material = new MeshLineMaterial({color: new THREE.Color(0xffffff), lineWidth:0.5});
					var geometry = new THREE.Geometry();
					geometry.vertices.push(new THREE.Vector3(spheres[start].matrixWorld.elements[12],spheres[start].matrixWorld.elements[13],spheres[start].matrixWorld.elements[14]))
					geometry.vertices.push(new THREE.Vector3(spheres[end].matrixWorld.elements[12],spheres[end].matrixWorld.elements[13],spheres[end].matrixWorld.elements[14]))

					//var line = new THREE.Line(geometry, material);
					var line  = new MeshLine()
					line.setGeometry(geometry)
					var mesh = new THREE.Mesh( line.geometry, material );
					edges.push(mesh)
					spheres[start].parent.add(mesh);
			}
		}
	}
	
}

function getPos(){

    console.log(spheres[1].modelViewMatrix.elements)
    vertices = []
    for (i=0;i<6;i++){
        vertices.push(new THREE.Vector3(spheres[i].matrixWorld.elements[12],spheres[i].matrixWorld.elements[13],spheres[i].matrixWorld.elements[14]))
    }
    return vertices
}
