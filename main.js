const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene;
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
let cameraAngle = 0;
let cube;

let boid;

function start(){
    var xAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)]),
        new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    var yAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)]),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    var zAxis = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 10)]),
        new THREE.LineBasicMaterial({ color: 0x0000ff })
    );


    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.set(8,8,8);
    
    // Add axes to scene
    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);




    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 10, 20, 5 ); //default; light shining from top
    light.castShadow = true; // default false
    scene.add( light );



    boid = new Boid(0, 0, 0, 0.01, 0.01, 0.01);

    animate();
}







function animate() {
    renderer.setAnimationLoop(() => {
        camera.position.x = Math.cos(cameraAngle) * 50;
        camera.position.y = 8;
        camera.position.z = Math.sin(cameraAngle) * 50;
        cameraAngle += 0.001;

        camera.lookAt(0, 0, 0);

        boid.move();

        renderer.render(scene, camera);
    });
}







class Boid{
    constructor(x, y, z, vX, vY, vZ){
        const geometry = new THREE.BoxGeometry( 5, 1, 1 ); 
        geometry.translate(2.5, 0, 0);
        const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} ); 
        this.body = new THREE.Mesh( geometry, material ); 
        this.body.position.set(x,y,z);

        this.vX = vX;
        this.vY = vY;
        this.vZ = vZ;


        this.body.castShadow = true;
        this.body.receiveShadow = false; 


        scene.add( this.body );
    }


    move(){
        this.body.position.set(this.body.position.x + this.vX, this.body.position.y + this.vY, this.body.position.z + this.vZ);
        this.rotateToVelocity();
    }    


    rotateToVelocity(){
        var magnitude = Math.sqrt(this.vX * this.vX + this.vY * this.vY + this.vZ * this.vZ);

        var pitch = Math.asin(this.vY / magnitude);

        var yaw = Math.atan2(-this.vZ, this.vX);

        this.body.rotation.z = pitch;
        this.body.rotation.y = yaw;
    }
}



