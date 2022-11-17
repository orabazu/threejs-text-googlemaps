import './style.css'

import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { ThreeJSOverlayView, latLngToVector3 } from '@googlemaps/three';

import { Loader } from '@googlemaps/js-api-loader';

export const LOADER_OPTIONS = {
  apiKey: 'AIzaSyDI5xMgEfYEvmyTun_GuSAtdetEuAIxoy0',
  version: 'beta',
  libraries: [],
};

const mapOptions = {
  center: {
    lat: 41.025615,
    lng: 28.974133,
  },
  zoom: 17,
  heading: 60,
  tilt: 50,
  mapId: 'fb9023c973f94f3a',
};

new Loader(LOADER_OPTIONS).load().then(() => {
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(1000, 500, -10000000000)
  directionalLight.intensity = 1
  scene.add(directionalLight);


  const fontLoader = new FontLoader();

  fontLoader.load('./font.json', function (font) {

    const title = 'ISTANBUL';

    const titleGeom = new TextGeometry(title, {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xff2d00,
      specular: 0xffffff,
    });

    const titleMesh = new THREE.Mesh(titleGeom, textMaterial);
    // set position behind the tower
    titleMesh.position.copy(
      latLngToVector3({
        lat: 41.024615,
        lng: 28.974533,
      })
    );
    // set position vertically
    titleMesh.position.setY(30);
    titleMesh.scale.set(0.3, 0.3, 0.3);
    titleMesh.castShadow = true;
    titleMesh.receiveShadow = true;
    titleMesh.rotation.y = - Math.PI;

    scene.add(titleMesh);

  },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // onError callback
    function (err) {
      console.log('An error happened');
      console.error(err);
    }
  );


  const animate = () => {

    const mapOptions = {
      tilt: map?.getTilt() || 0,
      heading: map?.getHeading() || 0,
      zoom: map?.getZoom() || 0,
    };

    if (mapOptions.tilt < 67.5) {
      mapOptions.tilt += 0.5;
      mapOptions.heading += 1;
      mapOptions.zoom += 0.005;
    } else if (mapOptions.heading <= 210) {
      mapOptions.heading += 0.4;
      mapOptions.zoom += 0.007;
    } else {
      // exit animation loop
      return;
    }

    const { tilt, heading, zoom } = mapOptions;
    map.moveCamera({ tilt, heading, zoom });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);


  // instantiate the ThreeJS Overlay with the scene and map
  const overlay = new ThreeJSOverlayView({
    scene,
    map,
    THREE,
  });



});




