
var fonturl = 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/helvetiker_regular.typeface.json'

// helper function to output formatted results.
function print(value) {
	var precision = 14;
	document.write(math.format(value, precision) + '<br>');
}
function addTextGale(x,y,textarg,scene,size, color_arg){
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
		pushTextGale(text)
		}
	
}
function liftToNextDim(vertices) {
	var original_dim = 3;
	var lifted_verts_arr = [[], [], [], []];
	for ( i = 0, l = vertices.length; i < l; i ++ ) {
		vertex = vertices[i];
		lifted_verts_arr[0][i] = 1;
		lifted_verts_arr[1][i] = vertex.x;
		lifted_verts_arr[2][i] = vertex.y;
		lifted_verts_arr[3][i] = vertex.z;
	}
	lifted_verts_mat = array2mat(lifted_verts_arr);
	//print(lifted_verts_mat);
	if (rank(lifted_verts_mat) <= original_dim) {
		print("The dimension of null space is equal or greater than the original dimension");
	}
	return lifted_verts_mat;
}
var galeCircles = []
var line = []
var galeTexts = []
var mouse = new THREE.Vector2();
var galeRenderer
var galeCamera
var galeScene
var click = false;
var raycaster = new THREE.Raycaster();
var selected_verts = []
var selection_circles = []
function render() {
	if (click==true) {
		//console.log('inside render');
		//console.log(scene.children);
		raycaster.setFromCamera(mouse, galeCamera);
		var intersects = raycaster.intersectObjects(galeCircles);
		for (var i=0; i < intersects.length; i++) {
			if (selected_verts.includes(intersects[i].object.name-1)){
				selected_verts.splice(selection_circles.indexOf(intersects[i].object.name-1),1)
				for(j=0;j<selection_circles.length;j++){
					if (selection_circles[j].name == intersects[i].object.name){
						galeScene.remove(selection_circles[j])
						selection_circles.splice(j,1)
						//selected_verts.splice(selected_verts.indexOf(intersects[i].object.name-1),1)
						break
					}
				}
			}
			else if (intersects[i].object.name !=0){

				selected_verts.push(intersects[i].object.name-1)
				
				var newCirc = addCircle(intersects[i].object.position.x,intersects[i].object.position.y,1.5,{color:0x000000},galeScene)
				newCirc.position.z = -0.01
				newCirc.name = intersects[i].object.name
				selection_circles.push(newCirc)
			}
			console.log(selected_verts)
			addFace(gale_matrix,selected_verts)
			//intersects[i].object.material.color.set(0xff0000);
			//console.log(intersects[i].position);
		}	
		click = false;
	}
	galeRenderer.render(galeScene, galeCamera);
}
function pushTextGale(text){
	texts.push(text)
}
function displayGaleDiagram(kernel, scaling_factor) {

	


	
	function onMouseClick(event) {
		var rect = galeRenderer.domElement.getBoundingClientRect()
		mouse.x = ((event.clientX-rect.left)/ galeRenderer.domElement.width)*2 -1;
		mouse.y = - ((event.clientY-rect.top)/galeRenderer.domElement.height)*2 +1;
		click = true;
	}
		
	var cols = kernel.n; //2
	var x_val = kernel.val[0];
	var y_val = kernel.val[1];
	var first_vector = new THREE.Vector3(x_val,y_val,0);
	var normalizing_val = math.sqrt(first_vector.length());
	//print(normalizing_val);
	//var scaling_factor = 40;
	//print(scaling_factor);
	zero_vertex = new THREE.Vector3(0,0,0);
	gale_vertices_2d = [[], [], [], [], [], []]; //List which is being finally returned	
	gale_vertices_3d = []; //Used for the display
	gale_vertices_3d.push(zero_vertex);
	for (i = 0, l = kernel.length; i < l; i++) {
		var j = 0;
		vertex_x = scaling_factor*kernel.val[i*cols+j];
		j = 1;
		vertex_y = scaling_factor*kernel.val[i*cols+j];
		my_vertex = new THREE.Vector3(vertex_x, vertex_y,0);
		gale_vertices_3d.push(my_vertex);
		gale_vertices_2d[i][0] = vertex_x;
		gale_vertices_2d[i][1] = vertex_y;
	}
	gale_matrix = math.transpose(math.matrix(gale_vertices_2d))
	gale_str = laloprint(array2mat(gale_vertices_2d), true);
	
	window.addEventListener('click', onMouseClick, false);
	//window.requestAnimationFrame(render);	
	galeRenderer = new THREE.WebGLRenderer();
	galeRenderer.setSize(window.innerWidth/3.75, window.innerHeight/3.75);
	document.body.appendChild(galeRenderer.domElement);

	galeCamera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000);
	galeCamera.position.set(0, 0, 100);
	//camera.lookAt(new THREE.Vector3(0, 0, 0));
	galeScene = new THREE.Scene();
	var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
	var geometry = new THREE.Geometry();

	for (i = 1; i < gale_vertices_3d.length; i++) {
		geometry.vertices.push(zero_vertex);
		geometry.vertices.push(gale_vertices_3d[i]);
	}
	line = new THREE.Line(geometry, material);
	galeScene.add(line);
	//lines.push(line)
	var loader = new THREE.FontLoader();
	galeRenderer.setClearColor(0xffffff,1);
	//var colors = [{color: 0xff0000},{color: 0x00ff00},{color: 0x0000ff},{color: 0xff00ff},{color: 0xffff00},{color: 0x8E44AD}]
	galeCircles.push(addCircle(gale_vertices_3d[0].x,gale_vertices_3d[0].y,1.0,{color:0x000000},galeScene))		
	loader.load( fonturl, addTextGale(gale_vertices_3d[0].x,gale_vertices_3d[0].y+1,'0',galeScene, 2, {color:0x000000}))
	for (var i = 1; i < gale_vertices_3d.length; i++)
	{

		galeCircles.push(addCircle(gale_vertices_3d[i].x,gale_vertices_3d[i].y,1.0,colors[i-1],galeScene))	
		galeCircles[i].name = i	
		loader.load( fonturl, addTextGale(gale_vertices_3d[i].x,gale_vertices_3d[i].y+1,(i).toString(),galeScene, 2, colors[i-1]))	
		
		//var spritey = makeTextSprite( " " + i + " ", { fontsize: 10, backgroundColor: {r:200, g:100, b:100, a:1} } );
		//spritey.position = gale_vertices[i].clone().multiplyScalar(1.1);
		//scene.add( spritey );
	}

	function animate() {
		requestAnimationFrame( animate );
		//renderer.render( scene, camera );		
		render();	
	}		
	animate();
	//renderer.render(scene, camera);
	return [gale_matrix, gale_str];
}
function updateGaleDiagram(vertices, scaling_factor) {
	lifted_matrix = liftToNextDim(vertices);
	//print(lifted_matrix);
	kernel = nullspace(lifted_matrix);
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	var click = false;
	var cols = kernel.n; //2
	var x_val = kernel.val[0];
	var y_val = kernel.val[1];
	var first_vector = new THREE.Vector3(x_val,y_val,0);
	var normalizing_val = math.sqrt(first_vector.length());
	zero_vertex = new THREE.Vector3(0,0,0);
	// Assuming kernel length is 6
	gale_vertices_2d = [[], [], [], [], [], []]; //List which is being finally returned	
	gale_vertices_3d = []; //Used for the display
	gale_vertices_3d.push(zero_vertex);
	for (i = 0, l = kernel.length; i < l; i++) {
		var j = 0;
		vertex_x = scaling_factor*kernel.val[i*cols+j];
		j = 1;
		vertex_y = scaling_factor*kernel.val[i*cols+j];
		my_vertex = new THREE.Vector3(vertex_x, vertex_y,0);
		gale_vertices_3d.push(my_vertex);
		gale_vertices_2d[i][0] = vertex_x;
		gale_vertices_2d[i][1] = vertex_y;
	}
	gale_matrix = math.transpose(math.matrix(gale_vertices_2d))
	gale_str = laloprint(array2mat(gale_vertices_2d), true);

	//console.log('lines',lines)
	for (i = 0; i < gale_vertices_3d.length-1; i++) {
		line.geometry.vertices[2*i] = zero_vertex
		line.geometry.vertices[2*i+1] = gale_vertices_3d[i+1]
	}
	line.geometry.verticesNeedUpdate = true;


	for (var i = 0; i < gale_vertices_3d.length; i++)
	{
		galeCircles[i].position.set(gale_vertices_3d[i].x,gale_vertices_3d[i].y,0)
		texts[i].position.set(gale_vertices_3d[i].x,gale_vertices_3d[i].y+1,0)
		//addCircle(gale_diag_vertices_3d[i].x,gale_diag_vertices_3d[i].y,1.0,0x000000,scene)		
		//loader.load( fonturl, addText(gale_diag_vertices_3d[i].x,gale_diag_vertices_3d[i].y+1,(i).toString(),scene, 2))		
	}
	for(i=0;i<selection_circles.length;i++){
		selection_circles[i].position.set(gale_vertices_3d[selection_circles[i].name].x,gale_vertices_3d[selection_circles[i].name].y,-0.01)
	}

	/*function animate() {
		requestAnimationFrame( animate );
		//renderer.render( scene, camera );		
		render();	
	}		
	animate();*/
	//renderer.render(scene, camera);
	return [gale_matrix, gale_str];
}
function computeAndDisplayGaleDiagram(vertices, scaling_factor) {
	/*var vertices = [];
	vertices.push(new THREE.Vector3(0, 0, 0));
	vertices.push(new THREE.Vector3(1, 0, 0));
	vertices.push(new THREE.Vector3(0, 1, 0));
	vertices.push(new THREE.Vector3(0, 0, 1));
	vertices.push(new THREE.Vector3(1, 0, 1));
	vertices.push(new THREE.Vector3(0, 1, 1));*/
	lifted_matrix = liftToNextDim(vertices);
	//print(lifted_matrix);
	kernel = nullspace(lifted_matrix);
	//document.write("<br><br>KERNEL<br>");
	//kernel_str = laloprint(kernel, true);
	//print(kernel_str);	
	gale_vertices = displayGaleDiagram(kernel, scaling_factor);
	return gale_vertices;
}

function redundant() {

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
			camera.position.set(0, 0, 100);
			camera.lookAt(new THREE.Vector3(0, 0, 0));

			var scene = new THREE.Scene();
			var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
			var original_dim = 3;
			var geometry = new THREE.Geometry();
			/*geometry.vertices.push(new THREE.Vector3(0, 0, 0));
			geometry.vertices.push(new THREE.Vector3(1, 0, 0));
			geometry.vertices.push(new THREE.Vector3(0, 1, 0));
			geometry.vertices.push(new THREE.Vector3(0, 0, 1));
			geometry.vertices.push(new THREE.Vector3(1, 0, 1));
			geometry.vertices.push(new THREE.Vector3(0, 1, 1));
			
			var vertices = geometry.vertices;*/
			var vertices = [];
			vertices.push(new THREE.Vector3(0, 0, 0));
			vertices.push(new THREE.Vector3(1, 0, 0));
			vertices.push(new THREE.Vector3(0, 1, 0));
			vertices.push(new THREE.Vector3(0, 0, 1));
			vertices.push(new THREE.Vector3(1, 0, 1));
			vertices.push(new THREE.Vector3(0, 1, 1));
			var lifted_verts_arr = [[], [], [], []];
			for ( i = 0, l = vertices.length; i < l; i ++ ) {
				vertex = vertices[i];
				lifted_verts_arr[0][i] = 1;
				lifted_verts_arr[1][i] = vertex.x;
				lifted_verts_arr[2][i] = vertex.y;
				lifted_verts_arr[3][i] = vertex.z;
			}
			print(lifted_verts_arr);
			/*lifted_verts = math.ones(4,vertices.length);
			print(lifted_verts);			
			//var lifted_verts = new Float32Array( vertices.length * 4 );
			for ( i = 0, l = vertices.length; i < l; i ++ ) {
				vertex = vertices[i];
				lifted_verts.subset(math.index(1,i), vertex.x);
				lifted_verts.subset(math.index(2,i), vertex.y);
				lifted_verts.subset(math.index(3,i), vertex.z);
			}
			print(lifted_verts);*/
			/*for (i = 0, l = vertices.length; i < l; i++) {
				vertex = vertices[i];
				lifted_verts.val[0*6+i] = 1;
				lifted_verts[1*6+i] = vertex.x;
				lifted_verts[2*6+i] = vertex.y;
				lifted_verts[3*6+i] = vertex.z;			
			}*/
			//mat = math.matrix(4,vertices.length);
			//a2DArray = [ [1, 1, 1, 1], [ 1, 2, 3, 4], [4, 3, 2, 1] ];  // an Array of as many Arrays as rows in the matrix
			//a2DArray = [ [1,1,1,1,1,1], [0,1,0,0,1,0], [0,0,1,0,0,1], [0,0,0,1,1,1] ];						
			//print(a2DArray);			
			lifted_verts_mat = array2mat(lifted_verts_arr);
			print(lifted_verts_mat);
			if (rank(lifted_verts_mat) <= original_dim) {
				print("The dimension of null space is equal or greater than the original dimension");
			}
			//tt = transpose(lifted_verts_mat);
			//print(tt);
			
			//amat_str = laloprint(lifted_verts_mat, true);
			//print(amat_str);
			
			var null_mat = nullspace(lifted_verts_mat);
			print(null_mat);
			null_mat_str = laloprint(null_mat, true);
			print(null_mat_str);
			var cols = null_mat.n;
			//tt_null = transpose(null_mat);
			//mul_null = mul(null_mat, tt_null);
			//mult_str = laloprint(mul_null, true);
			//print(mult_str);
			//var cols = null_mat.n;
			//var upper_bound = math.bignumber('1e-10');
			/*for (i=0, l=mul_null.length; i<l; i++) {		
				for (j=0; j < null_mat.n; j++) {
					var mat_val = math.bignumber(abs(mul_null.val[i*cols+j]));				
					if (math.smaller(mat_val, upper_bound) == true) {
						r = 3;
					}				
				}
						
			}*/			
			
			//tr_null = transpose(null_mat);
			//print(tr_null);

			// TODO: check for the dimension of the null space and throw an error if it is more than 2
			// Check boxes to select which vertices do we need to carry out the face test for
			// Labeling the vertices in the Gale Diagram.			
			
			var x_val = null_mat.val[0];
			var y_val = null_mat.val[1];
			first_vector = new THREE.Vector3(x_val,y_val,0);
			var squared_len = first_vector.length();
			var normalizing_val = math.sqrt(squared_len);
			print(normalizing_val);
			var scaling_factor = 20;
			print(scaling_factor);
			for (i = 0, l = null_mat.length; i < l; i++) {
				var j = 0;
				vertex_x = scaling_factor*null_mat.val[i*cols+j];
				j = 1;
				vertex_y = scaling_factor*null_mat.val[i*cols+j];
				geometry.vertices.push(new THREE.Vector3(0,0,0));
				myVector = new THREE.Vector3(vertex_x, vertex_y, scaling_factor);
				geometry.vertices.push(myVector);
			}
			var line = new THREE.Line(geometry, material);
			scene.add(line);
			//var direction = new THREE.Vector3();
 			//direction.subVectors(geometry.vertices[0], geometry.vertices[1] ) ;
			//scene.add(direction);
			renderer.render(scene, camera);
}

