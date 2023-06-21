
// API: Get all project from the API
export async function getProjectsFromApi() {
    const reponse = await fetch('http://localhost:5678/api/works');
    let projects = await reponse.json();
    return projects;
}

// API: Requete API pour générer les catégories
export async function getCategoriesFromAPI() {
    const reponseCat = await fetch('http://localhost:5678/api/categories');
    let categories = await reponseCat.json();
    return categories;
}

// UI: Generate project UI if i'm logged out
export function renderProjects(projects) {

    // Récupération de l'élément du DOM qui accueillera les projets
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";

    for (let i = 0; i < projects.length; i++) {

        const figure = projects[i];

        // Création d’une balise dédiée à un projet
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;

        // Rattachement de la balise figure a la section Projets

        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(titleElement);
    }
}

// UI: Generate filters UI
export function genererCategories(categories, projects) {

    categories.forEach(categorie => {
        // Récupération de l'élément du DOM qui accueillera les categories
        const divFilters = document.querySelector(".filters");

        // Création d’une balise dédiée à une catégorie
        const categorieElement = document.createElement("div");
        categorieElement.dataset.id = categorie.id
        categorieElement.classList.add('facets');

        // Création des balises 
        const filterElement = document.createElement("button");
        filterElement.innerText = categorie.name;
        filterElement.classList.add('btn-' + categorie.id);
        filterElement.id = categorie.id ;
        filterElement.addEventListener('click', (event) => {
            const filteredProject = projects.filter((project) => {
                return project.categoryId == event.target.id;
            });
            document.querySelector(".gallery").innerHTML = "";
            renderProjects(filteredProject);
        })

        // Rattachement de la balise button a la div Filters
        divFilters.appendChild(categorieElement);
        categorieElement.appendChild(filterElement);

        // Filtrer les projets
        // const inputFilteredProjectsByObjets = document.querySelector('.btn-' + categorie.id)
    });

}

// Vérifier si le user est déja loggé
export function loadProject(projects, refresh = false) {

    if (imLoggedIn()) {
        // Filtrer les projets par user connecté 
        const userId = localStorage.getItem("userId");
        const projectsOfUser = projects.filter(function (project) {
            return project.userId == userId;
        });
        if(refresh == true){
            renderProjects(projects);
        }else{
            renderProjects(projectsOfUser);
        }
    } else {
        renderProjects(projects);
    }
}

// Check if i'm logged in
export function imLoggedIn() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    return !!userId && !!token;
}