class ImageGallery {
    constructor() {
        this.currentImageIndex = 0;
        this.filteredImages = [];
        this.allImages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadImages();
        this.updateImageCounter();
    }

    setupEventListeners() {
        // Gallery item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                const item = e.target.closest('.gallery-item');
                const index = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)')).indexOf(item);
                this.openLightbox(index);
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterImages(e.target.dataset.filter);
                this.setActiveFilter(e.target);
            });
        });

        // Lightbox controls
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox' || e.target.classList.contains('close')) {
                this.closeLightbox();
            }
        });

        document.getElementById('prevBtn').addEventListener('click', () => this.prevImage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }

    loadImages() {
        this.allImages = Array.from(document.querySelectorAll('.gallery-item'));
        this.filteredImages = [...this.allImages];
    }

    filterImages(category) {
        this.allImages.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        this.filteredImages = this.allImages.filter(item => !item.classList.contains('hidden'));
        this.updateImageCounter();
        
        // Reset current index if it's out of bounds
        if (this.currentImageIndex >= this.filteredImages.length) {
            this.currentImageIndex = 0;
        }
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const img = this.filteredImages[index].querySelector('img');
        
        document.getElementById('lightboxImg').src = img.src;
        document.getElementById('lightboxImg').alt = img.alt;
        document.getElementById('lightbox').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        this.updateImageCounter();
    }

    closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredImages.length;
        this.updateLightboxImage();
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const img = this.filteredImages[this.currentImageIndex].querySelector('img');
        const lightboxImg = document.getElementById('lightboxImg');
        
        // Fade out
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            // Fade in
            lightboxImg.style.opacity = '1';
        }, 150);
        
        this.updateImageCounter();
    }

    updateImageCounter() {
        document.getElementById('currentImage').textContent = this.currentImageIndex + 1;
        document.getElementById('totalImages').textContent = this.filteredImages.length;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageGallery();
});

// Add smooth transitions to lightbox image
document.addEventListener('DOMContentLoaded', () => {
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.style.transition = 'opacity 0.3s ease';
});