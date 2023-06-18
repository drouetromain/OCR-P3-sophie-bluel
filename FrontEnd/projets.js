/*
//Stockage du content dans le local Storage
let projects = window.localStorage.getItem('projects');

if (projects === null) {
    // Récupération du contenu depuis l'API
    const reponse = await fetch('http://localhost:5678/api/works');
    projects = await reponse.json();
    // Transformation du content en JSON
    const project = JSON.stringify(projects);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("projects", project);
} else {
    projects = JSON.parse(projects);
}
*/

const reponse = await fetch('http://localhost:5678/api/works');
let projects = await reponse.json();
// Transformation du content en JSON
const project = JSON.stringify(projects);
   

function genererProjects(projects) {

    for (let i = 0; i < projects.length; i++) {

        const figure = projects[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divGallery = document.querySelector(".gallery");

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

genererProjects(projects);

const reponseCat = await fetch('http://localhost:5678/api/categories');
let categories = await reponseCat.json();
// Transformation du content en JSON
const categorie = JSON.stringify(categories);

console.log(categories);

function genererCategories(categories) {

    for (let i = 0; i < categories.length; i++) {

        const button = categories[i];
        // Récupération de l'élément du DOM qui accueillera les categories
        const divFilters = document.querySelector(".filters");

        // Création d’une balise dédiée à une catégorie
        const categorieElement = document.createElement("div");
        categorieElement.dataset.id = categories[i].id
        categorieElement.classList.add('facets');

        // Création des balises 
        const filterElement = document.createElement("button");
        filterElement.innerText = button.name;
        filterElement.classList.add('btn-' + button.id);

        // Rattachement de la balise button a la div Filters
        
        divFilters.appendChild(categorieElement);
        categorieElement.appendChild(filterElement);

        // Filtrer les projets
        const inputFilteredProjectsByObjets = document.querySelector('.btn-' + button.id)
        inputFilteredProjectsByObjets.addEventListener('click', function(){
            const filteredProjectsByObjets = projects.filter(function(project){
                return project.categoryId == button.id;
            });
            document.querySelector(".gallery").innerHTML = "";
            genererProjects(filteredProjectsByObjets);    
        })
    }
}

genererCategories(categories);


/*
// Filtrer les projets par Objets
const inputFilteredProjectsByObjets = document.querySelector('.btn-1')
inputFilteredProjectsByObjets.addEventListener('click', function(){
    const filteredProjectsByObjets = projects.filter(function(project){
        return project.categoryId == 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByObjets);    
})

// Filtrer les projets par Appartements 
const inputFilteredProjectsByAppartements = document.querySelector('.btn-2')
inputFilteredProjectsByAppartements.addEventListener('click', function(){
    const filteredProjectsByAppartements = projects.filter(function(project){
        return project.categoryId == 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByAppartements);    
}) 

// Filtrer les projets par Hôtels 
const inputFilteredProjectsByHotels = document.querySelector('.btn-3')
inputFilteredProjectsByHotels.addEventListener('click', function(){
    const filteredProjectsByHotels = projects.filter(function(project){
        return project.categoryId == 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByHotels);    
}) 
*/
// Filtrer les projets par Tous 
const inputNotFilteredProjects = document.querySelector('#btn-tous')
inputNotFilteredProjects.addEventListener('click', function(){
    const notFilteredProjects = projects.filter(function(project){
        return project.categoryId != null || undefined;
        // return project.categoryId == 1 || 2 || 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(notFilteredProjects);    
}) 

// Vérifier si le user est déja loggé
function checkConnectedUser(){
    const token = localStorage.getItem("token");
    console.log(token);
    if(token != null && token != undefined){
        const logged = document.querySelector('#btn-login');
        logged.textContent = "Logout";

        // Supprimer les filtres
        const element = document.getElementById("js-filters");
        element.remove();
    }else{
        const topBarEditionMode = document.getElementById("top-bar-edition-mode");
        topBarEditionMode.remove();
        const modifyButtonH2 = document.getElementById("js-modify-project-h2");
        modifyButtonH2.remove();
        const modifyButtonIntroBlock = document.getElementById("js-modify-project-intro-block");
        modifyButtonIntroBlock.remove();

    }
}

checkConnectedUser();

// Délogger le user
function logOut(){
    const token = localStorage.getItem("token");
    if(token != null && token != undefined){
        const removeUser = document.querySelector('#btn-login');
        removeUser.addEventListener('click', function(){
            event.preventDefault();
            window.location.href = "/FrontEnd/";
            localStorage.removeItem("token");
            });
    }
}

logOut();

