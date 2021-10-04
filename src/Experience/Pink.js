import * as THREE from 'three'

import Experience from './Experience.js'
import vertexShader from './shaders/baked/vertex.glsl'
import fragmentShader from './shaders/baked/fragment.glsl'

export default class Pink
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
                title: 'pink',
                expanded: true
            })
        }

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        
        console.log(this.resources.items.pinkModel)
        this.model.mesh = this.resources.items.pinkModel.scene.children[0]
        this.model.bakedPinkTexture = this.resources.items.bakedPink
        this.model.bakedPinkTexture.encoding = THREE.sRGBEncoding
        this.model.bakedPinkTexture.flipY = false

        this.model.material = new THREE.MeshBasicMaterial(
            {
                map: this.model.bakedPinkTexture ,
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

        this.model.mesh.scale.set(2,2,2)
        this.model.mesh.rotation.z = Math.PI 
        this.model.mesh.position.set(0,0,0)
        this.model.mesh.visible = true
        
        this.scene.add(this.model.mesh)

        // Debug
        this.params = {}
        this.params.visible = true
        
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