import * as THREE from "three";
import html2canvas from "html2canvas";
import gsap from "gsap";

let scene, camera, renderer;
let bookGroup;
let pages = [];
let coverFront, coverBack;
const PAGE_WIDTH = 680;
const PAGE_HEIGHT = 800;
let isInitialized = false;
let placeholderTexture = null;
let needsRender = true; // Optimization flag

export function initThreeBook() {
  if (isInitialized) return; // Impede loops infinitos e vazamento absurdo de RAM criando renderizadores duplicados
  const canvas = document.getElementById("webgl-book-canvas");
  if (!canvas) return;
  isInitialized = true;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Interações de clique no Canvas 3D
  canvas.addEventListener("click", (event) => {
    const bookContainer = document.getElementById("offscreen-book-render");
    const isOpen = bookContainer && bookContainer.classList.contains("open");

    if (!isOpen) {
      if (typeof window.openRealBook === "function") {
        window.openRealBook();
      }
      return;
    }

    // Se o livro está aberto, dispara o Raycaster para mapear UVs de clique
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pages, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      let clickedMesh = intersect.object;

      // Subir na hierarquia se o clique atingiu uma página filler (filha)
      let mainPage = clickedMesh;
      if (
        clickedMesh.parent &&
        clickedMesh.parent !== bookGroup &&
        pages.includes(clickedMesh.parent)
      ) {
        mainPage = clickedMesh.parent;
      }

      const pageIndex = pages.indexOf(mainPage);
      if (pageIndex === -1) return;

      const normal = intersect.face.normal;
      const isBack = normal.z < -0.5;
      const isFront = normal.z > 0.5;

      // Envia o hit para a DOM HTML oculta decifrar
      if ((isBack || isFront) && window.handleBookClick) {
        window.handleBookClick(pageIndex, isBack, intersect.uv);
      }
    }
  });

  // Init Three.js
  scene = new THREE.Scene();

  // Camera (aspect initial pode ser NaN se tab oculta, será arrumado no resize)
  const cw = canvas.clientWidth || 1000;
  const ch = canvas.clientHeight || 800;
  camera = new THREE.PerspectiveCamera(45, cw / ch, 1, 5000);
  camera.position.set(0, 0, 1000);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(cw, ch, false); // FALSE é crucial para não zerar o style CSS quando display: none
  // Limita RAM/GPU em telas retina
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  window.addEventListener("resize", () => {
    if (canvas && renderer) {
      const rcw = canvas.clientWidth || 1000;
      const rch = canvas.clientHeight || 800;
      camera.aspect = rcw / rch;
      camera.updateProjectionMatrix();
      renderer.setSize(rcw, rch, false);
      needsRender = true;
    }
  });

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.0);
  dirLight.position.set(0, 500, 1000);
  scene.add(dirLight);

  // Book Group
  bookGroup = new THREE.Group();
  bookGroup.position.set(-340, 0, 0); // Centered when closed
  scene.add(bookGroup);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (needsRender && renderer && scene && camera) {
    renderer.render(scene, camera);
    needsRender = false; // Só renderiza quando necessário (poupa CPU/GPU)
  }
}

export function requestBookRender() {
  needsRender = true;
}

export async function capturePageTexture(
  elementOrId,
  forceHtml2Canvas = false,
) {
  let element =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;
  if (!element) return null;

  // Use native Canvas 2D instead of html2canvas for guaranteed rendering
  const canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  if (element.classList.contains("real-book-cover-front")) {
    // Draw Cover Front
    const gradient = ctx.createLinearGradient(0, 0, 680, 800);
    gradient.addColorStop(0, "#2b120c");
    gradient.addColorStop(1, "#1c0a06");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 680, 800);

    // Border
    ctx.strokeStyle = "#1a0805";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 680, 800);

    // Inner Border
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 650, 770);

    // Title
    ctx.fillStyle = "#e6c27a";
    ctx.font = 'bold 50px "Courier New", Courier, monospace';
    ctx.textAlign = "center";
    ctx.fillText("Enciclopédia", 340, 300);
    ctx.fillText("de", 340, 360);
    ctx.fillText("Sanctuary", 340, 420);

    // Subtitle
    ctx.fillStyle = "#b8860b";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("Clique para Abrir", 340, 520);

    // Retornar a textura da capa frontal (estava faltando!)
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  } else if (element.classList.contains("real-book-cover-back")) {
    // Draw Cover Back (Match Front Cover Palette)
    const gradient = ctx.createLinearGradient(0, 0, 680, 800);
    gradient.addColorStop(0, "#2b120c");
    gradient.addColorStop(1, "#1c0a06");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 680, 800);

    ctx.strokeStyle = "#1a0805";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 680, 800);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  } else {
    // For interior pages
    if (forceHtml2Canvas) {
      try {
        const htmlCanvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 1, // Reduzido de 1.5 para 1 para salvar RAM e ficar mais rápido
          logging: false,
          onclone: (clonedDoc) => {
            const offscreen = clonedDoc.getElementById("offscreen-book-render");
            if (offscreen) offscreen.style.opacity = "1";
          },
        });
        const texture = new THREE.CanvasTexture(htmlCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
      } catch (e) {
        console.error("html2canvas falhou na pagina interior:", e);
        ctx.fillStyle = "#f4e4bc";
        ctx.fillRect(0, 0, 680, 800);
        return new THREE.CanvasTexture(canvas);
      }
    }

    // Fast placeholder for build phase - RECICLA O TEXTURE PRA NÃO AFOGAR A MEMÓRIA DA GPU!
    if (!placeholderTexture) {
      const phCanvas = document.createElement("canvas");
      phCanvas.width = 680;
      phCanvas.height = 800;
      const phCtx = phCanvas.getContext("2d");
      phCtx.fillStyle = "#f4e4bc";
      phCtx.fillRect(0, 0, 680, 800);
      phCtx.fillStyle = "#c8a87b";
      phCtx.font = "italic 20px Georgia";
      phCtx.fillText("As páginas se revelam ao toque...", 180, 400);
      placeholderTexture = new THREE.CanvasTexture(phCanvas);
      placeholderTexture.minFilter = THREE.LinearFilter;
    }
    return placeholderTexture;
  }
}

export async function buildThreeBook(totalPages) {
  // Clear old book and FIX MEMORY LEAK (DISPOSE GPU MEMORY)
  while (bookGroup.children.length > 0) {
    const child = bookGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      mats.forEach((mat) => {
        // Não descarta as texturas globais
        if (mat.map && mat.map !== placeholderTexture) {
          mat.map.dispose();
        }
        mat.dispose();
      });
    }
    bookGroup.remove(child);
  }
  pages = [];

  // Usar BoxGeometry mais grossa para dar volume real ao livro
  const geometry = new THREE.BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, 2);
  geometry.translate(PAGE_WIDTH / 2, 0, 0);

  const baseSideMat = new THREE.MeshLambertMaterial({ color: 0xdeb887 }); // Base para a lombada e backup

  // Capture Cover
  const coverFrontEl = document.querySelector(
    "#book-cover-element .real-book-cover-front",
  );
  const coverBackEl = document.querySelector(
    "#book-cover-element .real-book-cover-back",
  );
  console.log("Cover Elements:", coverFrontEl, coverBackEl);

  const coverFrontTex = await capturePageTexture(coverFrontEl);
  const coverBackTex = await capturePageTexture(coverBackEl);
  console.log("Cover Textures captured:", !!coverFrontTex, !!coverBackTex);

  if (coverFrontTex) {
    const matFront = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: coverFrontTex,
      transparent: true,
    });
    const matBack = coverBackTex
      ? new THREE.MeshLambertMaterial({
          color: 0xffffff,
          map: coverBackTex,
          transparent: true,
        })
      : matFront;
    const coverMats = [
      baseSideMat,
      baseSideMat,
      baseSideMat,
      baseSideMat,
      matFront,
      matBack,
    ];

    // Front cover (moves left when opened)
    coverFront = new THREE.Mesh(geometry, coverMats);
    coverFront.userData.baseZ = 25; // Store base Z for stacking logic
    coverFront.position.z = 25;
    coverFront.scale.set(1.08, 1.06, 1);
    bookGroup.add(coverFront);

    // Back cover (stays on the right)
    coverBack = new THREE.Mesh(geometry, coverMats);
    coverBack.userData.baseZ = -25; // Behind all pages
    coverBack.position.z = -25;
    coverBack.scale.set(1.12, 1.08, 1);
    bookGroup.add(coverBack);

    // Spine to separate pages and look bound
    const spineGeo = new THREE.BoxGeometry(30, PAGE_HEIGHT * 1.04, 55);
    spineGeo.translate(-15, 0, 0); // align with the left edge pivot
    const spineMesh = new THREE.Mesh(spineGeo, matBack); // Use back material for dark leather look
    bookGroup.add(spineMesh);

    console.log("Cover meshes added to WebGL.");
  }

  // Calculate Bible Chunking Dynamics
  const N = totalPages + 1;
  const totalBookThickness = 45; // total Z-space to fill
  const chunkThickness = totalBookThickness / N;
  const zSpacing = 0.5; // distance between each filler page
  const numFillers = Math.max(1, Math.floor(chunkThickness / zSpacing));
  const actualChunkThickness = numFillers * zSpacing;

  // Capture Pages
  for (let i = 0; i <= totalPages; i++) {
    const pageEl = document.getElementById(`book-page-${i}`);
    if (!pageEl) continue;

    const frontEl = pageEl.querySelector(".page-front");
    const backEl = pageEl.querySelector(".page-back");

    const frontTex = await capturePageTexture(frontEl);
    const backTex = await capturePageTexture(backEl);

    if (frontTex) {
      // Gerar cor de papel única para a lateral (deckle edge visual)
      const colorVar = (Math.random() - 0.5) * 0.15;
      const uniqueSideColor = new THREE.Color(0xdeb887).offsetHSL(
        0,
        0,
        colorVar,
      );
      const uniqueSideMat = new THREE.MeshLambertMaterial({
        color: uniqueSideColor,
      });

      const matFront = new THREE.MeshLambertMaterial({
        map: frontTex,
        transparent: true,
      });

      const hasNoFillers = numFillers === 1;
      const mainBackMat =
        hasNoFillers && backTex
          ? new THREE.MeshLambertMaterial({ map: backTex, transparent: true })
          : uniqueSideMat;

      const pageMats = [
        uniqueSideMat,
        uniqueSideMat,
        uniqueSideMat,
        uniqueSideMat,
        matFront,
        mainBackMat,
      ];
      const pageMesh = new THREE.Mesh(geometry, pageMats);

      // Efeito de corte irregular das páginas (deckle edge)
      const randScaleX = 0.985 + Math.random() * 0.015;
      pageMesh.scale.set(randScaleX, 1, 1);

      // Espaçamento do Chunk
      pageMesh.userData.baseZ = 22 - i * actualChunkThickness;
      pageMesh.position.z = pageMesh.userData.baseZ;

      // Adicionar Fillers (Efeito Bíblia)
      if (numFillers > 1) {
        for (let j = 1; j < numFillers; j++) {
          const isLast = j === numFillers - 1;
          const fillerBackMat =
            isLast && backTex
              ? new THREE.MeshLambertMaterial({
                  map: backTex,
                  transparent: true,
                })
              : uniqueSideMat;

          const fillerColor = new THREE.Color(0xdeb887).offsetHSL(
            0,
            0,
            (Math.random() - 0.5) * 0.15,
          );
          const fillerSideMat = new THREE.MeshLambertMaterial({
            color: fillerColor,
          });

          const fillerMats = [
            fillerSideMat,
            fillerSideMat,
            fillerSideMat,
            fillerSideMat,
            uniqueSideMat,
            fillerBackMat,
          ];
          const filler = new THREE.Mesh(geometry, fillerMats);

          filler.position.z = -(j * zSpacing);
          filler.scale.set(0.985 + Math.random() * 0.015, 1, 1);
          pageMesh.add(filler);
        }
      }

      pages.push(pageMesh);
      bookGroup.add(pageMesh);
    }
  }
  needsRender = true;
}

export function openThreeBook() {
  const canvas = document.getElementById("webgl-book-canvas");
  if (canvas && renderer) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    needsRender = true;
  }

  gsap.to(bookGroup.position, {
    x: 0,
    duration: 1,
    ease: "power2.inOut",
    onUpdate: () => (needsRender = true),
  });
  if (coverFront) {
    gsap.to(coverFront.rotation, {
      y: -Math.PI,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => (needsRender = true),
    });
    gsap.to(coverFront.position, {
      z: -coverFront.userData.baseZ,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }
}

export function closeThreeBook() {
  gsap.to(bookGroup.position, {
    x: -340,
    duration: 1,
    ease: "power2.inOut",
    onUpdate: () => (needsRender = true),
  });
  if (coverFront) {
    gsap.to(coverFront.rotation, {
      y: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => (needsRender = true),
    });
    gsap.to(coverFront.position, {
      z: coverFront.userData.baseZ,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }

  pages.forEach((p) => {
    gsap.to(p.rotation, {
      y: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => (needsRender = true),
    });
    gsap.to(p.position, {
      z: p.userData.baseZ,
      duration: 0.8,
      ease: "power2.inOut",
    });
  });
}

export function turnThreePage(pageIndex, direction) {
  const page = pages[pageIndex];
  if (!page) return;

  if (direction === 1) {
    // Turn left
    gsap.to(page.rotation, {
      y: -Math.PI,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => (needsRender = true),
    });
    gsap.to(page.position, {
      z: -page.userData.baseZ,
      duration: 0.8,
      ease: "power2.inOut",
    });
  } else {
    // Turn right
    gsap.to(page.rotation, {
      y: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => (needsRender = true),
    });
    gsap.to(page.position, {
      z: page.userData.baseZ,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }
}

export async function updatePageTexture(pageIndex, elementId) {
  const page = pages[pageIndex];
  if (!page) return;

  const pageEl = document.getElementById(elementId);
  if (!pageEl) return;

  const frontEl = pageEl.querySelector(".page-front");
  const backEl = pageEl.querySelector(".page-back");

  const frontTex = await capturePageTexture(frontEl, true);
  const backTex = await capturePageTexture(backEl, true);

  if (frontTex) {
    if (page.material[4].map) page.material[4].map.dispose();
    page.material[4].map = frontTex;
    page.material[4].needsUpdate = true;
    needsRender = true;
  }
  if (backTex) {
    let targetMesh = page;
    if (page.children && page.children.length > 0) {
      targetMesh = page.children[page.children.length - 1];
    }
    if (targetMesh.material[5].map) targetMesh.material[5].map.dispose();
    targetMesh.material[5].map = backTex;
    targetMesh.material[5].needsUpdate = true;
    needsRender = true;
  }
}

// force Vite reload
