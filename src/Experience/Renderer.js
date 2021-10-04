import * as THREE from 'three'
import Experience from './Experience.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

import vertexShader from './shaders/fisheyes/vertex.glsl'
import fragmentShader from './shaders/fisheyes/fragment.glsl'

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'Effects',
                expanded: true
            })
        }

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()
    }

    setInstance()
    {
        this.clearColor = '#000000'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // this.instance.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.shadowMap.enabled = false
        // this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMappingExposure = 1.3

        this.context = this.instance.getContext()

        // Add stats panel
        if(this.stats)
        {
            this.stats.setRenderPanel(this.context)
        }
    }

    setPostProcess()
    {
        this.postProcess = {}
        this.setTintShaderPass()
        this.setFisheyesShaderPass()

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.postProcess.unrealBloomPass = new UnrealBloomPass()
        this.postProcess.unrealBloomPass.enabled = true
        this.postProcess.unrealBloomPass.strength = .15
        this.postProcess.unrealBloomPass.radius = .15
        this.postProcess.unrealBloomPass.threshold = .4
        
        this.postProcess.rgbShiftPass = new ShaderPass(RGBShiftShader)
        this.postProcess.rgbShiftPass.enabled = true
        /**
         * Effect composer
         */
        const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
        // const RenderTargetClass = THREE.WebGLRenderTarget
        this.renderTarget = new RenderTargetClass(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)

        this.postProcess.composer.addPass(this.postProcess.rgbShiftPass)
        this.postProcess.composer.addPass(this.postProcess.tintShaderPass)
        this.postProcess.composer.addPass(this.postProcess.fisheyesShaderPass)
        this.postProcess.composer.addPass(this.postProcess.unrealBloomPass)

        // DEBUG
        if(this.debug)
        {
            this.debugFolder.addInput(
                this.postProcess.rgbShiftPass,
                'enabled',
                {
                    label: '2.RGB Shift'
                }
            )
            this.debugFolder.addInput(
                this.postProcess.unrealBloomPass,
                'enabled',
                {
                    label: '3.Unreal Bloom'
                }
            )
            this.debugFolder.addInput(
                this.postProcess.unrealBloomPass,
                'strength',
                {
                    min: 0.01, max: 2, step: 0.001, label: '3.Bloom Strength'
                }
            )
            this.debugFolder.addInput(
                this.postProcess.unrealBloomPass,
                'radius',
                {
                    min: 0.01, max: 2, step: 0.001, label: '3.Bloom Radius'
                }
            )
            this.debugFolder.addInput(
                this.postProcess.unrealBloomPass,
                'threshold',
                {
                    min: 0.01, max: 1, step: 0.001,label: '3.Bloom Threshold'
                }
            )

            // TintShader
            this.debugFolder.addInput(
                this.postProcess.tintShaderPass.material.uniforms.uTint.value,
                'x',
                {
                    min: -1, max: 1, step: 0.001, label: 'Red Channel'
                }
            )
        }
    }
    setTintShaderPass()
    {
        if(this.postProcess){
            this.postProcess.TintShader = {
                uniforms:
                {
                    tDiffuse: {value: null},
                    uTint: {value: null},
                    uTime: {value: null}
                },
                vertexShader:`
                    varying vec2 vUv;

                    void main()
                    {
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                        vUv = uv;
                    }
                `,
                fragmentShader:`
                    uniform sampler2D tDiffuse;
                    uniform vec3 uTint;
                    uniform float uTime;

                    varying vec2 vUv;

                    void main()
                    {
                        vec4 color = texture2D(tDiffuse, vUv);
                        if(color.r > 0.0){
                            color.rgb += uTint;
                        }
                        
                        gl_FragColor = color;
                    }
                `
            }
            this.postProcess.tintShaderPass = new ShaderPass(this.postProcess.TintShader)
            this.postProcess.tintShaderPass.enabled = true
            this.postProcess.tintShaderPass.material.uniforms.uTint.value = new THREE.Vector3()
            
        }
    }

    setFisheyesShaderPass()
    {
        if(this.postProcess)
        {
            this.postProcess.FisheyesShader = {
                uniforms: {
                    "tDiffuse":         { type: "t", value: null },
                    "strength":         { type: "f", value: 0 },
                    "height":           { type: "f", value: 1 },
                    "aspectRatio":      { type: "f", value: 1 },
                    "cylindricalRatio": { type: "f", value: 1 }
                },
                vertexShader,
                fragmentShader
            }
            this.postProcess.fisheyesShaderPass = new ShaderPass(this.postProcess.FisheyesShader)
            this.postProcess.fisheyesShaderPass.enabled = true

            if(this.debug)
            {
                this.debugFolder.addInput(
                    this.postProcess.fisheyesShaderPass.material.uniforms.strength,
                    'value',
                    {min: 0, max: 5, step: 0.001, label: 'Strength FishE'}
                ),
                this.debugFolder.addInput(
                    this.postProcess.fisheyesShaderPass.material.uniforms.height,
                    'value',
                    {min: -5, max: 5, step: 0.001, label: 'Height FishE'}
                ),
                this.debugFolder.addInput(
                    this.postProcess.fisheyesShaderPass.material.uniforms.aspectRatio,
                    'value',
                    {min: -5, max: 5, step: 0.001, label: 'Aspect FishE'}
                ),
                this.debugFolder.addInput(
                    this.postProcess.fisheyesShaderPass.material.uniforms.cylindricalRatio,
                    'value',
                    {min: -5, max: 5, step: 0.001, label: 'Cylinder FishE'}
                )
            }
        }
    }


    resize()
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.stats)
        {
            this.stats.beforeRender()
        }

        if(this.usePostprocess)
        {
            this.postProcess.composer.render()
        }
        else
        {
            this.instance.render(this.scene, this.camera.instance)
        }

        if(this.stats)
        {
            this.stats.afterRender()
        }
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}