import {
    loadProject
} from "./projets.js";
export function loadModal() {

    let projects = JSON.parse(localStorage.getItem("myProjects"));

    // Cibler les éléments pour l'accessibilité (tab)
    const focusableSelector = "button, a, input, textarea";
    let focusables = [];
    let previouslyFocusedElement = null;

    // Ouverture de la modal
    let modal = null;

    const openModal = function (e) {
        e.preventDefault();
        modal = document.querySelector(e.target.getAttribute('href'));
        focusables = Array.from(modal.querySelectorAll(focusableSelector));
        previouslyFocusedElement = document.querySelector(':focus');
        modal.style.display = null;
        focusables[0].focus();
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    }

    const closeModal = function (e) {
        if (modal === null) return;
        if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
        e.preventDefault();
        window.setTimeout(function () {
            modal.style.display = "none";
            modal = null;
        }, 500)
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

        const projects = JSON.parse(localStorage.getItem("myProjects"));
        loadProject(projects, true);
    }

    // Eviter la propagation de l'événement close dans les éléments parents
    const stopPropagation = function (e) {
        e.stopPropagation();
    }

    const focusInModal = function (e) {
        e.preventDefault();
        console.log(focusables);
        let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
        if (e.shiftkey === true) {
            index--;
        } else {
            index++;
        }
        if (index >= focusables.length) {
            index = 0;
        }
        focusables[index].focus();
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal)
    })

    // Fermer la modal avec la touche escape
    window.addEventListener('keydown', function (e) {
        console.log(e.key)
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        }
        if (e.key === 'Tab' && modal !== null) {
            focusInModal(e);
        }
    })

    for (let i = 0; i < projects.length; i++) {

        const currentProject = projects[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divGallery = document.querySelector(".modal-gallery");

        // Création d’une balise dédiée à un projet
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id
        projectElement.classList.add('modal-picture');

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = currentProject.imageUrl;
        const editionElement = document.createElement("a");
        editionElement.innerHTML = "editer";
        const deleteElement = document.createElement("button");
        deleteElement.id = currentProject.id;
        const deleteIconElement = document.createElement("i");
        deleteIconElement.id = currentProject.id;
        deleteIconElement.classList.add('fa-solid', 'fa-trash-can');

        deleteElement.addEventListener('click', function (event) {
            // Supprimer le projet en question du projects => newProjects
            const previousProjectsList = JSON.parse(localStorage.getItem("myProjects"));
            const newProjects = previousProjectsList.filter(element => element.id != event.target.id);
            let figureToBeDeleted = document.querySelectorAll(`[data-id='${event.target.id}']`);
            figureToBeDeleted[0]?.remove();
            // Puis suavegarder la resultat dans le storage 
            localStorage.setItem("myProjects", JSON.stringify(newProjects));
        })

        // Rattachement de la balise figure a la section Projets

        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(editionElement);
        projectElement.appendChild(deleteElement);
        deleteElement.appendChild(deleteIconElement);

    }
}