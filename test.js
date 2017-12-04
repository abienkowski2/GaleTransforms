<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
		<script src="js/three.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script src="js/math.min.js"></script>
		<script src="js/lalolib.js"></script>		
		<script>
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
			renderer.render(scene, camera);
			
    			// helper function to output formatted results.
    			function print(value) {
      			var precision = 14;
      			document.write(math.format(value, precision) + '<br>');
    			}
  		</script>
		</body>
</html>
