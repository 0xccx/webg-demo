#version 300 es

layout(location=0) in vec3 inPosition;
layout(location=1) in vec3 inNormal;
layout(location=2) in vec2 inTexcoord;

// параметры преобразований
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uMVP;

uniform mat4 uViewProjection;
uniform mat3 uNormal;
uniform vec3 uViewPosition;

// параметры точеченого источника освещения
uniform vec3 LightPosition;

out vec2  texcoord;
out vec3  normal;
out vec3  lightDir;
out vec3  viewDir;
out float distance;

void main() {
	// coordinate of vertex to world
    vec3 p = vec3(uModel * vec4(inPosition, 1.0));
    // calculate light direction
    lightDir = normalize(LightPosition - p);

    // just texture coordinate
    texcoord = inTexcoord;

    // convert normal vector to world
    normal = uNormal * inNormal;

    viewDir = uViewPosition - vec3(p);

    distance = length(lightDir);

    gl_Position = uMVP * vec4(inPosition, 1.0);
}
