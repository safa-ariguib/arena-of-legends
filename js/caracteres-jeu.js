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


const LegendaryText = document.querySelector('.Legendary-text');

function pulseAnimation() {
    setTimeout(() => {
        LegendaryText.style.transform = 'scale(1)';
        LegendaryText.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
    }, 1000);
}

setInterval(pulseAnimation, 2000);

const rewardItems = document.querySelectorAll('.reward-item');
function shimmerEffect(element) {
    const shimmer = document.createElement('div');
    shimmer.style.position = 'absolute';
    shimmer.style.top = '0';
    shimmer.style.left = '-100%';
    shimmer.style.width = '50%';
    shimmer.style.height = '100%';
    shimmer.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
    shimmer.style.transform = 'skewX(-25deg)';
    shimmer.style.transition = 'left 1s ease-in-out';

    element.style.overflow = 'hidden';
    element.appendChild(shimmer);

    setTimeout(() => {
        shimmer.style.left = '200%';
    }, 100);

    setTimeout(() => {
        element.removeChild(shimmer);
    }, 1100);
}

rewardItems.forEach((item, index) => {
    setInterval(() => {
        shimmerEffect(item);
    }, 3000 + (index * 1000));
});


const champion_image = document.querySelectorAll('.champion-image');
champion_image.forEach((item, index) => {
    setInterval(() => {
        shimmerEffect(item);
    }, 3000 + (index * 1000));
});
window.onload = goFullScreen;
const logo = document.querySelector('.logo');
logo.addEventListener('mousemove', (e) => {
    const rect = logo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    logo.style.transform = `perspective(500px) rotateX(${(y - rect.height / 2) / 10}deg) rotateY(${-(x - rect.width / 2) / 10}deg)`;
});
logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
});
const logoTitle = document.querySelector('.game-logo h1');
function createShimmerEffect() {
    const shimmer = document.createElement('div');
    shimmer.style.position = 'absolute';
    shimmer.style.top = '0';
    shimmer.style.left = '-100%';
    shimmer.style.width = '50%';
    shimmer.style.height = '100%';
    shimmer.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
    shimmer.style.transform = 'skewX(-25deg)';
    shimmer.style.transition = 'left 1s ease-in-out';
    logoTitle.style.position = 'relative';
    logoTitle.style.overflow = 'hidden';
    logoTitle.appendChild(shimmer);
    setTimeout(() => {
        shimmer.style.left = '200%';
    }, 100);

    setTimeout(() => {
        logoTitle.removeChild(shimmer);
    }, 1100);
}
setInterval(createShimmerEffect, 5000);
const charactersData = {
    chevalier: {
        name: "Chevalier",
        image: "./assets/images/Chevalier.jpg",
        description: "Le Chevalier est un combattant robuste et loyal, spécialisé dans la défense et la protection de ses alliés. Avec son armure lourde et son épée tranchante, il peut résister à des dégâts considérables tout en infligeant des coups puissants.",
        stats: {
            health: 100,
            attack: 8,
            defense: 7,
            speed: 4,
            maxHealth: 100,
            specialPower: "Frappe Héroïque"
        }
    },
    assassin: {
        name: "Assassin",
        image: "./assets/images/Assasin.jpg",
        description: "L'Assassin est un tueur silencieux et mortel, maître des attaques furtives et des coups critiques. Sa rapidité et sa précision lui permettent d'éliminer ses cibles avant qu'elles ne réalisent ce qui leur arrive.",
        stats: {
            health: 85,
            attack: 8,
            defense: 5,
            speed: 8,
            maxHealth: 85,
            specialPower: "Coup Fatal"
        }
    },
    moine: {
        name: "Moine",
        image: "./assets/images/Moine.avif",
        description: "Le Moine est un guerrier spirituel qui combine la force physique avec la discipline mentale. Ses techniques de combat sont basées sur l'équilibre et la maîtrise de soi, lui permettant d'encaisser et de rendre les coups avec une efficacité redoutable.",
        stats: {
            health: 90,
            attack: 5,
            defense: 6,
            speed: 7,
            maxHealth: 90,
            specialPower: "Méditation"
        }
    },
    bete: {
        name: "Bête mythique",
        image: "./assets/images/Bête mythique.avif",
        description: "La Bête mythique est une créature légendaire dotée d'une force brute et d'instincts primaires. Ses attaques sauvages et sa résistance naturelle en font un adversaire redoutable au combat.",
        stats: {
            health: 120,
            attack: 9,
            defense: 5,
            speed: 6,
            maxHealth: 120,
            specialPower: "Rage Bestiale"
        }
    },
    sorciere: {
        name: "Sorcière",
        image: "./assets/images/Sorcier.jpg",
        description: "La Sorcière est une maîtresse des arts occultes, capable de lancer des sorts dévastateurs et de manipuler les forces de la nature. Bien que fragile physiquement, sa puissance magique est inégalée.",
        stats: {
            health: 80,
            attack: 6,
            defense: 3,
            speed: 6,
            maxHealth: 70,
            specialPower: "Nova Arcanique"
        }
    },
    ninja: {
        name: "Ninja",
        image: "./assets/images/Ninja.avif",
        description: "Le Ninja est un combattant furtif et polyvalent, expert en techniques de diversion et d'infiltration. Son agilité et sa versatilité en font un adversaire imprévisible.",
        stats: {
            health: 85,
            attack: 6,
            defense: 4,
            speed: 9,
            maxHealth: 85,
            specialPower: "Frappe Éclair"
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const championCards = document.querySelectorAll('.champion-card');
    const characterPreview = document.querySelector('.character-preview-modal');
    const closePreview = document.querySelector('.close-preview');

    championCards.forEach(card => {
        card.addEventListener('click', function () {
            const championId = this.getAttribute('data-champion');
            const championData = charactersData[championId];

            if (!championData) {
                console.error('Données du personnage non trouvées pour:', championId);
                return;
            }
            document.querySelector('.character-name-display').textContent = championData.name;
            document.querySelector('.avatar-image-large').src = championData.image;
            document.querySelector('.character-description').textContent = championData.description;
            document.querySelector('.power-value').textContent = championData.stats.specialPower;
            const statsToUpdate = {
                'health': championData.stats.health,
                'attack': championData.stats.attack,
                'defense': championData.stats.defense,
                'speed': championData.stats.speed
            };
            Object.keys(statsToUpdate).forEach(stat => {
                const value = statsToUpdate[stat];
                const statElement = document.querySelector(`[data-stat="${stat}"]`);
                const barElement = document.querySelector(`[data-stat-bar="${stat}"]`);
                if (statElement) statElement.textContent = value;
                if (barElement) {
                    const maxValue = stat === 'health' ? 120 : 10;
                    const barWidth = (value / maxValue) * 100;
                    barElement.style.width = `${barWidth}%`;
                }
            });
            characterPreview.style.display = 'flex';
        });
    });

    closePreview.addEventListener('click', function () {
        characterPreview.style.display = 'none';
    });
});
function toggleSound() {
    const audio = document.getElementById('musique_principale');
    const soundIcon = document.getElementById('soundIcon');

    if (audio.paused) {
        audio.play();
        soundIcon.className = 'fas fa-volume-up';
    } else {
        audio.pause();
        soundIcon.className = 'fas fa-volume-mute';
    }
}

function goFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Erreur lors du passage en plein écran: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const avatar = document.querySelector(".character-avatar");
    const nameDisplay = document.querySelector(".character-name-display");
    const description = document.querySelector(".character-description");

    function startShimmer() {
        [avatar, nameDisplay, description].forEach(el => el.classList.add("shimmer"));
    }
    function stopShimmer() {
        [avatar, nameDisplay, description].forEach(el => el.classList.remove("shimmer"));
    }
    startShimmer();
    setTimeout(stopShimmer, 3000);
});

