const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let boidAmount = 10;
let wallLength = 50;

let turningSpeed = 0.0005;
let repulsionForceCof = 0.003;
let attractionForceCof = 0.00005;
let distForRepulsion = 0.5;
let maxSpeed = 0.5;

const scene = new THREE.Scene;
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 200);
let cameraAngle = 0;
let cube;



let boids = [];

let stepCountForMirroring = 0;

function start(){
    let wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    wallMaterial.castShadow = true;
    wallMaterial.receiveShadow = true;
    

    let wallGeometryH = new THREE.BoxGeometry(wallLength, wallLength, 1);
    let wall1 = new THREE.Mesh( wallGeometryH, wallMaterial ); 
    wall1.position.set(0, 0, -wallLength/2);
    scene.add(wall1);

    let wallGeometryV = new THREE.BoxGeometry(1, wallLength, wallLength);
    let wall2 = new THREE.Mesh( wallGeometryV, wallMaterial ); 
    wall2.position.set(-wallLength/2, 0, 0);
    scene.add(wall2);
    

    let wall3 = new THREE.Mesh( wallGeometryV, wallMaterial ); 
    wall3.position.set(wallLength/2, 0, 0);
    scene.add(wall3);

    let wall4 = new THREE.Mesh( wallGeometryH, wallMaterial ); 
    wall4.position.set(0, 0, wallLength/2);
    scene.add(wall4);


    let wallGeometryF = new THREE.BoxGeometry(wallLength, 1, wallLength);
    let wall5 = new THREE.Mesh( wallGeometryF, wallMaterial ); 
    wall5.position.set(0, -wallLength/2, 0);
    scene.add(wall5);

    let wall6 = new THREE.Mesh( wallGeometryF, wallMaterial ); 
    wall6.position.set(0, wallLength/2, 0);
    scene.add(wall6);
    


    let target = new THREE.Object3D();
    target.position.set( -6, -wallLength / 2,-6);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, wallLength/2,0); 
    directionalLight.target = target;
    directionalLight.castShadow = true;
    directionalLight.intensity = 2;


    directionalLight.shadow.camera.left = -wallLength / 2 - 1; // Set left boundary
    directionalLight.shadow.camera.right = wallLength / 2 + 1; // Set right boundary
    directionalLight.shadow.camera.top = wallLength / 2 + 1; // Set top boundary
    directionalLight.shadow.camera.bottom = -wallLength / 2 -1; // Set bottom boundary

    scene.add(directionalLight);
    scene.add(target);

    let cubeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    let cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(directionalLight.position.x, directionalLight.position.y, directionalLight.position.z);

    scene.add(cube);



   
   
    for(let i = 0;i < boidAmount;i++){
        boids.push(new Boid(
           Math.random() * wallLength - wallLength / 2, Math.random() * wallLength - wallLength / 2, Math.random() * wallLength - wallLength / 2,
            Math.random()* 0.1, Math.random()* 0.1, Math.random()* 0.1));
    }

    setInterval(()=>{
        animate();
    }, 0.1);
}


function animate() {
        let myBoid = boids[0];

        let aX=0, aY=0, aZ=0;
        boids.forEach(boid =>{
            aX += boid.body.position.x;
            aY += boid.body.position.y;
            aZ += boid.body.position.z;
        });
        aX /= boids.length;
        aY /= boids.length;
        aZ /= boids.length;


        let cameraOffset = new THREE.Vector3(-5, 3, -5); 

        let cameraPosition = new THREE.Vector3(aX,aY,aZ).add(cameraOffset);
        camera.position.copy(cameraPosition);
        camera.lookAt(new THREE.Vector3(aX, aY, aZ));
            
        //camera static

        boids.forEach(boid =>{
            if(boid.body.position.x > wallLength / 2 - 2){
                boid.vX *= -1;
                boid.body.position.x -= 1;
                return;
            }
            
            if(boid.body.position.y > wallLength / 2 - 2){
                boid.vY *= -1;
                boid.body.position.y -= 1;
                return;
            }

            if(boid.body.position.z > wallLength / 2 - 2){
                boid.vZ *= -1;
                boid.body.position.z -= 1;
                return;
            }

            if(boid.body.position.x < -wallLength / 2 + 2){
                boid.vX *= -1;
                boid.body.position.x += 1;
                return;
            }
            
            if(boid.body.position.y < -wallLength / 2 + 2){
                boid.vY *= -1;
                boid.body.position.y += 1;
                return;
            }


            if(boid.body.position.z < -wallLength / 2 + 2){
                boid.vZ *= -1;
                boid.body.position.z += 1;
                return;
            }
        });

        let dist = 20;
        camera.position.set(wallLength/2 - 1, 0, wallLength/2-1);

        //camera.position.set(40, 20 ,40)
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.lookAt(new THREE.Vector3(aX, aY, aZ));

        boids.forEach(boid =>{
            boid.move();
        });

        renderer.render(scene, camera);
}


class Boid{
    constructor(x, y, z, vX, vY, vZ){
        const geometry = new THREE.BoxGeometry(2, 0.8, 0.8 ); 
        geometry.translate(2.5, 0, 0);
        const material = new THREE.MeshStandardMaterial( {color: 0x00bb00} ); 
        material.castShadow  = true;
        material.receiveShadow = true;
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
        
                this.vX += (tVX - this.vX)*turningSpeed;
                this.vY += (tVY - this.vY)*turningSpeed;
                this.vZ += (tVZ - this.vZ)*turningSpeed;
            }
        }

            //kustiba
       
            let repulsionForce = new THREE.Vector3(0,0,0);
            let attractionForce = new THREE.Vector3(0,0,0);
            boids.forEach(boid => {
                if (boid.body.position.x !== this.body.position.x || boid.body.position.z !== this.body.position.z || boid.body.position.y !== this.body.position.y) {
                    //not myself

                    //repulsion
                    if(boid.body.position.distanceTo(this.body.position) < distForRepulsion){
                        let vec = new THREE.Vector3(boid.body.position.x - this.body.position.x, boid.body.position.y - this.body.position.y, boid.body.position.z - this.body.position.z);
                        vec.negate();
                        let length = vec.length();
                        vec.normalize();
                        let oppositeLength = 1 /(0.1);
                        
                        vec.multiplyScalar(oppositeLength * repulsionForceCof);
    
                        repulsionForce.x = repulsionForce.x + vec.x;
                        repulsionForce.y = repulsionForce.y + vec.y;
                        repulsionForce.z = repulsionForce.z + vec.z;
                    }else{
                        let vec = new THREE.Vector3(boid.body.position.x - this.body.position.x, boid.body.position.y - this.body.position.y, boid.body.position.z - this.body.position.z);
                        vec.negate();
                        let length = vec.length();
                        vec.normalize();
                        let oppositeLength = 1 /(0.4*(length+distForRepulsion));
                        
                        vec.multiplyScalar(oppositeLength * repulsionForceCof);
    
                        repulsionForce.x = repulsionForce.x + vec.x;
                        repulsionForce.y = repulsionForce.y + vec.y;
                        repulsionForce.z = repulsionForce.z + vec.z;
                    }
                    

                    //attraction
                    let vecA = new THREE.Vector3(boid.body.position.x - this.body.position.x, boid.body.position.y - this.body.position.y, boid.body.position.z - this.body.position.z);
                    vecA.multiplyScalar(attractionForceCof);

                    attractionForce.x = attractionForce.x + vecA.x;
                    attractionForce.y = attractionForce.y + vecA.y;
                    attractionForce.z = attractionForce.z + vecA.z;           
                }
            });

            

            this.vX += (attractionForce.x + repulsionForce.x);
            this.vY += (attractionForce.y + repulsionForce.y);
            this.vZ += (attractionForce.z + repulsionForce.z);
            let v = new THREE.Vector3((this.vX),(this.vY),(this.vZ));
            if(v.length() > maxSpeed){
                v.normalize();
                v.multiplyScalar(maxSpeed);
            }   
        
        
            this.body.position.set(this.body.position.x + v.x, this.body.position.y + v.y, this.body.position.z + v.z);
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



