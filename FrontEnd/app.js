// Ce fichier va permettre de lancer mon application

import {
    genererCategories,
    genererCategoriesForm,
    loadProject,
    getProjectsFromApi,
    getCategoriesFromAPI,
    imLoggedIn,
    postProjectToAPI,
    postDeletedProjectToAPI
} from "./projets.js";

import {
    loadModal
    //afficherImage
} from "./modal.js";

// API Calls
const categories = await getCategoriesFromAPI();
const projects = await getProjectsFromApi();

// html nodes
const jsFilter = document.getElementById("js-filters");
const topBarEditionMode = document.getElementById("top-bar-edition-mode");
const modifyButtonH2 = document.getElementById("js-modify-project-h2");
const modifyButtonIntroBlock = document.getElementById("js-modify-project-intro-block");


// Charger tout les projets et les afficher dans la page
if (!imLoggedIn()) {
    genererCategories(categories, projects);
}

// Filtrer les projets par Tous 
if (!imLoggedIn()) {
    const inputNotFilteredProjects = document.querySelector('#btn-tous')
    inputNotFilteredProjects.addEventListener('click', function () {
        document.querySelector(".gallery").innerHTML = "";
        loadProject(projects);
    })
}

// Charger tout les projets et les afficher dans la page
loadProject(projects);
genererCategoriesForm(categories);

// Evenements liés au clic du bouton logout
const logoutBtn = document.querySelector('#btn-login');
logoutBtn.addEventListener('click', function (event) {
    event.preventDefault();

    if (imLoggedIn()) {
        // Clean du Storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("myProjects");
        localStorage.removeItem("projectsAdded");
        localStorage.removeItem("projectsDeleted");
        
        // Redirect to HP 
        window.location.href = "./";
    } else {
        window.location.href = "./login.html";
    }

});

// Générer UI LogIn / LogOut
if (imLoggedIn()) {
    logoutBtn.textContent = "Logout";
    // Hide des éléments d'édition
    jsFilter.style.display = "none";
    topBarEditionMode.style.display = "flex";
    modifyButtonH2.style.display = "block";
    modifyButtonIntroBlock.style.display = "block";

} else {
    logoutBtn.textContent = "Login";
    // Afficher les filtres
    jsFilter.style.display = "flex";
    // Affichage des éléments d'édition
    topBarEditionMode.style.display = "none";
    modifyButtonH2.style.display = "none";
    modifyButtonIntroBlock.style.display = "none";
}

// Stocker les projets de l'utilisateur connecté dans le localStorage
if (imLoggedIn()) {
    const userId = localStorage.getItem("userId");
    const projectsOfUser = projects.filter(function (project) {
        return project.userId == userId;
    });

    // Sauver projects dans localStorage
    localStorage.setItem("myProjects", JSON.stringify(projectsOfUser));
    loadModal();
}

// Ajouter une image
let fileInput = document.querySelector("#file");
let resultat = document.querySelector("#resultat");

fileInput.addEventListener('change', function () {
    let file = fileInput.files;

    if (file.length > 0) {
        let fileReader = new FileReader();
        fileReader.onload = function (event) {
            resultat.setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        let hideBlockAddPicture = document.getElementById("js-hide-block-add-picture");
        hideBlockAddPicture.style.display = "none";

    } else {
        console.log("Aucun fichier sélectionné");
    }
});


// Push des projets dans l'API
let publishButton = document.querySelector('#btn-publish');
publishButton.addEventListener('click', postProjectToAPI);
publishButton.addEventListener('click', postDeletedProjectToAPI);

