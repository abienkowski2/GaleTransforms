# GaleTransforms

Gale transforms are a method to visualize and determine information about high dimensional polytopes. At its core, the Gale Transform of a d dimensional polytope with n vertices is a basis of the null space of the (d+1) x n dimensional matrix where the first d rows have the vertex points as columns, and the last row is 1s.

Planned implementation:
User Input:
	How many dimensions d, for original polytope (2 or 3)
	How many vertices (<d+4)
	Allow user to drag vertices then use the convex hull of those vertices as the input polytope
Output:
	Gale Diagram
	Affine Gale Diagram
	List of faces as determined by the Gale Diagram
  
Example Gale Diagram:

![alt text](https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/Images/Gale_Diagram_Example.PNG)


Example Affine Gale Diagram:
![alt text](https://raw.githubusercontent.com/abienkowski2/GaleTransforms/master/Images/Affine_Gale_Diagram_Example.PNG)
