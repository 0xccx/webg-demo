

// GET & SET WEBGL CONTEXT
const canvas = document.getElementById("canvas");
//const gl = canvas.getContext("webgl2");
const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));
gl.canvas.width = window.innerWidth;
gl.canvas.height = window.innerHeight;

