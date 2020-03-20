function Plane(xsize, zsize, xdivs, zdivs) {
    var faces = xdivs * zdivs;


    this.verts = [];
    this.norms = [];
    this.el = [];
    this.tex = [];


    this.generate(xsize, zsize, xdivs, zdivs);
    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();
    var vboPosition = gl.createBuffer();
    var vboNormals = gl.createBuffer();
    var vboTexcoords = gl.createBuffer();
    this.ebo = gl.createBuffer();
    gl.bindVertexArray(this.vao);


    var lengthOfVets = this.verts.length * Float32Array.BYTES_PER_ELEMENT;
    var lengthOfNorms = this.norms.length * Float32Array.BYTES_PER_ELEMENT;
    var lengthOfTex = this.tex.length * Float32Array.BYTES_PER_ELEMENT;
    var bufferSize = lengthOfVets + lengthOfNorms + lengthOfTex;


    gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vboNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.norms), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, vboTexcoords);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tex), gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(2);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.el), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
}

Plane.prototype.render = function() {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.el.length, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
};

Plane.prototype.generate = function(xsize, zsize, xdivs, zdivs) {


    var x2 = xsize / 2.0;
    var z2 = zsize / 2.0;
    var iFactor = zsize / zdivs;
    var jFactor = xsize / xdivs;
    var texi = 1.0 / zdivs;
    var texj = 1.0 / xdivs;
    var x, z;
    var vidx = 0, tidx = 0;
    for( var i = 0; i <= zdivs; i++ ) {
        z = iFactor * i - z2;
        for( var j = 0; j <= xdivs; j++ ) {
            x = jFactor * j - x2;
            this.verts[vidx] = x;
            this.verts[vidx+1] = 0.0;
            this.verts[vidx+2] = z;
            this.norms[vidx] = 0.0;
            this.norms[vidx+1] = 1.0;
            this.norms[vidx+2] = 0.0;
            vidx += 3;
            this.tex[tidx] = j * texi;
            this.tex[tidx+1] = i * texj;
            tidx += 2;
        }
    }

    var rowStart, nextRowStart;
    var idx = 0;
    for( var i = 0; i < zdivs; i++ ) {
        rowStart = i * (xdivs+1);
        nextRowStart = (i+1) * (xdivs+1);
        for( var j = 0; j < xdivs; j++ ) {
            this.el[idx] = rowStart + j;
            this.el[idx+1] = nextRowStart + j;
            this.el[idx+2] = nextRowStart + j + 1;
            this.el[idx+3] = rowStart + j;
            this.el[idx+4] = nextRowStart + j + 1;
            this.el[idx+5] = rowStart + j + 1;
            idx += 6;
        }
    }
}
