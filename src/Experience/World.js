import * as THREE from 'three'
import Experience from './Experience.js'
import Pink from './Pink.js'
// import Baked from './Baked.js'
// import GoogleLeds from './GoogleLeds.js'
// import LoupedeckButtons from './LoupedeckButtons.js'
// import CoffeeSteam from './CoffeeSteam.js'
// import TopChair from './TopChair.js'
// import ElgatoLight from './ElgatoLight.js'
// import BouncingLogo from './BouncingLogo.js'
// import Screen from './Screen.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setPink()
                // this.setLights()
                // this.setBaked()
                // this.setGoogleLeds()
                // this.setLoupedeckButtons()
                // this.setCoffeeSteam()
                // this.setTopChair()
                // this.setElgatoLight()
                // this.setBouncingLogo()
                // this.setScreens()
            }
        })
    }

    setPink()
    {
        this.pink = new Pink()
    }
    setLights()
    {
        this.lights = {}
        this.lights.items = {}

        this.lights.items.directional = {}
        this.lights.items.directional.instance = new THREE.DirectionalLight( 0xffc375, 1.0 )
        this.lights.items.directional.instance.position.set(6,0,2)
        this.lights.items.directional.helper = new THREE.DirectionalLightHelper(this.lights.items.directional.instance, 2)
        
        this.lights.items.directional2 = {}
        this.lights.items.directional2.instance = new THREE.DirectionalLight( 0xff63d3, 1.0 )
        this.lights.items.directional2.instance.position.set(-6,0,2)
        this.lights.items.directional2.helper = new THREE.DirectionalLightHelper(this.lights.items.directional.instance, 2)
        
        // this.lights.items.sun = {}
        // this.lights.items.sun.instance =  new THREE.HemisphereLight( 0x03fcdb, 0xfc03be, 1 )
        // this.lights.items.sun.helper =  new THREE.HemisphereLightHelper(this.lights.items.sun.instance, 3)
        // this.lights.items.sun.instance.position.set(new THREE.Vector3(0,0,0))

        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );


        this.scene.add(this.lights.items.directional.instance)
        this.scene.add(this.lights.items.directional.helper)
        this.scene.add(this.lights.items.directional2.instance)
        this.scene.add(this.lights.items.directional2.helper)
        // this.scene.add(this.lights.items.sun.instance)
        // this.scene.add(this.lights.items.sun.helper)
    }

    // setBaked()
    // {
    //     this.baked = new Baked()
    // }

    // setGoogleLeds()
    // {
    //     this.googleLeds = new GoogleLeds()
    // }

    // setLoupedeckButtons()
    // {
    //     this.loupedeckButtons = new LoupedeckButtons()
    // }

    // setCoffeeSteam()
    // {
    //     this.coffeeSteam = new CoffeeSteam()
    // }

    // setTopChair()
    // {
    //     this.topChair = new TopChair()
    // }

    // setElgatoLight()
    // {
    //     this.elgatoLight = new ElgatoLight()
    // }

    // setBouncingLogo()
    // {
    //     this.bouncingLogo = new BouncingLogo()
    // }

    // setScreens()
    // {
    //     this.pcScreen = new Screen(
    //         this.resources.items.pcScreenModel.scene.children[0],
    //         '/assets/videoPortfolio.mp4'
    //     )
    //     this.macScreen = new Screen(
    //         this.resources.items.macScreenModel.scene.children[0],
    //         '/assets/videoStream.mp4'
    //     )
    // }

    resize()
    {
    }

    update()
    {
        // if(this.pink)
        //     this.pink.update()

        // if(this.googleLeds)
        //     this.googleLeds.update()

        // if(this.loupedeckButtons)
        //     this.loupedeckButtons.update()

        // if(this.coffeeSteam)
        //     this.coffeeSteam.update()

        // if(this.topChair)
        //     this.topChair.update()

        // if(this.bouncingLogo)
        //     this.bouncingLogo.update()
    }

    destroy()
    {
    }
}