import { useRef, useState,forwardRef,memo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Rocket(props) {
  const gltf = useLoader(GLTFLoader, "./Rocket_Airframe.glb");
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x = props.x, ref.current.rotation.y = props.y, ref.current.rotation.z = props.z))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}>
        <primitive object={gltf.scene} scale={0.2}  />
        <meshStandardMaterial />
    </mesh>
  )
}

export default function Model(props) {
  return (
    <div className='contents'>
      <div className='inline'>
        {
          // [...Array(10)].map((e, i) => <div key={i}>{i}</div>)
        }
      </div>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Rocket x={props.x} y={props.y} z={props.z} position={[0, 0, 0]} />
        <OrbitControls />
      </Canvas>
      <div></div>
    </div>
  )
}
