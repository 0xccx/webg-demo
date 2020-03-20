#version 300 es

precision mediump float;

in vec2  texcoord;
in float time;
in vec3 normal;
in vec3 lightDir;


out vec4 outColor;

void main() {

    const float Ka = .8;
    const float Kd = 1.0;
    vec3 n = normalize ( normal ) ;
    vec3 l = normalize ( lightDir ) ;
    // we can try take - light or + light


    vec2 st = texcoord;
    // st.y = st.y - (time * .3);

    float scale = 10.0;

    vec3 color;

    float a = floor(st.x * scale);
    float b = floor(st.y * scale);
    if (mod(a+b, 2.0) > 0.5) {  // a+b is odd
        color = vec3(1.0);
    }
    else {  // a+b is even
        color = vec3(0.0);
    }

    vec4 diff = vec4(color, 1.0) * ( Ka + Kd * max ( dot (n , -l ) , 0.0) ) ;
    outColor = diff;
}
