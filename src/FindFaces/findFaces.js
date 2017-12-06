function ccw(a,b,c){
	var d = a.size()[0]
	var m = math.ones(d+1,3)
	m.subset(math.index([0,1],0),a)
	m.subset(math.index([0,1],1),b)
	m.subset(math.index([0,1],2),c)

	var deter = math.det(m)
	if (math.abs(deter) > 1e-10){
		return math.sign(deter)
	}
	else{
		return 0
	}
}
function ccw0(min){
	return function(a,b){
		return -1*ccw(min,a,b)
	}
}


function ccwSort(bt,points){
	numPoints = points.length

	var sortpts = []
	minpt = []
	minx = 10000
	for (i=0;i<numPoints;i++){
		sortpts.push(bt.subset(math.index([0,1],points[i])))
		if (sortpts[i]._data[0] < minx){
			minpt = sortpts[i]
			minx = sortpts[i]._data[0]
		}

		
	}

	sortpts.splice(sortpts.indexOf(minpt),1)

	sortpts.sort(ccw0(minpt),1)
	sortpts.splice(0,0,minpt)

	return sortpts
}

function convHull(bt,points){
	
	numPoints = points.length
	var sortpts = ccwSort(bt,points)

	if (numPoints > 3){
		cHull = []
		cHull.push(sortpts[0])
		cHull.push(sortpts[1])
		
		for(i=2;i<numPoints;i++){
			while(ccw(cHull[cHull.length-2],cHull[cHull.length-1],sortpts[i]) == -1){
				cHull.pop()
			}
			cHull.push(sortpts[i])
		}

	}
	return cHull
}


function relint(bt,points){
	numPoints = points.length

	// var sortpts = []
	// minpt = []
	// minx = 10000
	// for (i=0;i<numPoints;i++){
	// 	sortpts.push(bt.subset(math.index([0,1],points[i])))
	// 	if (sortpts[i]._data[0] < minx){
	// 		minpt = sortpts[i]
	// 		minx = sortpts[i]._data[0]
	// 	}

		
	// }

	// sortpts.splice(sortpts.indexOf(minpt),1)

	// sortpts.sort(ccw0(minpt),1)
	// sortpts.splice(0,0,minpt)
	var sortpts = convHull(bt,points)
	
	// pts.sort(ccw)
	comparePoint = Math.floor(numPoints/2);
	lastPoint = 0
	n = math.floor(numPoints/4)
	// if (comparePoint == 1){
	// 	c = ccw(sortpts[0],sortpts[comparePoint],math.transpose(math.matrix([0,0])))

	// }
	var c = -1
	// while (math.abs(comparePoint-lastPoint)%numPoints > 1){
	while (n >=0){		
		c = ccw(sortpts[0],sortpts[comparePoint],math.transpose(math.matrix([0,0])))
		

		if (c == 0){
			if ((numPoints == 2 || (comparePoint != 1 && comparePoint != numPoints-1)) && 0 <= sortpts[comparePoint]._data[0]){				
				return true
			}
			else{
				return false
			}
		}
		// else if (c > 0){
		// 	if (comparePoint + n < numPoints && n != 0){
		// 		lastPoint = comparePoint
		// 		comparePoint += n
		// 		n = math.floor(n/2)
		// 	}
		// 	else{
		// 		n = -1
		// 	}
		// }
		// else if(c < 0){
		// 	if (comparePoint - n > 0 && n != 0){
		// 		lastPoint = comparePoint
		// 		comparePoint -= n
		// 		n = math.floor(n/2)
		// 	}
		// 	else{
		// 		n = -1
		// 	}
		// }
		if (n == 0){
			if(c > 0 && lastPoint != comparePoint + 1 && comparePoint != numPoints-1){
				lastPoint = comparePoint
				comparePoint += 1
			}
			else if(c < 0 && lastPoint != comparePoint - 1 && comparePoint != 0){
				lastPoint = comparePoint
				comparePoint -= 1
			}
			else{
				n = -1	
			}

			
		}
		else{
			if (c > 0){
				lastPoint = comparePoint
				comparePoint += n
			}
			else if(c < 0){
				lastPoint = comparePoint
				comparePoint -= n
			} 
			n = math.floor(n/2) 	
		}
		
	}
	if (c == 0){
		return false
	}
	else{
		var c2 = 0
		if (lastPoint > comparePoint){
			c2 = ccw(sortpts[comparePoint],sortpts[lastPoint],math.transpose(math.matrix([0,0])))	
		}
		else if(comparePoint > lastPoint){
			c2 = ccw(sortpts[lastPoint],sortpts[comparePoint],math.transpose(math.matrix([0,0])))
		}
		
		if (c2 > 0){
			if (comparePoint == numPoints-1 && c > 0){
				return false
			}
			else{
				return true
			}
		}
		else if (c2 < 0){
			return false
		}
		else{
			if ((numPoints == 2 || (comparePoint != 1 && comparePoint != numPoints-1)) && 0 <= sortpts[comparePoint]._data[0]){
				return true
			}
			else{
				return false
			}			
		}
	}


	
	
}


function isFace(bt,points){
	
	
	numPoints = bt.size()[1]
	//console.log('in isface',bt,numPoints,points)
	newpts = []
	for(i = 0;i<numPoints;i++){
		if (!points.includes(i)){
			newpts.push(i)
		}
	}
	var x =relint(bt,newpts)
	//console.log(x)
	return x
	

	
}


function testwrapper(bt){


//	var bt = math.matrix([[0,1,-1,0,-1,1],[1,0,-1,-1,0,1]])
	// console.log(bt)

	for(j=0;j<6;j++){
		isFace(bt,[j])
	}
	console.log("2")
	var t = [[0,1],[1,2],[0,2],[0,3],[3,4],[1,4],[3,5],[2,5],[4,5]]
	var f = [[0,4],[0,5],[1,3],[1,5],[2,3],[2,4]]
	for (j = 0;j <t.length;j++){
		console.log(t[j])
		isFace(bt,t[j])
	}
	for (k = 0;k <f.length;k++){
		console.log(f[k])
		isFace(bt,f[k])
	}

	console.log('3')
	var f3 = []
	for(i = 0;i < 6;i++){
		for(j = i+1;j<6;j++){
			for(k=j+1;k<6;k++){
					f3.push([i,j,k])
			}
		}
	}
	for (j=0;j<f3.length;j++){
		console.log(f3[j])
		isFace(bt,f3[j])
	}
	console.log('4')
	var f4 = []
	for(i = 0;i < 6;i++){
		for(j = i+1;j<6;j++){
			for(k=j+1;k<6;k++){
				for (m = k+1;m<6;m++){
					f4.push([i,j,k,m])
				}
			}
		}
	}
	for (j=0;j<f4.length;j++){
		console.log(f4[j])
		isFace(bt,f4[j])
	}


	
	// isFace(bt,[0,4])
	//document.write(math.size(bt))
	
}