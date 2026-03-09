document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');

    // --- CONFIGURATION ---
    // Adaptez ces valeurs à votre projet
    const frameCount = 120; // Nombre total d'images dans votre animation
    const imageFileName = (index) => `frame/${index}.jpg`; // Adaptez le nom et le chemin

    // --- PRÉ-CHARGEMENT DES IMAGES ---
    const preloadImages = () => {
        const promises = [];
        for (let i = 1; i <= frameCount; i++) {
            promises.push(new Promise((resolve, reject) => {
                const img = new Image();
                img.src = imageFileName(i);
                img.onload = resolve;
                img.onerror = reject;
            }));
        }
        return Promise.all(promises);
    };

    // --- DESSIN DE L'IMAGE ---
    const drawImage = (index) => {
        const img = new Image();
        img.src = imageFileName(index);
        img.onload = () => {
            // Assurer que le canvas a la bonne taille (pour les écrans haute densité)
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            
            // Dessiner l'image en la centrant et en conservant son ratio
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio); // Utiliser max pour couvrir, min pour contenir
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        };
    };

    // --- GESTION DU SCROLL ---
    const handleScroll = () => {
        const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const frameIndex = Math.min(
            frameCount,
            Math.max(1, Math.ceil(scrollFraction * frameCount))
        );
        
        // On utilise requestAnimationFrame pour optimiser le dessin
        requestAnimationFrame(() => drawImage(frameIndex));
    };

    // --- INITIALISATION ---
    preloadImages().then(() => {
        console.log('Toutes les images sont chargées.');
        // Dessiner la première image
        drawImage(1);
        // Écouter l'événement de scroll
        window.addEventListener('scroll', handleScroll);
    }).catch(err => {
        console.error("Erreur lors du chargement d'une image:", err);
    });
});
