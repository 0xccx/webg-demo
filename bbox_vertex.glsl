#version 300 es

layout(location=0) in vec4 inPosition;

uniform mat4 uMVP;

void main()
{
	gl_Position = uMVP * inPosition;
}