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
                expanded: false
            })
        }

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        
        console.log(this.resources.items.riuModel)
        this.model.mesh = this.resources.items.riuModel.scene.children[0]
        this.model.bakedRiuTexture = this.resources.items.bakedRiu
        this.model.bakedRiuTexture.encoding = THREE.sRGBEncoding
        this.model.bakedRiuTexture.flipY = false

        // this.model.material = new THREE.MeshStandardMaterial(
        //     {
        //         color: 0xd4af37,
        //         side: THREE.DoubleSide,
        //         metalness: 1,
        //         roughness: 0.3
        //     }
        // )
        this.model.material = new THREE.MeshBasicMaterial(
            {
                map: this.model.bakedRiuTexture ,
                side: THREE.DoubleSide,

            }
        )

        this.model.mesh.traverse((_child) =>
        {
            if(_child instanceof THREE.Mesh)
            {
                _child.material = this.model.material
            }
        })

        this.model.mesh.scale.set(.8,.8,.8)
        this.model.mesh.position.set(0,0,0)
        this.model.mesh.rotation.z = Math.PI 
        
        this.scene.add(this.model.mesh)



        this.params = {}
        this.params.visible = true
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
        }
    }

    update()
    {
        this.model.mesh.rotation.z = - this.time.elapsed * 0.0005
    }
}