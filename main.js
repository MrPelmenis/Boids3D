const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene;
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
let cameraAngle = 0;
let cube;


let turningSpeedDivider = 1000;
let transitionSpeed = 0.0001;
let spreadSpeed = 0.1;
let minDist = 1;

let boids = [];

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


    var grid = new THREE.GridHelper(1000, 200);
    scene.add(grid);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);




    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 50, 0 );
    light.castShadow = true;
    light.intensity = 20;
    scene.add( light );




   

    for(let i = 0;i<2;i++){
        boids.push(new Boid(0,0,0, Math.random()*0.01, Math.random()*0.01, Math.random()*0.01));
    }


    animate();
}







function animate() {
    renderer.setAnimationLoop(() => {
        let myBoid = boids[0];
        //camera follows my boid
        camera.position.copy(myBoid.body.position);
        camera.position.add(new THREE.Vector3(-5, 3, -5));
        camera.lookAt(myBoid.body.position.x, myBoid.body.position.y, myBoid.body.position.z);


        //camera static
        let dist = 20;
        camera.position.set(-dist, 20, -dist);
        camera.lookAt(0,0,0);

        boids.forEach(boid =>{
            boid.move();
        })

        renderer.render(scene, camera);
    });
}







class Boid{
    constructor(x, y, z, vX, vY, vZ){
        const geometry = new THREE.BoxGeometry( 2, 0.4, 0.4 ); 
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

        //alignment
        {
            let count = 0;
        let tVX = 0;
        let tVY = 0;
        let tVZ = 0;
        boids.forEach(boid =>{
            if(boid.body.position.x != this.body.position.x || boid.body.position.z != this.body.position.z || boid.body.position.y != this.body.position.y ){
                count++;
                tVX += boid.vX;
                tVY +=boid.vY;
                tVZ += boid.vZ;
            }
        });

        if(count != 0){
            tVX /= count;
            tVY /= count;
            tVZ /= count;
    
            this.vX += (tVX - this.vX)/turningSpeedDivider;
            this.vY += (tVY - this.vY)/turningSpeedDivider;
            this.vZ += (tVZ - this.vZ)/turningSpeedDivider;
        }
        }

        
        
        
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



