import * as THREE from 'three'

import Experience from './Experience.js'
import vertexShader from './shaders/riu/vertex.glsl'
import fragmentShader from './shaders/riu/fragment.glsl'

export default class Riu
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'Riuuu',
                expanded: true
            })
        }

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        // console.log(this.resources.items.riuModel)

        /**
         * TEXTURES
         */
        this.model.mesh = this.resources.items.riuModel3.scene.children[0]
        

        this.model.bakedRiuTexture = this.resources.items.bakedRiu
        this.model.bakedRiuTexture.encoding = THREE.sRGBEncoding
        this.model.bakedRiuTexture.flipY = false
        // material2
        this.model.colorRiuTexture = this.resources.items.colorRiu
        this.model.colorRiuTexture.flipY = false
        this.model.roughnessRiuTexture = this.resources.items.roughnessRiu
        this.model.roughnessRiuTexture.flipY = false
        this.model.metalnessRiuTexture = this.resources.items.metalnessRiu
        this.model.metalnessRiuTexture.flipY = false
        // this.model.normalRiuTexture = this.resources.items.normalRiu
        // this.model.normalRiuTexture.flipY = false
        this.model.displacementRiuTexture = this.resources.items.displacementRiu
        this.model.displacementRiuTexture.flipY = false


        /**
         * MATERTIAL
         */
        // this.model.material = new THREE.MeshStandardMaterial(
        //     {
        //         color: 0xd4af37,
        //         side: THREE.DoubleSide,
        //         metalness: 1,
        //         roughness: 0.3
        //     }
        // )
        // this.model.material = new THREE.MeshBasicMaterial(
        //     {
        //         // color: 0xffff00,
        //         map: this.model.colorRiuTexture,
        //         side: THREE.DoubleSide,
        //         transparent: true,
        //     }
        // )
        this.model.material2 = new THREE.MeshStandardMaterial(
            {
                map: this.model.colorRiuTexture,
                side: THREE.DoubleSide,
                transparent: true,
                roughnessMap: this.model.roughnessRiuTexture,
                // roughness: 0,
                metalnessMap: this.model.metalnessRiuTexture,
                // metalness: 0,
                
            }
        )

        this.model.mesh.traverse((_child) =>
        {
            if(_child instanceof THREE.Mesh)
            {
                _child.material = this.model.material2
            }
        })
        

        this.model.mesh.scale.set(.8,.8,.8)
        // this.model.mesh.position.set(0,0,0)
        // this.model.mesh.rotation.z = Math.PI 
        console.log(this.model.mesh)
        
        this.scene.add(this.model.mesh)



        this.params = {}
        this.params.visible = true
        this.params.metalnessMap = true
        this.params.metalness = 0
        this.params.roughnessMap = true
        this.params.roughness = 0
        this.params.play = true
        this.params.speed = 10
        // Debug
        if(this.debug)
        {
            this.debugFolder
            .addInput(
                this.params,
                'visible',
                { options: {ON: true, OFF: false} }
            )
            .on('change', () =>
            {
                this.model.mesh.visible = this.params.visible
            })

            this.debugFolder
            .addInput(
                this.params,
                'metalness',
                {min: 0, max: 1, step: 0.0001}
            )
            .on('change', () =>
            {
                if (this.params.metalnessMap) {
                    this.model.material2.metalness = NaN
                } else {
                    this.model.material2.metalness = this.params.metalness
                }
            })
            this.debugFolder
            .addInput(
                this.params,
                'roughness',
                {min: 0, max: 1, step: 0.0001}
            )
            .on('change', () =>
            {
                if (this.params.roughnessMap) {
                    this.model.material2.roughness = null
                } else {
                    console.log("lmao")
                    this.model.material2.roughness = this.params.roughness
                }
            })

            this.debugFolder
            .addInput(
                this.params,
                'metalnessMap',
                { options: {ON: true, OFF: false} }
            )
            .on('change', () =>
            {
                if (this.params.metalnessMap) {
                    this.model.material2.metalness = null
                    this.model.material2.metalnessMap = this.model.metalnessRiuTexture
                } else {
                    this.model.material2.metalnessMap = null
                    this.model.material2.metalness = this.params.metalness
                }
            })
            this.debugFolder
            .addInput(
                this.params,
                'roughnessMap',
                { options: {ON: true, OFF: false} }
            )
            .on('change', () =>
            {
                if (this.params.roughnessMap) {
                    this.model.material2.roughness = null
                    this.model.material2.roughnessMap = this.model.roughnessRiuTexture
                } else {
                    this.model.material2.roughnessMap = null
                    this.model.material2.roughness = this.params.roughness
                }
            })

            // ANIMATION PAUSE
            this.debugFolder
            .addInput(
                this.params,
                'play',
                {options: {PLAY: true, PAUSE: false}, label: 'Animation'}
            )
            .on('change', () =>
            {
                this.time.playing = this.params.play
            })
            this.debugFolder
            .addInput(
                this.params,
                'speed',
                {min: 1, max: 100, step: 1, label: 'Speed (10)'}
            )

        }
    }

    update()
    {
        if (this.params.play) {
            this.model.mesh.rotation.y =  this.time.elapsed * (this.params.speed/10000)
        } else {this.model.mesh.rotation.y = this.model.mesh.rotation.y}
    }
}