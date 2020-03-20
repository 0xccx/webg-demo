#version 300 es

precision mediump float;

uniform sampler2D uTexture1;

// параметры точеченого источника освещения
uniform vec4 LightAmbient;
uniform vec4 LightDiffuse;
uniform vec4 LightSpecular;
uniform vec3 LightAttenuation;

// параметры материала
uniform sampler2D uTexture0;
uniform vec4  MaterialAmbient;
uniform vec4  MaterialDiffuse;
uniform vec4  MaterialSpecular;
uniform vec4  MaterialEmission;
uniform float MaterialShininess;

in vec2  texcoord;
in vec3  normal;
in vec3  lightDir;
in vec3  viewDir;
in float distance;

out vec4 outColor;

void main() {
    vec4 diffColor = vec4(0.5, 0.0, 0.0, 1.0);
    float Ka = 0.2;
    float Kd = 1.0;

    vec3 n = normalize(normal);
    vec3 l = normalize(lightDir);
    vec3 v = normalize(viewDir);

    float attenuation = 1.0 / (LightAttenuation[0] +
		LightAttenuation[1] * distance +
		LightAttenuation[2] * distance * distance);

    outColor = MaterialEmission;

    outColor += MaterialAmbient * LightAmbient * attenuation;

    float NdotL = max(dot(n, l), 0.0);
    outColor += MaterialDiffuse * LightDiffuse * NdotL * attenuation;

    float RdotVpow = max(pow(dot(reflect(-l, n), v), MaterialShininess), 0.0);
    outColor += MaterialSpecular * LightSpecular * RdotVpow * attenuation;

    outColor *= texture(uTexture0, texcoord);
}
