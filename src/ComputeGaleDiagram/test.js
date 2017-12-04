/*function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 12;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 2;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
	//var spriteAlignment = parameters.hasOwnProperty("alignment") ?
	//	parameters["alignment"] : THREE.SpriteAlignment.topLeft;
	var spriteAlignment = THREE.SpriteAlignment.topLeft;
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.1 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;
}*/
// function for drawing rounded rectangles
/*function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
}*/
var fonturl = 'https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/src/AffineGaleDiagram/fonts/helvetiker_regular.typeface.json'



// helper function to output formatted results.
function print(value) {
	var precision = 14;
	document.write(math.format(value, precision) + '<br>');
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

function displayGaleDiagram(kernel) {

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	var click = false;

	function render() {
		if (click==true) {
			console.log('inside render');
			console.log(scene.children);
			raycaster.setFromCamera(mouse, camera);
			var intersects = raycaster.intersectObjects(scene.children);
			console.log(intersects);
			for (var i=0; i < intersects.length; i++) {
				intersects[i].object.material.color.set(0xff0000);
				console.log(intersects[i].position);
			}	
		click = false;
	}
	renderer.render(scene, camera);
	}
	
	function onMouseClick(event) {
		mouse.x = (event.clientX/ window.innerWidth)*2 -1;
		mouse.y = - (event.clientY/window.innerHeight)*2 +1;
		click = true;
		console.log('onMouseClick');
	}
		
		
	var cols = kernel.n; //2
	var x_val = kernel.val[0];
	var y_val = kernel.val[1];
	var first_vector = new THREE.Vector3(x_val,y_val,0);
	var normalizing_val = math.sqrt(first_vector.length());
	//print(normalizing_val);
	var scaling_factor = 40;
	//print(scaling_factor);
	zero_vertex = new THREE.Vector3(0,0,0);
	gale_vertices_2d = [];	
	gale_vertices = [];
	gale_vertices.push(zero_vertex);
	for (i = 0, l = kernel.length; i < l; i++) {
		var j = 0;
		vertex_x = scaling_factor*kernel.val[i*cols+j];
		j = 1;
		vertex_y = scaling_factor*kernel.val[i*cols+j];
		my_vertex = new THREE.Vector3(vertex_x, vertex_y,0);
		gale_vertices.push(my_vertex);
		vertex_2d = [vertex_x, vertex_y];
		gale_vertices_2d.push(vertex_2d);
	}
	print("Scaling factor is 30");
	print("Gale Diagram vertices: ");
	print(gale_vertices_2d);

	window.addEventListener('click', onMouseClick, false);
	window.requestAnimationFrame(render);	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 0, 100);
	//camera.lookAt(new THREE.Vector3(0, 0, 0));
	var scene = new THREE.Scene();
	var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
	var geometry = new THREE.Geometry();
	
	for (i = 1, l = gale_vertices.length; i < l; i++) {
		geometry.vertices.push(zero_vertex);
		geometry.vertices.push(gale_vertices[i]);
	}
	var line = new THREE.Line(geometry, material);
	scene.add(line);
	var loader = new THREE.FontLoader();
	renderer.setClearColor(0xffffff,1);

	/*var geometry1 = new THREE.CircleGeometry( 10,32 );
			// var geometry = new THREE.BoxGeometry(1,1,1);
			var material1 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
			var circle = new THREE.Mesh( geometry1, material1 );
			circle.position.set(0,0,0)
			scene.add( circle );*/
	//addCircle(0,0,10.0, 0x000000, scene);
	for (var i = 0; i < gale_vertices.length; i++)
	{
		addCircle(gale_vertices[i].x,gale_vertices[i].y,1.0,0x000000,scene)		
		loader.load( fonturl, addText(gale_vertices[i].x,gale_vertices[i].y+1,(i).toString(),scene, 2))		
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
	return gale_vertices;
}

function computeAndDisplayGaleDiagram() {
	var vertices = [];
	vertices.push(new THREE.Vector3(0, 0, 0));
	vertices.push(new THREE.Vector3(1, 0, 0));
	vertices.push(new THREE.Vector3(0, 1, 0));
	vertices.push(new THREE.Vector3(0, 0, 1));
	vertices.push(new THREE.Vector3(1, 0, 1));
	vertices.push(new THREE.Vector3(0, 1, 1));
	lifted_matrix = liftToNextDim(vertices);
	//print(lifted_matrix);
	kernel = nullspace(lifted_matrix);
	print("Kernel: ");
	kernel_str = laloprint(kernel, true);
	print(kernel_str);	
//	print(kernel);
	gale_vertices = displayGaleDiagram(kernel);
	return gale_vertices;
}

function computeAffineDiagram(gale_vertices, indices) {
	print(indices);
	print(gale_vertices);
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

