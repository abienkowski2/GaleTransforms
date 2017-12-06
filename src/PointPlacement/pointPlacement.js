//var THREE = require( 'three' );
//var MeshLine = require( 'three.meshline' );
var spheres
function pointPlacement(){
    if (Detector.webgl) { // make sure we can use webgl
        // create the renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth/2.5, window.innerHeight/2.5);
		renderer.setClearColor(0xffffff,1);
        document.body.appendChild( renderer.domElement );
    
        // and the camera
        var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(15, 15, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
		
        var scene = new THREE.Scene();
        // and something to look at
        var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        //var colors = [{color: 0xff0000},{color: 0x00ff00},{color: 0x0000ff},{color: 0xff00ff},{color: 0xffff00},{color: 0x8E44AD}]
        spheres = []
        for(i =0;i<6;i++){
            var material=new THREE.MeshBasicMaterial( colors[i]);
            spheres.push( new THREE.Mesh( geometry, material))
            spheres[i].position.set(2*i,2*i,0)
            scene.add(spheres[i])
        }
		spheres[0].position.set(0,0,0)
		spheres[1].position.set(3,0,0)
		spheres[2].position.set(0,3,-4)
		spheres[3].position.set(0,0,3)
		spheres[4].position.set(3,0,3)
		spheres[5].position.set(0,3,3)


		renderer.render(scene,camera)
		//animate()
        

        // initialise controls
        var drag_controls = new THREE.PointDragControls();
		drag_controls.init( scene,camera,renderer, {mode_auto:false})//, {auto_render: true});    	
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
var oldPos 

function updateFunc(event){
	for (i=0;i<spheres.length;i++){
		spheres[i].matrixWorldNeedsUpdate = true
	}
	var flag = false
	var newPos = getPos()
	if (oldPos.length == newPos.length){
		for(i = 0;i < oldPos.length;i++){
			if (oldPos[i].x != newPos[i].x && oldPos[i].y != newPos[i].y && oldPos[i].z != newPos[i].z){
				flag = true
			}
		}	
	}
	else{
		flag = true
	}
	if (flag){
		oldPos = newPos
		if 	(face != -1){
			spheres[0].parent.remove(face)
			face = -1
		}
		var scaling = 30
		gale_diag_array = updateGaleDiagram(getPos(), scaling)
		gale_diag_matrix = gale_diag_array[0]
		updateEdges(gale_diag_matrix,-1,-1)
		affineGale = affineGalePoints(gale_diag_matrix);
		updateAffGale(affineGale)
	}

}
var face = -1
function addFace(gale,points){
	if 	(face != -1){
		spheres[0].parent.remove(face)
	}
	updateEdges(gale)
	if (isFace(gale,points)){
		if (points.length == 3 || points.length == 4){
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
		else if(points.length == 2){
			updateEdges(gale,points[0],points[1])
		}
	}
	
}
var edges = []
function updateEdges(gale,redStart,redEnd){
	
	for (i=0;i<edges.length;i++){
		spheres[0].parent.remove(edges[i].edge)
	}
	edges = []

	addEdges(gale,redStart,redEnd)
	
}

	

function addEdges(gale, redStart,redEnd){
	oldPos = getPos()
	for (start=0;start<6;start++){
		for(end=start+1;end<6;end++){
			if (isFace(gale,[start,end])){
					
					//console.log('adding line')
					//var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth:10 });
					var material 
					if ((redStart == start && redEnd == end) || (redStart == end && redEnd == start)){
						material = new MeshLineMaterial({color: new THREE.Color(0xff0000), lineWidth:0.5});
					}
					else{
						material = new MeshLineMaterial({color: new THREE.Color(0x000000), lineWidth:0.5});
					}
					var geometry = new THREE.Geometry();
					geometry.vertices.push(new THREE.Vector3(spheres[start].matrixWorld.elements[12],spheres[start].matrixWorld.elements[13],spheres[start].matrixWorld.elements[14]))
					geometry.vertices.push(new THREE.Vector3(spheres[end].matrixWorld.elements[12],spheres[end].matrixWorld.elements[13],spheres[end].matrixWorld.elements[14]))

					//var line = new THREE.Line(geometry, material);
					var line  = new MeshLine()
					line.setGeometry(geometry)
					var mesh = new THREE.Mesh( line.geometry, material );
					edges.push({edge:mesh,start:start,end:end})
					spheres[start].parent.add(mesh);
			}
		}
	}
	
}

function getPos(){

    vertices = []
    for (i=0;i<6;i++){
        vertices.push(new THREE.Vector3(spheres[i].matrixWorld.elements[12],spheres[i].matrixWorld.elements[13],spheres[i].matrixWorld.elements[14]))
    }
    return vertices
}
