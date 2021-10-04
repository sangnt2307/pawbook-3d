import * as THREE from 'three'
import Experience from './Experience.js'
import Pink from './Pink.js'
import Riu from './Riu.js'


export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPink()
                // this.setLights()
            }
        })

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'Lights',
                expanded: true
            })
        }
    }

    setPink()
    {
        this.pink = new Pink()
    }

    setRiu()
    {
        this.riu = new Riu()
    }

    setLights()
    {
        this.lights = {}
        this.lights.items = {}

        this.lights.items.directional = {}
        this.lights.items.directional.instance = new THREE.DirectionalLight( 0xfdfbd3 , 2.0 )
        this.lights.items.directional.instance.position.set(6,0,2)
        console.log(this.lights.items.directional.instance)
        this.lights.items.directional.helper = new THREE.DirectionalLightHelper(this.lights.items.directional.instance, 2)
        
        this.lights.items.directional2 = {}
        this.lights.items.directional2.instance = new THREE.DirectionalLight( 0xd303fc, 0.5 )
        this.lights.items.directional2.instance.position.set(-6,0,2)
        this.lights.items.directional2.helper = new THREE.DirectionalLightHelper(this.lights.items.directional2.instance, 2)
        

        const axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( axesHelper );


        this.scene.add(this.lights.items.directional.instance)
        // this.scene.add(this.lights.items.directional.helper)
        this.scene.add(this.lights.items.directional2.instance)
        // this.scene.add(this.lights.items.directional2.helper)
        

        this.params = {}
        this.params.mainColor = '#fdfbd3'
        this.params.mainColorIntensity = 1.0
        this.params.subColor = '#d303fc'
        this.params.subColorIntensity = 0.5
        if(this.debug)
        {
            this.debugFolder.addInput(
                this.params,
                'mainColor',
                {
                    view: 'color'
                }
            )
            .on('change', () =>
            {
                this.lights.items.directional.instance.color.set(this.params.mainColor)
            })

            this.debugFolder.addInput(
                this.params,
                'mainColorIntensity',
                {
                    min: 0.01, max: 5, step: 0.001
                }
            )
            .on('change', () =>
            {
                this.lights.items.directional.instance.intensity = this.params.mainColorIntensity
            })

            this.debugFolder.addInput(
                this.params,
                'subColor',
                {
                    view: 'color'
                }
            )
            .on('change', () =>
            {
                this.lights.items.directional2.instance.color.set(this.params.subColor)
            })

            this.debugFolder.addInput(
                this.params,
                'subColorIntensity',
                {
                    min: 0.01, max: 5, step: 0.001
                }
            )
            .on('change', () =>
            {
                this.lights.items.directional2.instance.intensity = this.params.subColorIntensity
            })
        }

    }

   
    resize()
    {
    }

    update()
    {
        if(this.pink)
            this.pink.update()

        // if(this.riu)
        //     this.riu.update()
    }

    destroy()
    {
    }
}