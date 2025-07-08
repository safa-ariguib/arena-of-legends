const element = document.querySelector('.trap-preview-modal');

const trapsData = {
    poison: {
        name: "Piège empoisonné",
        image: "assets/images/poisonTrap.png",
        description: "Une toxine se propage lentement dans le corps de l’ennemi, infligeant des dégâts de poison sur la durée.",
        effect: "Dégâts de poison",
        stats: {
            puissance: 8,
            duree: "3 tours",
            portee: "Case adjacente"
        }
    },
    ice: {
        name: "Piège de glace",
        image: "assets/images/iceTrap.png",
        description: "Un souffle glacé paralyse la cible sur-le-champ, l'empêchant de se déplacer pendant 1 tour.",
        effect: "Immobilisation",
        stats: {
            puissance: 5,
            duree: "1 tour",
            portee: "Case déclenchée"
        }
    },
    healing: {
        name: "Fontaine curative",
        image: "assets/images/healingTrap.png",
        description: "Une lumière bienfaisante enveloppe le personnage et lui redonne une partie de sa vitalité.",
        effect: "Soin instantané",
        stats: {
            puissance: 5,
            duree: "Instant",
            portee: "Utilisateur"
        }
    },
    fire: {
        name: "Piège de feu",
        image: "assets/images/fire_trap.png",
        description: "Un déchaînement de flammes surgit soudainement, brûlant tout dans un rayon proche.",
        effect: "Dégâts de feu",
        stats: {
            puissance: 12,
            duree: "Instant",
            portee: "2 cases de rayon"
        }
    },
    strength: {
        name: "Autel de force",
        image: "assets/images/strengthTrap.png",
        description: "Une énergie mystérieuse émane de l’autel, renforçant temporairement la puissance du personnage.",
        effect: "Bonus de force",
        stats: {
            puissance: 3,
            duree: "2 tours",
            portee: "Utilisateur"
        }
    }
};


document.addEventListener('DOMContentLoaded', function () {
    const trapCards = document.querySelectorAll('.item-container');
    const trapPreview = document.querySelector('.trap-preview-modal');
    const closePreview = document.querySelector('.close-preview');

    trapCards.forEach(card => {
        card.addEventListener('click', function () {
            const trapId = this.getAttribute('data-trap');
            const trapData = trapsData[trapId];

            const nameElement = document.querySelector('.trap-name-display');
            if (nameElement) nameElement.textContent = trapData.name;

            const imageElement = document.querySelector('.trap-image-large');
            if (imageElement) imageElement.src = trapData.image;

            const descriptionElement = document.querySelector('.trap-description');
            if (descriptionElement) descriptionElement.textContent = trapData.description;

            const effectElement = document.querySelector('.effect-type');
            if (effectElement) effectElement.textContent = trapData.effect;

            Object.keys(trapData.stats).forEach(stat => {
                const statElement = document.querySelector(`[data-stat="${stat}"]`);
                if (statElement) {
                    statElement.textContent = trapData.stats[stat];
                }
            });

            trapPreview.style.display = 'flex';
        });
    });

    closePreview.addEventListener('click', function () {
        trapPreview.style.display = 'none';
    });
});
