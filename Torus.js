function Torus(outerRadius, innerRadius, r, s) {
    this.verts = [];
    this.norms = [];
    this.el = [];
    this.tex = [];

    this.generate(outerRadius, innerRadius, r, s);
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

Torus.prototype.render = function() {
    
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.el.length, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
};

// outerRadius will be greater then innerRadius, e.g.
// outerRadius > innerRadius
// for example outerRadius = 2, innerRadius = 1
Torus.prototype.generate = function(outerRadius, innerRadius, rings, sides) {
    var ringFactor = (TWOPI / rings);
    var sideFactor = (TWOPI / sides);
    var idx = 0, tidx = 0;
    for( var ring = 0; ring <= rings; ring++ ) {
        var u = ring * ringFactor;
        var cu = Math.cos(u);
        var su = Math.sin(u);
        for( var side = 0; side < sides; side++ ) {
            var v = side * sideFactor;
            var cv = Math.cos(v);
            var sv = Math.sin(v);
            var r = (outerRadius + innerRadius * cv);
            this.verts[idx] = r * cu;
            this.verts[idx + 1] = r * su;
            this.verts[idx + 2] = innerRadius * sv;
            this.norms[idx] = cv * cu * r;
            this.norms[idx + 1] = cv * su * r;
            this.norms[idx + 2] = sv * r;
            this.tex[tidx] = (u / TWOPI);
            this.tex[tidx+1] = (v / TWOPI);
            tidx += 2;
            // Normalize
            var len = Math.sqrt( this.norms[idx] * this.norms[idx] +
                              this.norms[idx+1] * this.norms[idx+1] +
                              this.norms[idx+2] * this.norms[idx+2] );
            this.norms[idx] /= len;
            this.norms[idx+1] /= len;
            this.norms[idx+2] /= len;
            idx += 3;
        }
    }

    idx = 0;
    for( var ring = 0; ring < rings; ring++ ) {
        var ringStart = ring * sides;
        var nextRingStart = (ring + 1) * sides;
        for( var side = 0; side < sides; side++ ) {
            var nextSide = (side+1) % sides;
            // The quad
            this.el[idx] = (ringStart + side);
            this.el[idx+1] = (nextRingStart + side);
            this.el[idx+2] = (nextRingStart + nextSide);
            this.el[idx+3] = ringStart + side;
            this.el[idx+4] = nextRingStart + nextSide;
            this.el[idx+5] = (ringStart + nextSide);
            idx += 6;
        }
    }

}
