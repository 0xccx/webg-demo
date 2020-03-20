//-----------------------------------------------------------------------------
// Create our geometry
//-----------------------------------------------------------------------------
//var torus = new Torus(.4, .2, 10, 10);
var torus = new Torus(0.35, 0.15, 30, 30);
var plane = new Plane(5, 5,  4, 4);
var sphere = new Sphere();


var proj              = mat4.create();
var viewMatrix        = mat4.create();
var normalMatrix      = mat3.create();


//-----------------------------------------------------------------------------
// Settings for shader program
//-----------------------------------------------------------------------------
var eyePos           = vec3.fromValues(0, 0, 3);
var lightPos         = vec3.fromValues(1, 1, 2);

// настроим точечный источник освещения
const lightPosition    = vec3.fromValues(3.0, 3.0, 3.0);
const lightAmbient     = vec4.fromValues(0.1, 0.1, 0.1, 1.0);
const lightDiffuse     = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
const lightSpecular    = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
const lightAttenuation = vec3.fromValues(0.5, 0.0, 0.2);

  // создадим примитивы и настроим материалы
  // вращающийся тор
  //MeshCreateTorus(meshes[0], vec3(0.0f, 1.2f, 0.0f), 2.0f);
const materialAmbient   = vec4.fromValues(0.2, 0.2, 0.2, 1.0);
const materialDiffuse   = vec4.fromValues(0.3, 0.5, 1.0, 1.0);
const materialSpecular  = vec4.fromValues(0.8, 0.8, 0.8, 1.0);
const materialEmission  = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
const materialShininess = 20.0;
  //materials[0].texture = colorTexture;

//-----------------------------------------------------------------------------
// Load and crehate shader program
//-----------------------------------------------------------------------------
const lightProgram = initShaders(gl, 'basic_vertex.glsl', 'basic_fragment.glsl')
const prTexProgram = initShaders(gl, 'pr_tex_vertex.glsl', 'pr_tex_fragment.glsl')


//-----------------------------------------------------------------------------
// Load textures
//-----------------------------------------------------------------------------
const lavaTexture = loadTexture(gl, "lavatile.jpg");
const cloudTexture = loadTexture(gl, "cloud.png");


//-----------------------------------------------------------------------------
// Perspective and view matrix
//-----------------------------------------------------------------------------
mat4.perspective(proj, Math.PI / 2, gl.canvas.width/gl.canvas.height, 0.1, 1000.0);
mat4.lookAt(viewMatrix, [0.0, 0.5, 2.6], [0, 0, 0], [0, 1, 0]);

//-----------------------------------------------------------------------------
// Set value for uniform varibles in shader
//-----------------------------------------------------------------------------
gl.useProgram(lightProgram);
gl.uniform3fv(gl.getUniformLocation(lightProgram, "uViewPosition"), eyePos);

// Light properties
gl.uniform3fv(gl.getUniformLocation(lightProgram, "LightPosition"), lightPosition);
gl.uniform4fv(gl.getUniformLocation(lightProgram, "LightDiffuse"),     lightDiffuse);
gl.uniform4fv(gl.getUniformLocation(lightProgram, "LightSpecular"),    lightSpecular);
gl.uniform3fv(gl.getUniformLocation(lightProgram, "LightAttenuation"), lightAttenuation);
// material properties
gl.uniform4fv(gl.getUniformLocation(lightProgram, "MaterialAmbient"),  materialAmbient);
gl.uniform4fv(gl.getUniformLocation(lightProgram, "MaterialDiffuse"),  materialDiffuse);
gl.uniform4fv(gl.getUniformLocation(lightProgram, "MaterialSpecular"), materialSpecular);
gl.uniform4fv(gl.getUniformLocation(lightProgram, "MaterialEmission"), materialEmission);
gl.uniform1f(gl.getUniformLocation(lightProgram, "MaterialShininess"), materialShininess);

gl.useProgram(prTexProgram);
gl.uniform3fv(gl.getUniformLocation(prTexProgram, "uLightPosition"), lightPosition);

//-----------------------------------------------------------------------------
// Render here
//-----------------------------------------------------------------------------

var angleX = 0;
var angleY = 0;

function draw(time) {
    resize();
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear COLOR and DEPTH BUFFE
    gl.enable(gl.DEPTH_TEST);

    angleX += 0.009;
    angleY += 0.006;


    // compute common view projection matrix
    var vp = mat4.create();
    mat4.mul(vp, proj, viewMatrix);


//-----------------------------------------------------------------------------
// Torus render
//-----------------------------------------------------------------------------
    var torusRotateMatrix = mat4.create();
    var torusScaleMatrix = mat4.create();
    var torusTranslateMatrix = mat4.create();
    mat4.fromScaling(torusScaleMatrix, [0.5, 0.5, 0.5]);
    mat4.fromXRotation(torusRotateMatrix, angleX);
    mat4.fromTranslation(torusTranslateMatrix, [-1.0, 0.0, 1.0]);

    var torusM = mat4.create();
    // M = T * R
    // M' = M * S ==> M =  T * R * S
    mat4.mul(torusM, torusTranslateMatrix, torusRotateMatrix);
    mat4.mul(torusM, torusM, torusScaleMatrix);
    var torusMVP = mat4.create();
    mat4.mul(torusMVP, vp, torusM);
    mat3.normalFromMat4(normalMatrix, torusM);

    // now just pass to shader in
    gl.useProgram(lightProgram);

    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, torusM);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uMVP"), false, torusMVP);
    gl.uniformMatrix3fv(gl.getUniformLocation(lightProgram, "uNormal"), false, normalMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lavaTexture);
    // сюда присваивается номер текстурного слота, буду использовать слот TEXTURE0
    gl.uniform1i(gl.getUniformLocation(lightProgram, "uTexture0"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
    // сюда присваивается номер текстурного слота, буду использовать слот TEXTURE1
    gl.uniform1i(gl.getUniformLocation(lightProgram, "uTexture1"), 1);
    torus.render();

//-----------------------------------------------------------------------------
// Sphere render
//-----------------------------------------------------------------------------

    var sphereRotateMatrix = mat4.create();
    var sphereScaleMatrix = mat4.create();
    var sphereTranslateMatrix = mat4.create();
    mat4.fromScaling(sphereScaleMatrix, [0.3, 0.3, 0.3]);
    mat4.fromXRotation(sphereRotateMatrix, angleX);
    mat4.fromTranslation(sphereTranslateMatrix, [1.0, 0.0, 1.0]);

    var sphereM = mat4.create();
    // M = T * R
    // M' = M * S ==> M =  T * R * S
    mat4.mul(sphereM, sphereTranslateMatrix, sphereRotateMatrix);
    mat4.mul(sphereM, sphereM, sphereScaleMatrix);
    var sphereMVP = mat4.create();
    mat4.mul(sphereMVP, vp, sphereM);
    // compute normal matrix
    mat3.normalFromMat4(normalMatrix, sphereM);

    // now just pass to shader in
    gl.useProgram(lightProgram);

    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uModel"), false, sphereM);
    gl.uniformMatrix4fv(gl.getUniformLocation(lightProgram, "uMVP"), false, sphereMVP);
    gl.uniformMatrix3fv(gl.getUniformLocation(lightProgram, "uNormal"), false, normalMatrix);
    sphere.render();

//-----------------------------------------------------------------------------
// Plane render
//-----------------------------------------------------------------------------
    var planeNormalMatrix = mat3.create();
    var planeRotateMatrix = mat4.create();
    var planeScaleMatrix = mat4.create();
    var planeTranslateMatrix = mat4.create();
    mat4.fromYRotation(planeRotateMatrix, 0);
    mat4.fromScaling(planeScaleMatrix, [2., 2., 2.]);
    mat4.fromTranslation(planeTranslateMatrix, [0.0, -0.5, 0.0]);

    var planeM = mat4.create();
    mat4.mul(planeM, planeTranslateMatrix, planeRotateMatrix);
    mat4.mul(planeM, planeM, planeScaleMatrix);

    var planeMVP = mat4.create();
    mat4.mul(planeMVP, vp, planeM);
    // compute normal matrix
    mat3.normalFromMat4(planeNormalMatrix, planeM);

    gl.useProgram(prTexProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(prTexProgram, "uModel"), false, planeM);
    gl.uniformMatrix4fv(gl.getUniformLocation(prTexProgram, "uMVP"), false, planeMVP);
    gl.uniformMatrix3fv(gl.getUniformLocation(prTexProgram, "uNormal"), false, planeNormalMatrix);
    gl.uniform1f(gl.getUniformLocation(prTexProgram, "u_time"), time * 0.001);
    plane.render();

    requestAnimationFrame(draw);
}

draw();


//-----------------------------------------------------------------------------
// Function which recompute perspective matrix after resize the window
//-----------------------------------------------------------------------------
var width = window.innerWidth;
var height = window.innerHeight;
function resize()
{
    var canvas = document.getElementById('canvas');
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (windowWidth == width && windowHeight == height) return;

    width = windowWidth;
    height = windowHeight;
    canvas.width = width;
    canvas.height = height;

    // Set the viewport and projection matrix for the scene
    gl.viewport(0, 0, width, height);
    mat4.perspective(proj, Math.PI/2, width/height, 0.1, 1000);
}

