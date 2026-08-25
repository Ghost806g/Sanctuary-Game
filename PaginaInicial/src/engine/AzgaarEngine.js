/**
 * AzgaarEngine.js
 * Responsável por gerenciar o Mapa-Múndi (SVG) gerado no Azgaar e ler dados geográficos/culturais (burgs.json).
 */

window.azgaarData = {
  burgs: [],
  mapLoaded: false,
};

window.initAzgaarMap = function () {
  const container = document.getElementById("azgaar-map-container");
  if (!container) return;

  container.innerHTML = `
        <div id="azgaar-viewport" style="width: 100%; height: 500px; overflow: auto; background: #0f172a; border: 2px solid var(--border-dark); position: relative; border-radius: 8px; box-shadow: inset 0 0 20px #000;">
            <p style="text-align: center; color: #94a3b8; margin-top: 40%; font-family: 'Inter', sans-serif;">
                🗺️ Carregando mapa do Azgaar...<br>
                <small style="color:#ef4444">Certifique-se de que o arquivo "mapa.svg" esteja na pasta "data/".</small>
            </p>
            <object id="azgaar-svg-object" type="image/svg+xml" data="data/mapa.svg" style="width: 200%; height: auto; display: none;"></object>
        </div>
    `;

  const svgObject = document.getElementById("azgaar-svg-object");
  svgObject.onload = function () {
    svgObject.style.display = "block";
    svgObject.previousElementSibling.style.display = "none";
    setupAzgaarInteractivity(svgObject);
    window.azgaarData.mapLoaded = true;
  };

  svgObject.onerror = function () {
    console.warn("[AzgaarEngine] mapa.svg não encontrado na pasta data/.");
    container.querySelector("p").innerHTML = `
            🗺️ Módulo Azgaar Ativo<br>
            <span style="font-size: 0.8rem; color: #cbd5e1;">Aguardando inserção de 'mapa.svg' em 'data/'...</span><br>
            <small style="color:#ef4444">Gere um SVG no Azgaar's Fantasy Map Generator e cole na pasta.</small>
        `;
  };

  fetch("data/burgs.json")
    .then((response) => response.json())
    .then((data) => {
      window.azgaarData.burgs = data;
      console.log("[AzgaarEngine] Burgs loaded:", data.length);
    })
    .catch((err) =>
      console.warn(
        "[AzgaarEngine] burgs.json não encontrado. Ignorando preenchimento de lore.",
      ),
    );
};

function setupAzgaarInteractivity(svgObject) {
  try {
    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) return;
    const burgIcons = svgDoc.getElementById("burgIcons");
    if (burgIcons) {
      Array.from(burgIcons.children).forEach((icon) => {
        icon.style.cursor = "pointer";
        icon.style.transition = "all 0.2s";

        icon.addEventListener("mouseenter", () => {
          icon.style.fill = "#fbbf24";
        });

        icon.addEventListener("mouseleave", () => {
          icon.style.fill = "";
        });

        icon.addEventListener("click", (e) => {
          const burgId = icon.getAttribute("data-id");
          handleBurgClick(burgId);
        });
      });
    }
  } catch (e) {
    console.error("Erro ao aplicar interatividade no SVG do Azgaar:", e);
  }
}

function handleBurgClick(burgId) {
  let burgLore = null;
  if (window.azgaarData.burgs.length > 0) {
    burgLore = window.azgaarData.burgs.find(
      (b) => b.i == burgId || b.id == burgId,
    );
  }

  let msg = burgLore
    ? `Bem-vindo a ${burgLore.name}, capital da cultura ${burgLore.culture}.`
    : `Viajando para a localidade #${burgId}...`;

  if (typeof triggerToast === "function") {
    triggerToast(`🗺️ Viagem: ${msg}`);
  } else {
    alert(msg);
  }
}
