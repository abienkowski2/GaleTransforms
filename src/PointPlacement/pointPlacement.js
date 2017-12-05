
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
    }
    else{	
        var warning = Detector.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
        
    }

            
}

function getPos(){

    console.log(spheres[1].modelViewMatrix.elements)
    vertices = []
    for (i=0;i<6;i++){
        vertices.push(new THREE.Vector3(spheres[i].modelViewMatrix.elements[12],spheres[i].modelViewMatrix.elements[13],spheres[i].modelViewMatrix.elements[14]+100))
    }
    return vertices
}
