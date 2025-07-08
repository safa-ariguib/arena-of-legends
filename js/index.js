function goFullScreen() {
    const fullscreenIcon = document.querySelector('.fullscreen-btn i');

    if (!document.fullscreenElement) {
        const requestFullscreen = document.documentElement.requestFullscreen ||
                                  document.documentElement.mozRequestFullScreen ||
                                  document.documentElement.webkitRequestFullscreen ||
                                  document.documentElement.msRequestFullscreen;
        requestFullscreen.call(document.documentElement);
        fullscreenIcon.className = 'fas fa-compress';
    } else {
        const exitFullscreen = document.exitFullscreen ||
                               document.mozCancelFullScreen ||
                               document.webkitExitFullscreen ||
                               document.msExitFullscreen;
        exitFullscreen.call(document);
        fullscreenIcon.className = 'fas fa-expand';
    }
}
function pulseDecorations() {
    const decorations = document.querySelectorAll('.decorative-corner');

    decorations.forEach((decoration, index) => {
        setTimeout(() => {
            decoration.style.backgroundColor = '#ffffff';
            setTimeout(() => {
                decoration.style.backgroundColor = '#dcb758';
            }, 300);
        }, index * 300);
    });
}
setInterval(pulseDecorations, 3000);
function createShimmerEffect() {
    const logo = document.querySelector('.game-logo h1');
    const shimmer = document.createElement('div');
    shimmer.style.position = 'absolute';
    shimmer.style.top = '0';
    shimmer.style.left = '-100%';
    shimmer.style.width = '50%';
    shimmer.style.height = '100%';
    shimmer.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
    shimmer.style.transform = 'skewX(-25deg)';
    shimmer.style.transition = 'left 1s ease-in-out';
    logo.style.position = 'relative';
    logo.style.overflow = 'hidden';
    logo.appendChild(shimmer);
    setTimeout(() => {
        shimmer.style.left = '200%';
    }, 100);

    setTimeout(() => {
        logo.removeChild(shimmer);
    }, 1100);
}
setInterval(createShimmerEffect, 5000);
function toggleSound() {
    const audio = document.getElementById('musique_principale');
    const icon = document.getElementById('soundIcon');

    if (audio.paused) {
        audio.play();
        icon.classList.replace('fa-volume-down', 'fa-volume-up');
    } else {
        audio.pause();
        icon.classList.replace('fa-volume-up', 'fa-volume-down');
    }
}

window.onload = function () {
    const audio = document.getElementById('musique_principale');
    const icon = document.getElementById('soundIcon');
    audio.play();
    icon.classList.add('fa-volume-up');
};
