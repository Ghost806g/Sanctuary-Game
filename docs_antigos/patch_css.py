import re
import sys

with open('PaginaInicial/css/lore.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace transform-related rules from .real-book and pages to make them flat for html2canvas
content = content.replace(
    """
.real-book {
    position: relative;
    width: 680px; /* Metade do livro (livro fechado) */
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 1s ease;
}

.real-book.open {
    transform: translateX(340px); /* Centraliza as duas metades */
}

.real-book-back-cover,
.real-book-cover,
.real-book .page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform-origin: left center;
    transform-style: preserve-3d;
}

.real-book-back-cover {
    background: linear-gradient(135deg, #1c0a06 0%, #2b120c 100%);
    border: 3px solid #1a0805;
    border-radius: 0 10px 10px 0;
    box-shadow: 20px 20px 30px rgba(0,0,0,0.8), inset 5px 0 15px rgba(0,0,0,0.8);
    transform: translateZ(-10px);
}

.real-book-cover {
    transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 0s;
    transform: rotateY(0deg) translateZ(25px);
    z-index: 101;
}
.real-book.open .real-book-cover {
    transform: rotateY(-180deg) translateZ(25px);
    z-index: 0;
    transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 1.2s;
}

.real-book-cover-front,
.real-book-cover-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}
.real-book-cover-front {
    background: linear-gradient(135deg, #2b120c 0%, #1c0a06 100%);
    border: 3px solid #1a0805;
    border-radius: 0 10px 10px 0;
    box-shadow: inset -5px 0 15px rgba(0,0,0,0.8), 10px 10px 20px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 10px solid #120502;
    transform: rotateY(0deg);
}
.real-book-cover-back {
    background: linear-gradient(180deg, #1c0a06 0%, #0d0402 100%);
    border: 3px solid #1a0805;
    border-radius: 10px 0 0 10px;
    box-shadow: inset -10px 0 20px rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotateY(180deg);
}""",
    """
.real-book {
    position: relative;
    width: 680px; 
    height: 100%;
}

.real-book.open {}

.real-book-back-cover,
.real-book-cover,
.real-book .page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.real-book-back-cover {
    background: linear-gradient(135deg, #1c0a06 0%, #2b120c 100%);
    border: 3px solid #1a0805;
    border-radius: 0 10px 10px 0;
}

.real-book-cover {
    z-index: 101;
}
.real-book.open .real-book-cover {
}

.real-book-cover-front,
.real-book-cover-back {
    position: absolute;
    width: 100%;
    height: 100%;
}
.real-book-cover-front {
    background: linear-gradient(135deg, #2b120c 0%, #1c0a06 100%);
    border: 3px solid #1a0805;
    border-radius: 0 10px 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 10px solid #120502;
    z-index: 2; /* Em cima */
}
.real-book-cover-back {
    background: linear-gradient(180deg, #1c0a06 0%, #0d0402 100%);
    border: 3px solid #1a0805;
    border-radius: 10px 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1; /* Atrás */
}"""
)


content = content.replace(
    """
.real-book .page {
    height: 96%;
    top: 2%;
    z-index: var(--right-z, 10);
    transform: rotateY(var(--page-rot, 0deg)) translateZ(var(--page-z, 0px));
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 0s;
}

.real-book .page-front,
.real-book .page-back {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #d8cba8;
    background-image: 
        radial-gradient(circle at 85% 15%, rgba(138, 3, 3, 0.15) 0%, transparent 20%),
        radial-gradient(circle at 10% 80%, rgba(50, 20, 10, 0.2) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, rgba(200, 180, 130, 0.1) 0%, rgba(90, 60, 30, 0.3) 100%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    backface-visibility: hidden;
    padding: 40px 35px;
    box-sizing: border-box;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.3);
    overflow-y: hidden;
}

.real-book .page-front {
    border-radius: 0 4px 4px 0;
    box-shadow: inset 15px 0 20px -10px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.1);
    transform: rotateY(0deg);
}
.real-book .page-back {
    border-radius: 4px 0 0 4px;
    box-shadow: inset -15px 0 20px -10px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.1);
    transform: rotateY(180deg);
}

.real-book .page.turned {
    --page-rot: -180deg;
    z-index: var(--left-z, 10);
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 0.8s;
}""",
    """
.real-book .page {
    height: 96%;
    top: 2%;
    z-index: var(--right-z, 10);
}

.real-book .page-front,
.real-book .page-back {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #d8cba8;
    background-image: 
        radial-gradient(circle at 85% 15%, rgba(138, 3, 3, 0.15) 0%, transparent 20%),
        radial-gradient(circle at 10% 80%, rgba(50, 20, 10, 0.2) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, rgba(200, 180, 130, 0.1) 0%, rgba(90, 60, 30, 0.3) 100%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    padding: 40px 35px;
    box-sizing: border-box;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.3);
    overflow-y: hidden;
}

.real-book .page-front {
    border-radius: 0 4px 4px 0;
    z-index: 2; /* Sobrepor */
}
.real-book .page-back {
    border-radius: 4px 0 0 4px;
    z-index: 1; /* Atrás */
}

.real-book .page.turned {
}"""
)

with open('PaginaInicial/css/lore.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("lore.css patched for WebGL.")
