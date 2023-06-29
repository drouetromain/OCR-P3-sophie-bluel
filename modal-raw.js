import {
    loadProject,
    genererCategories,
    getCategoriesFromAPI
} from "./projets.js";

// API Calls
const categories = await getCategoriesFromAPI();

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
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        }
        if (e.key === 'Tab' && modal !== null) {
            focusInModal(e);
        }
    })

    // Modal 1 : Suppression des projets du localStorage
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


    // Modal 2 : Ajout d'un projet dans le localStorage

        // Sélectionner le bouton qui va envoyer les données du formulaire dans le localStorage
        const btnSendNewProject = document.querySelector(".btn-valider");

        // Fonction qui va envoyer le contenu du formulaire dans le localStorage
        btnSendNewProject.addEventListener("click", (event)=>{
            event.preventDefault();

            // Récupérer l'url de l'image
            const urlImg = document.querySelector("#resultat");
            console.log("urlImg : " + urlImg.src);

            // Récupérer l' userId du localStorage
            const userId = localStorage.getItem("userId");
            const userIdNumber = Number(userId);

            // Récupérer la categoryId du formulaire
            const categoryId = document.querySelector("#categories-options");
            const categoryIdNumber = Number(categoryId.value);
            console.log("categoryIdNumber: " + categoryIdNumber);

            if (categoryIdNumber !== 0){
                // Je vérifie qu'un message d'erreur est présent
                const divErrorMessage = document.querySelector("#form-add-project-error-message");
                let content = divErrorMessage.innerHTML;
                console.log("contents:" + content);
                if (content !== ''){
                    // Je le supprime le message d'erreur
                    const divToRemove = document.getElementById("form-display-error-message");
                    divToRemove.remove();
                    console.log("Je supprime le message d'erreur deja présent pour la catégorie");
                }
                // Récupéreration le categorie name
                genererCategories(categories);
                    // Si la categoryIdNumber = 1 alors categories.id = 1 ...
                    let i = categoryIdNumber; 
                    let objectCategorieId = categories[i-1].id;
                    let objectCategorieName = categories[i-1].name;
                    console.log(categories.find(obj => obj.id == i));
                    console.log("categoryIdNumber: " + categoryIdNumber);
                    console.log("objectCategorieName: " + objectCategorieName);

                // Incrémentation : Connaitre le dernier id des projects de l'API
            

                // Récupération des valeurs du formulaire
                const addNewProjectToLocalStorage = {
                id: 12,
                title: document.querySelector(".js-new-project-title").value,
                imageUrl: urlImg.src,
                categoryId: categoryIdNumber, 
                userId: userIdNumber,
                category: {
                    id: objectCategorieId,
                    name: objectCategorieName
                }
                }

                // Fermer la modal avec le boutton valider, si input file != null, input name !=null et select categories != null
                let verifyInputFile = document.getElementById("file");
                console.log("verify img: " + verifyInputFile.value);
                let verifyInputName = document.getElementById("name");
                console.log("verify name: " + verifyInputName.value);
                let verifyInputCategories = document.getElementById("categories-options");
                console.log("verify categorie: " + verifyInputCategories.value);

                if (verifyInputFile.value !== '' && verifyInputName.value !== ''){
                //if (verifyInputFile.value !== null || verifyInputFile.value !== undefined || verifyInputFile.value !== '' && verifyInputName.value !== null || verifyInputName.value !== undefined || verifyInputName.value !== '' && verifyInputCategories.value !== null || verifyInputCategories.value !== undefined || verifyInputCategories.value !== ''){
                    closeModal(event);
                    // Ajouter l'objet "addNewProjectToLocalStorage" dans le localStorage
                    let copyOfMyProjects = localStorage.getItem("myProjects");
                    let projectsArray = JSON.parse(copyOfMyProjects);
                    projectsArray.push(addNewProjectToLocalStorage);
                    localStorage.setItem("myProjects", JSON.stringify(projectsArray));

                    // Suppression des datas du formulaire 
                    document.getElementById("js-reset-form").reset();
                        // Vider le file Input du formulaire
                        function clearFileInput(ctrl) {
                            try {
                            ctrl.value = null;
                            } catch(ex) { }
                            if (ctrl.value) {
                            ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
                            }
                        }
                        clearFileInput(document.getElementById("resultat"));
                        console.log("file content :" + document.getElementById("resultat"));
                    document.getElementById("resultat").removeAttribute("src");

                    // Suppression des anciens éléments de la modale 1
                    const removeDiv = document.getElementById("clear-modal-1");
                    console.log(removeDiv);
                    removeDiv.remove(); 

                    // MODAL 1 : Re-génération de la div qui va acceuillir les nouveaux projects
                    const divJsModal1 = document.querySelector(".js-modal-1");
                    const divToAddAfterRemove = document.createElement("div");
                    divToAddAfterRemove.classList.add('modal-gallery');
                    divToAddAfterRemove.setAttribute("id","clear-modal-1");
                    const divModalBottom = document.querySelector(".modal-bottom");

                    // MODAL 1 : Rattachement de la balise div a la div supérieure
                    divJsModal1.appendChild(divToAddAfterRemove);
                    divJsModal1.appendChild(divModalBottom);

                    // MODAL 2 : Re-génération du block add picture
                    let displayBlockAddPicture = document.getElementById("js-hide-block-add-picture");
                    displayBlockAddPicture.style.display = "flex";

                    loadModal();
                    //localStorage.setItem("newProject", JSON.stringify(addNewProjectToLocalStorage));
                }else{
                    if (verifyInputFile.value == 0 && verifyInputName.value == 0){
                        // Je vérifie qu'un message d'erreur est présent
                        const divErrorMessage = document.querySelector("#form-add-project-error-message");
                        let content = divErrorMessage.innerHTML;
                        console.log("contents:" + content);
                        if (content == ''){
                            // Si pas de message alors je l'affiche
                            const divDisplayErrorMessage = document.createElement("div");
                            divDisplayErrorMessage.setAttribute("id","form-display-error-message");
                            divErrorMessage.appendChild(divDisplayErrorMessage);
                            document.getElementById("form-display-error-message").innerHTML += "Veuillez ajouter une image et un titre à votre projet";
                        }else{
                            // Sinon je le supprime
                            const divToRemove = document.getElementById("form-display-error-message");
                            divToRemove.remove();
                            console.log("Je supprime le message d'erreur de l'image et du titre");
                        }
             
                    }else{ 
                        if (verifyInputFile.value == 0){
                        // Je vérifie qu'un message d'erreur est présent
                        const divErrorMessage = document.querySelector("#form-add-project-error-message");
                        let content = divErrorMessage.innerHTML;
                        console.log("contents file:" + content);
                        if (content == ''){
                            // Si pas de message alors je l'affiche
                            const divDisplayErrorMessage = document.createElement("div");
                            divDisplayErrorMessage.setAttribute("id","form-display-error-message");
                            divErrorMessage.appendChild(divDisplayErrorMessage);
                            document.getElementById("form-display-error-message").innerHTML += "Veuillez ajouter une image à votre projet";
                        }else{
                            // Sinon je le supprime
                            const divToRemove = document.getElementById("form-display-error-message");
                            divToRemove.remove();
                            console.log("Je supprime le message d'erreur de l'image");
                        }
                            

                        }
                        if (verifyInputName.value == 0){
                            // Je vérifie qu'un message d'erreur est présent
                            const divErrorMessage = document.querySelector("#form-add-project-error-message");
                            let content = divErrorMessage.innerHTML;
                            console.log("contents file:" + content);
                            if (content == ''){
                                // Si pas de message alors je l'affiche
                                const divDisplayErrorMessage = document.createElement("div");
                                divDisplayErrorMessage.setAttribute("id","form-display-error-message");
                                divErrorMessage.appendChild(divDisplayErrorMessage);
                                document.getElementById("form-display-error-message").innerHTML += "Veuillez ajouter un titre à votre projet";
                            }else{
                                // Sinon je le supprime
                                const divToRemove = document.getElementById("form-display-error-message");
                                divToRemove.remove();
                                console.log("Je supprime le message d'erreur du titre");
                            }
                        }
                    } 
                };   
            }else{
                // Message si catégorie non selectionnée
                const divErrorMessage = document.querySelector("#form-add-project-error-message");
                let content = divErrorMessage.innerHTML;
                console.log("contents:" + content);
                if (content == ''){
                    const divDisplayErrorMessage = document.createElement("div");
                    divDisplayErrorMessage.setAttribute("id","form-display-error-message");
                    divErrorMessage.appendChild(divDisplayErrorMessage);
                    document.getElementById("form-display-error-message").innerHTML += "Veuillez sélectionner une catégorie à votre projet";
                }
            };
        });

};  
    /*
    function addNewProject(){
        //const formToAddNewProject = document.querySelector(".js-form-add-new-project");
        //formToAddNewProject.addEventListener("submit", function(event){
        //event.preventDefault();

        //
        // Création de l'objet du nouveau projet (charge utile)
        const newProject = {
            id: "12",
            imageUrl: target.querySelector("[name=image]").value,
            title: target.querySelector("[name=name]").value,
            userId: "1",
            //localStorage.getItem("userId"),
            //categoryId
            //id
            //name: event.target.querySelector("[name=categorie]").value,
        };
        console.log(newProject);
        localStorage.setItem("newProject", JSON.stringify(newProject));
        
        /*
        // Convertion de la charge utile en JSON
        const chargeUtile = JSON.stringify(newProject);
        console.log(chargeUtile);
        fetch('http://localhost:5678/api/works'), {
            method: "POST",
            Headers: {"Content-Type": "application/json"},
            body: chargeUtile,
        }


        //fetch('http://localhost:5678/api/categories')
    
        
    } 
    */