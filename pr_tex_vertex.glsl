#version 300 es

layout(location=0) in vec3 inPosition;
layout(location=1) in vec3 inNormal;
layout(location=2) in vec2 inTexcoord;

uniform mat4 uModel;
uniform mat4 uMVP;
uniform mat3 uNormal;
uniform vec3 uLightPosition;


uniform float u_time;

out vec2  texcoord;
out float time;
out vec3 normal;
out vec3 lightDir;

void main() {
    vec3 p = vec3(uModel * vec4(inPosition, 1.0));
    
    lightDir = normalize(uLightPosition - p);
    texcoord = inTexcoord;
    time = u_time;
    normal = normalize(uNormal * inNormal);

    gl_Position = uMVP * vec4(inPosition, 1.0);
}
