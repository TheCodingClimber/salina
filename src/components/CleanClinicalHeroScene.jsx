import { useEffect, useRef } from "react";
import * as THREE from "three";

function disposeMaterial(material) {
  if (material.map) {
    material.map.dispose();
  }

  material.dispose();
}

function easeInOut(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function smoothstep(edge0, edge1, value) {
  const x = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function createSpeechBubbleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const radius = 42;
  const left = 34;
  const top = 24;
  const width = 444;
  const height = 154;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255, 252, 248, 0.96)";
  context.strokeStyle = "rgba(191, 208, 202, 0.92)";
  context.lineWidth = 8;

  context.beginPath();
  context.moveTo(left + radius, top);
  context.lineTo(left + width - radius, top);
  context.quadraticCurveTo(left + width, top, left + width, top + radius);
  context.lineTo(left + width, top + height - radius);
  context.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
  context.lineTo(left + width / 2 + 32, top + height);
  context.lineTo(left + width / 2, top + height + 32);
  context.lineTo(left + width / 2 - 26, top + height);
  context.lineTo(left + radius, top + height);
  context.quadraticCurveTo(left, top + height, left, top + height - radius);
  context.lineTo(left, top + radius);
  context.quadraticCurveTo(left, top, left + radius, top);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = "#2e5454";
  context.font = "700 56px Manrope, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("knock knock", canvas.width / 2, 102);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTree(x, z) {
  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.36, 10),
    new THREE.MeshStandardMaterial({ color: 0x8d6446, roughness: 0.92 }),
  );
  trunk.position.y = 0.18;
  group.add(trunk);

  const foliage = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 18, 18),
    new THREE.MeshStandardMaterial({ color: 0x7db8a6, roughness: 0.75 }),
  );
  foliage.position.y = 0.46;
  group.add(foliage);

  group.position.set(x, 0, z);
  return group;
}

function createHouse(x, z, scale = 1) {
  const group = new THREE.Group();
  const wallHeight = 0.72 * scale;
  const roofHeight = 0.52 * scale;

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(1.05 * scale, wallHeight, 0.88 * scale),
    new THREE.MeshStandardMaterial({ color: 0xf9f4ea, roughness: 0.84 }),
  );
  wall.position.y = wallHeight / 2;
  group.add(wall);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.78 * scale, roofHeight, 4),
    new THREE.MeshStandardMaterial({ color: 0xd39a72, roughness: 0.8 }),
  );
  roof.position.y = wallHeight + roofHeight / 2 + 0.04 * scale;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.18 * scale, 0.34 * scale, 0.06 * scale),
    new THREE.MeshStandardMaterial({ color: 0x9c714e, roughness: 0.78 }),
  );
  door.position.set(0, 0.18 * scale, 0.46 * scale);
  group.add(door);

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbeff4,
    emissive: 0xa7dfe7,
    emissiveIntensity: 0.16,
    roughness: 0.32,
  });

  [-0.28, 0.28].forEach((offsetX) => {
    const windowPane = new THREE.Mesh(
      new THREE.BoxGeometry(0.2 * scale, 0.18 * scale, 0.05 * scale),
      windowMaterial.clone(),
    );
    windowPane.position.set(offsetX * scale, 0.42 * scale, 0.46 * scale);
    group.add(windowPane);
  });

  const step = new THREE.Mesh(
    new THREE.BoxGeometry(0.34 * scale, 0.05 * scale, 0.18 * scale),
    new THREE.MeshStandardMaterial({ color: 0xe4ddd2, roughness: 0.95 }),
  );
  step.position.set(0, 0.03 * scale, 0.54 * scale);
  group.add(step);

  group.position.set(x, 0, z);
  return group;
}

function createFacility(x, z) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 1.42, 1.16),
    new THREE.MeshStandardMaterial({ color: 0xf6f8f7, roughness: 0.8 }),
  );
  body.position.y = 0.71;
  group.add(body);

  const accentBand = new THREE.Mesh(
    new THREE.BoxGeometry(1.56, 0.16, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x7bb4ab, roughness: 0.65 }),
  );
  accentBand.position.y = 1.18;
  group.add(accentBand);

  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.08, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xd5a47c, roughness: 0.7 }),
  );
  awning.position.set(0, 0.48, 0.73);
  group.add(awning);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.42, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x87b8c3, roughness: 0.28 }),
  );
  door.position.set(0, 0.23, 0.62);
  group.add(door);

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xcdebf4,
    emissive: 0xa9dbe2,
    emissiveIntensity: 0.14,
    roughness: 0.28,
  });

  [-0.38, 0, 0.38].forEach((offsetX) => {
    [0.46, 0.84].forEach((offsetY) => {
      const windowPane = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.18, 0.05),
        windowMaterial.clone(),
      );
      windowPane.position.set(offsetX, offsetY, 0.61);
      group.add(windowPane);
    });
  });

  const annex = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.88, 0.88),
    new THREE.MeshStandardMaterial({ color: 0xecf2ef, roughness: 0.85 }),
  );
  annex.position.set(1.18, 0.44, -0.02);
  group.add(annex);

  group.position.set(x, 0, z);
  return group;
}

function getCurveYaw(curve, progress, direction = "forward") {
  const tangent = curve.getTangentAt(progress).normalize();
  const facing = direction === "reverse" ? tangent.multiplyScalar(-1) : tangent;
  return Math.atan2(facing.x, facing.z);
}

function setCarFromCurve(curve, progress, carGroup, direction = "forward") {
  const point = curve.getPointAt(progress);
  carGroup.position.set(point.x, 0.24, point.z);
  carGroup.rotation.y = getCurveYaw(curve, progress, direction);
}

export default function CleanClinicalHeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf3f7f4, 12, 22);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const frustumSize = 7.2;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
    camera.position.set(7.4, 7.1, 7.4);
    camera.lookAt(0, 0.4, 0);

    const keyLight = new THREE.DirectionalLight(0xfffcf7, 2.9);
    keyLight.position.set(5.6, 8.2, 3.6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbceae0, 1.4);
    fillLight.position.set(-4.2, 5.5, 6.4);
    scene.add(fillLight);

    const ambient = new THREE.AmbientLight(0xf3f0e8, 1.7);
    scene.add(ambient);

    const mapGroup = new THREE.Group();
    mapGroup.position.set(0, 0.62, 0.18);
    scene.add(mapGroup);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(5.6, 64),
      new THREE.MeshBasicMaterial({
        color: 0x9bc7bf,
        opacity: 0.09,
        transparent: true,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.24;
    shadow.scale.set(1.45, 1, 0.82);
    mapGroup.add(shadow);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 0.34, 6.5),
      new THREE.MeshStandardMaterial({ color: 0xf8f3ec, roughness: 0.96 }),
    );
    board.position.y = -0.16;
    mapGroup.add(board);

    const topSurface = new THREE.Mesh(
      new THREE.BoxGeometry(11.04, 0.04, 6.34),
      new THREE.MeshStandardMaterial({ color: 0xfaf8f3, roughness: 0.95 }),
    );
    topSurface.position.y = 0.03;
    mapGroup.add(topSurface);

    const lawnLeft = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.03, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xe2f1eb, roughness: 1 }),
    );
    lawnLeft.position.set(-2.35, 0.05, -1.85);
    mapGroup.add(lawnLeft);

    const cityPad = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.03, 2.8),
      new THREE.MeshStandardMaterial({ color: 0xf0f3f0, roughness: 0.98 }),
    );
    cityPad.position.set(3.5, 0.05, -1.85);
    mapGroup.add(cityPad);

    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ba6aa,
      roughness: 0.9,
    });

    const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.05, 0.92), roadMaterial);
    mainRoad.position.set(0, 0.08, 0.62);
    mapGroup.add(mainRoad);

    const homeLane = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.05, 1.56), roadMaterial);
    homeLane.position.set(-1.55, 0.08, -0.14);
    mapGroup.add(homeLane);

    const officeLane = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.05, 1.66), roadMaterial);
    officeLane.position.set(3.25, 0.08, -0.1);
    mapGroup.add(officeLane);

    const centerLineMaterial = new THREE.MeshBasicMaterial({ color: 0xf5f4ef });
    for (let x = -4.75; x <= 4.75; x += 0.68) {
      const dash = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.02, 0.06),
        centerLineMaterial,
      );
      dash.position.set(x, 0.12, 0.62);
      mapGroup.add(dash);
    }

    mapGroup.add(createHouse(-1.55, -1.85, 1));
    mapGroup.add(createHouse(-3.55, -1.95, 0.78));
    mapGroup.add(createHouse(-3.7, 1.85, 0.72));

    mapGroup.add(createFacility(3.25, -1.82));
    mapGroup.add(createFacility(4.95, -1.68));

    [
      [-2.6, -0.9],
      [-3.1, -2.85],
      [-4.3, 1.4],
      [-2.35, 1.95],
      [1.85, 1.65],
      [4.05, 1.58],
      [5.15, 0.98],
    ].forEach(([x, z]) => {
      mapGroup.add(createTree(x, z));
    });

    const homeArrivalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.2, 0.24, 0.62),
      new THREE.Vector3(-4.7, 0.24, 0.62),
      new THREE.Vector3(-3.2, 0.24, 0.62),
      new THREE.Vector3(-1.9, 0.24, 0.62),
      new THREE.Vector3(-1.55, 0.24, 0.25),
      new THREE.Vector3(-1.55, 0.24, -0.32),
    ]);

    const homeReverseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, 0.24, -0.32),
      new THREE.Vector3(-1.55, 0.24, -0.02),
      new THREE.Vector3(-1.46, 0.24, 0.32),
      new THREE.Vector3(-1.66, 0.24, 0.56),
      new THREE.Vector3(-2.02, 0.24, 0.62),
    ]);

    const cityForwardCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.02, 0.24, 0.62),
      new THREE.Vector3(0.5, 0.24, 0.62),
      new THREE.Vector3(1.9, 0.24, 0.62),
      new THREE.Vector3(2.95, 0.24, 0.62),
      new THREE.Vector3(3.25, 0.24, 0.28),
      new THREE.Vector3(3.25, 0.24, -0.38),
    ]);

    const officeReverseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.25, 0.24, -0.38),
      new THREE.Vector3(3.25, 0.24, -0.05),
      new THREE.Vector3(3.16, 0.24, 0.28),
      new THREE.Vector3(3.02, 0.24, 0.55),
      new THREE.Vector3(2.72, 0.24, 0.62),
    ]);

    const exitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.72, 0.24, 0.62),
      new THREE.Vector3(5.15, 0.24, 0.62),
      new THREE.Vector3(6.4, 0.24, 0.62),
    ]);

    const carGroup = new THREE.Group();
    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.14, 0.56),
      new THREE.MeshStandardMaterial({ color: 0x277471, roughness: 0.5 }),
    );
    carBody.position.y = 0.1;
    carGroup.add(carBody);

    const carRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.11, 0.26),
      new THREE.MeshStandardMaterial({ color: 0xfaf7f1, roughness: 0.48 }),
    );
    carRoof.position.set(0, 0.22, -0.02);
    carGroup.add(carRoof);

    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.08, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0xbfe6ef,
        emissive: 0x8ccdd7,
        emissiveIntensity: 0.12,
        roughness: 0.25,
      }),
    );
    windshield.position.set(0, 0.21, 0.14);
    carGroup.add(windshield);

    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x3d4a4d, roughness: 0.92 });
    [
      [-0.13, 0.05, 0.18],
      [0.13, 0.05, 0.18],
      [-0.13, 0.05, -0.18],
      [0.13, 0.05, -0.18],
    ].forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      carGroup.add(wheel);
    });
    mapGroup.add(carGroup);

    const serviceDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x8bcfc0,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      }),
    );
    serviceDot.visible = false;
    mapGroup.add(serviceDot);

    const serviceHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 18, 18),
      new THREE.MeshBasicMaterial({
        color: 0x9ce6d5,
        opacity: 0.18,
        transparent: true,
      }),
    );
    serviceHalo.visible = false;
    mapGroup.add(serviceHalo);

    const bubbleTexture = createSpeechBubbleTexture();
    const bubble = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: bubbleTexture ?? undefined,
        opacity: 0,
        transparent: true,
      }),
    );
    bubble.scale.set(1.8, 0.95, 1);
    bubble.visible = false;
    mapGroup.add(bubble);

    const homePark = new THREE.Vector3(-1.55, 0.24, -0.32);
    const homeDoor = new THREE.Vector3(-1.55, 0.22, -1.16);
    const officePark = new THREE.Vector3(3.25, 0.24, -0.38);
    const officeDoor = new THREE.Vector3(3.25, 0.22, -1.18);

    const setBubbleState = (target, strength) => {
      if (strength <= 0.001) {
        bubble.visible = false;
        bubble.material.opacity = 0;
        return;
      }

      bubble.visible = true;
      bubble.position.set(target.x, target.y + 1.02, target.z);
      bubble.material.opacity = strength;
      const scale = 1.55 + strength * 0.35;
      bubble.scale.set(scale, scale * 0.54, 1);
    };

    const setDotState = (from, to, progress) => {
      const dotStrength = smoothstep(0, 0.2, progress) * (1 - smoothstep(0.86, 1, progress));
      if (dotStrength <= 0.001) {
        serviceDot.visible = false;
        serviceHalo.visible = false;
        return;
      }

      const travel = easeInOut(Math.min(progress / 0.62, 1));
      serviceDot.visible = true;
      serviceHalo.visible = true;
      serviceDot.position.lerpVectors(from, to, travel);
      serviceHalo.position.copy(serviceDot.position);
      const haloScale = 1 + dotStrength * 0.7;
      serviceHalo.scale.setScalar(haloScale);
      serviceHalo.material.opacity = 0.12 + dotStrength * 0.14;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const aspect = width / height;

      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let isAnimating = !reduceMotion.matches;

    const renderScene = () => {
      const loopDuration = 18;
      const elapsed = clock.getElapsedTime();
      const progress = (elapsed % loopDuration) / loopDuration;

      mapGroup.rotation.y = Math.sin(elapsed * 0.1) * 0.025;

      serviceDot.visible = false;
      serviceHalo.visible = false;
      bubble.visible = false;
      bubble.material.opacity = 0;
      carGroup.visible = true;

      if (isAnimating) {
        if (progress < 0.24) {
          setCarFromCurve(homeArrivalCurve, easeInOut(progress / 0.24), carGroup);
        } else if (progress < 0.38) {
          setCarFromCurve(homeArrivalCurve, 1, carGroup);
          const local = (progress - 0.24) / 0.14;
          setDotState(homePark, homeDoor, local);
          const bubbleStrength =
            smoothstep(0.44, 0.62, local) * (1 - smoothstep(0.88, 1, local));
          setBubbleState(homeDoor, bubbleStrength);
        } else if (progress < 0.5) {
          setCarFromCurve(homeReverseCurve, easeInOut((progress - 0.38) / 0.12), carGroup, "reverse");
        } else if (progress < 0.72) {
          setCarFromCurve(cityForwardCurve, easeInOut((progress - 0.5) / 0.22), carGroup);
        } else if (progress < 0.84) {
          setCarFromCurve(cityForwardCurve, 1, carGroup);
          const local = (progress - 0.72) / 0.12;
          setDotState(officePark, officeDoor, local);
          const bubbleStrength =
            smoothstep(0.42, 0.6, local) * (1 - smoothstep(0.88, 1, local));
          setBubbleState(officeDoor, bubbleStrength);
        } else if (progress < 0.95) {
          setCarFromCurve(officeReverseCurve, easeInOut((progress - 0.84) / 0.11), carGroup, "reverse");
        } else {
          setCarFromCurve(exitCurve, easeInOut((progress - 0.95) / 0.05), carGroup);
        }
      } else {
        setCarFromCurve(homeArrivalCurve, 1, carGroup);
        setDotState(homePark, homeDoor, 0.7);
        setBubbleState(homeDoor, 0.9);
        mapGroup.rotation.y = 0.03;
      }

      renderer.render(scene, camera);

      if (isAnimating) {
        frameId = window.requestAnimationFrame(renderScene);
      }
    };

    const handleMotionPreference = () => {
      isAnimating = !reduceMotion.matches;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      clock.start();
      renderScene();
    };

    handleMotionPreference();
    reduceMotion.addEventListener("change", handleMotionPreference);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      reduceMotion.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(disposeMaterial);
          } else {
            disposeMaterial(object.material);
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
