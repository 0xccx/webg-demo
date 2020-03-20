
// https://github.com/tsherif/webgl2examples/blob/master/utils/utils.js
function Sphere(options) {
    this.positions = null;
    this.normals = null;
    this.uvs = null;
    this.indices = null;

    this.generate(options);
    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();
    var vboPosition = gl.createBuffer();
    var vboNormals = gl.createBuffer();
    var vboTexcoords = gl.createBuffer();
    this.ebo = gl.createBuffer();
    gl.bindVertexArray(this.vao);


    var lengthOfVets = this.positions.length * Float32Array.BYTES_PER_ELEMENT;
    var lengthOfNorms = this.normals.length * Float32Array.BYTES_PER_ELEMENT;
    var lengthOfTex = this.uvs.length * Float32Array.BYTES_PER_ELEMENT;
    var bufferSize = lengthOfVets + lengthOfNorms + lengthOfTex;


    gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vboNormals);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, vboTexcoords);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(2);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
}

Sphere.prototype.render = function() {
    
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
};


Sphere.prototype.generate = function(options) {
          options = options || {};

          var long_bands = options.long_bands || 32;
          var lat_bands = options.lat_bands || 32;
          var radius = options.radius || 1;
          var lat_step = Math.PI / lat_bands;
          var long_step = 2 * Math.PI / long_bands;
          var num_positions = long_bands * lat_bands * 4;
          var num_indices = long_bands * lat_bands * 6;
          var lat_angle, long_angle;
          this.positions = new Float32Array(num_positions * 3);
          this.normals = new Float32Array(num_positions * 3);
          this.uvs = new Float32Array(num_positions * 2);
          this.indices = new Uint16Array(num_indices);
          var x1, x2, x3, x4,
              y1, y2,
              z1, z2, z3, z4,
              u1, u2,
              v1, v2;
          var i, j;
          var k = 0, l = 0;
          var vi, ti;

          for (i = 0; i < lat_bands; i++) {
            lat_angle = i * lat_step;
            y1 = Math.cos(lat_angle);
            y2 = Math.cos(lat_angle + lat_step);
            for (j = 0; j < long_bands; j++) {
              long_angle = j * long_step;
              x1 = Math.sin(lat_angle) * Math.cos(long_angle);
              x2 = Math.sin(lat_angle) * Math.cos(long_angle + long_step);
              x3 = Math.sin(lat_angle + lat_step) * Math.cos(long_angle);
              x4 = Math.sin(lat_angle + lat_step) * Math.cos(long_angle + long_step);
              z1 = Math.sin(lat_angle) * Math.sin(long_angle);
              z2 = Math.sin(lat_angle) * Math.sin(long_angle + long_step);
              z3 = Math.sin(lat_angle + lat_step) * Math.sin(long_angle);
              z4 = Math.sin(lat_angle + lat_step) * Math.sin(long_angle + long_step);
              u1 = 1 - j / long_bands;
              u2 = 1 - (j + 1) / long_bands;
              v1 = 1 - i / lat_bands;
              v2 = 1 - (i + 1) / lat_bands;
              vi = k * 3;
              ti = k * 2;

              this.positions[vi] = x1 * radius; 
              this.positions[vi+1] = y1 * radius; 
              this.positions[vi+2] = z1 * radius; //v0

              this.positions[vi+3] = x2 * radius; 
              this.positions[vi+4] = y1 * radius; 
              this.positions[vi+5] = z2 * radius; //v1

              this.positions[vi+6] = x3 * radius; 
              this.positions[vi+7] = y2 * radius; 
              this.positions[vi+8] = z3 * radius; // v2


              this.positions[vi+9] = x4 * radius; 
              this.positions[vi+10] = y2 * radius; 
              this.positions[vi+11] = z4 * radius; // v3

              this.normals[vi] = x1;
              this.normals[vi+1] = y1; 
              this.normals[vi+2] = z1;

              this.normals[vi+3] = x2;
              this.normals[vi+4] = y1; 
              this.normals[vi+5] = z2;

              this.normals[vi+6] = x3;
              this.normals[vi+7] = y2; 
              this.normals[vi+8] = z3;
              
              this.normals[vi+9] = x4;
              this.normals[vi+10] = y2; 
              this.normals[vi+11] = z4;

              this.uvs[ti] = u1; 
              this.uvs[ti+1] = v1; 
              
              this.uvs[ti+2] = u2; 
              this.uvs[ti+3] = v1;
              
              this.uvs[ti+4] = u1;
              this.uvs[ti+5] = v2; 
              
              this.uvs[ti+6] = u2;
              this.uvs[ti+7] = v2;

              this.indices[l    ] = k;
              this.indices[l + 1] = k + 1;
              this.indices[l + 2] = k + 2;
              this.indices[l + 3] = k + 2;
              this.indices[l + 4] = k + 1;
              this.indices[l + 5] = k + 3;

              k += 4;
              l += 6;
            }
          }

}