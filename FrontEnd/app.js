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
// Bind click event for logout action
const logoutBtn = document.querySelector('#btn-login');
logoutBtn.addEventListener('click', function (event) {
    event.preventDefault();

    if (imLoggedIn()) {
        // Clean storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("myProjects");
        // Redirect to home 
        window.location.href = "/FrontEnd/";
    } else {
        window.location.href = "/FrontEnd/login.html";
    }

});

// Générer UI LogIn / LogOut
if (imLoggedIn()) {
    logoutBtn.textContent = "Logout";
    // Hide edit elements
    jsFilter.style.display = "none";
    topBarEditionMode.style.display = "flex";
    modifyButtonH2.style.display = "block";
    modifyButtonIntroBlock.style.display = "block";

} else {
    logoutBtn.textContent = "Login";
    // Supprimer les filtres
    jsFilter.style.display = "flex";
    // Show edit elements
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
        //let addImageBlock = document.querySelector(".add-picture-block");
        let hideBlockAddPicture = document.getElementById("js-hide-block-add-picture");
        hideBlockAddPicture.style.display = "none";
        //addImageBlock.remove();

        // Rajout du bloc "add-picture-block"

    } else {
        console.log("Aucun fichier sélectionné");
    }
});


function getMaxId(projects) {
    let maxId = 0;
    projects.forEach(function (project) {
        if (maxId < project?.id)
            maxId = project?.id;
    });
    return maxId;
}

/*
function renderNewProjects() {
    // Créer les ID incrémentables des nouveaux projets
    // API: Récupérer tous les projets de l'API
    const latestProjectsInApi = projects;

    // LocalStorage : Récupérer tous les projets du localStorage
    const latestStoredProjects = JSON.parse(localStorage.getItem("myProjects"));
    //console.log("latestProjects : " + latestProjectsInApi);
    console.log("Je suis rentré dans la fonction renderNewProjects");
    console.log("latestProjectsInApi.length :" + latestProjectsInApi.length);
    console.log("latestStoredProjects.length :" + latestStoredProjects.length);
    
    
    // Je fusionne les projets
    let concatProjects = latestProjectsInApi.concat(latestStoredProjects);
    console.log("concatProjects :" + concatProjects);
    console.log("concatProjects Length :" + concatProjects.length);

    // Je remplace les id 'null' par une valeur incrémentable
    let maxId = getMaxId(concatProjects);
    console.log("maxId :" + maxId);

    concatProjects.forEach(function (project) {
        localStorage.setItem('addedProjects', 'project');
        if (project.id === null) {
            let iD = maxId ++;
            console.log("Je suis dans la condition project.id = null");
            console.log("iD : " + iD);
            project['id'] = iD + 1;
        }
        console.log("project.id:" + project.id);
    });

    // Je supprime les doublons
    const uniqueProjects = Array.from(new Set(concatProjects.map(a => a.id)))
    .map(id => {
    return concatProjects.find(a => a.id === id)
    })

    console.log("uniqueProjects.length :" + uniqueProjects.length);
    console.log("uniqueProjects :" + uniqueProjects);

    // Je récupère les projets originaux du User avant modifications
    const userId = localStorage.getItem("userId");
    const projectsOfUser = projects.filter(function (project) {
    return project.userId == userId;
    })
    console.log("projectsOfUser :" + projectsOfUser);
    

}
*/

// Push des projets dans l'API
let publishButton = document.querySelector('#btn-publish');
publishButton.addEventListener('click', postProjectToAPI);
publishButton.addEventListener('click', postDeletedProjectToAPI);




/*
// Je cherche l'id le plus élevé des projects de l'API
for (let a = 0; latestProjectsInApi[a + 1] !== undefined; a++) {
    let latestProjectId = a + 2;
    
};

//Je cherche les id null dans les projets du localStorage et leur ajoute un id incrémental
for (let b = 0; latestStoredProjects[b + 1] !== undefined; b++) {
    let latestStoredProjectId = b + 2;
    
};
*/


