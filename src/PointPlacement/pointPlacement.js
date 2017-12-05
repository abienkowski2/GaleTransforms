
var scene
var spheres
function pointPlacement(){
    if (Detector.webgl) { // make sure we can use webgl
        // create the renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
    
        // and the camera
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        scene = new THREE.Scene();
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


        renderer.render(scene, camera);    

        
        // initialise controls
        var controls = new THREE.PointDragControls();
        controls.init( scene,camera,renderer, {auto_render: true});
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
        vertices.push([spheres[i].modelViewMatrix.elements[12],spheres[i].modelViewMatrix.elements[13],spheres[i].modelViewMatrix.elements[14]+100])
    }
    return vertices
}