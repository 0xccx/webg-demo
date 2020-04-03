function AABB(mesh) {
  // Cube 1x1x1, centered on origin
  var vertices = [
    -0.5, -0.5, -0.5, 1.0,
     0.5, -0.5, -0.5, 1.0,
     0.5,  0.5, -0.5, 1.0,
    -0.5,  0.5, -0.5, 1.0,
    -0.5, -0.5,  0.5, 1.0,
     0.5, -0.5,  0.5, 1.0,
     0.5,  0.5,  0.5, 1.0,
    -0.5,  0.5,  0.5, 1.0,
  ];
  this.vao = gl.createVertexArray();
  var vbo_vertices = gl.createBuffer();
  gl.bindVertexArray(this.vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(
    0,  // attribute
    4,                  // number of elements per vertex, here (x,y,z,w)
    gl.FLOAT,           // the type of each element
    false,           // take our values as-is
    0,                  // no extra data between each position
    0                   // offset of first element
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, null);


  var elements = [
    0, 1, 2, 3,
    4, 5, 6, 7,
    0, 4, 1, 5,
    2, 6, 3, 7
  ];
  var ibo_elements = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo_elements);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  var min_x, max_x,
  min_y, max_y,
  min_z, max_z;

  min_x = max_x = mesh.positions[0];
  min_y = max_y = mesh.positions[1];
  min_z = max_z = mesh.positions[2];

  for (var i = 0; i < mesh.positions.length; i++) {
    if (mesh.positions[i*3+0] < min_x) min_x = mesh.positions[i*3+0];
    if (mesh.positions[i*3+0] > max_x) max_x = mesh.positions[i*3+0];
    if (mesh.positions[i*3+1] < min_y) min_y = mesh.positions[i*3+1];
    if (mesh.positions[i*3+1] > max_y) max_y = mesh.positions[i*3+1];
    if (mesh.positions[i*3+2] < min_z) min_z = mesh.positions[i*3+2];
    if (mesh.positions[i*3+2] > max_z) max_z = mesh.positions[i*3+2];
  }

  var size = vec3.fromValues(max_x - min_x, max_y - min_y, max_z - min_z);
  var center = vec3.fromValues( (max_x + min_x)/2, (max_y + min_y)/2, (max_z + min_z)/2 );
  
  this.transform = mat4.create();
  var scale = mat4.create();
  var translate = mat4.create();

  mat4.fromScaling(scale, size);
  mat4.fromTranslation(translate, center);
  mat4.mul(this.transform, translate, scale);


  // console.log(min_x, max_x, min_y, max_y, min_z, max_z);
}

AABB.prototype.render = function() {
  gl.bindVertexArray(this.vao);
  gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 0);
  gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 4 * Uint16Array.BYTES_PER_ELEMENT);
  gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 8 * Uint16Array.BYTES_PER_ELEMENT);
  gl.bindVertexArray(null);
};


