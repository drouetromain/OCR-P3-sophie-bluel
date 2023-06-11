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

 /*function genererProjects(projectsList, categoryId=null) {*/

    /*let projects = categoryId == null ? projectsList : projectsList.filter(project => project.categoryId == categoryId);*/

function genererProjects(projects) {

    for (let i = 0; i < projects.length; i++) {

    
        /*
        // Récupération de l'élément du DOM qui accueillera les filtres
        const divFilters = document.querySelector(".filters");
        // Création d’une balise dédiée à un filtre
        const filtersElement = document.createElement("div");
        filtersElement.dataset.id = projects[i].id
        // Création des balises 
        const facetElement = document.createElement("a");
        facetElement.innerText = div.title;
        
        divFilters.appendChild(filtersElement);
        filtersElement.appendChild(facetElement);
         */

        const figure = projects[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const divGallery = document.querySelector(".gallery");

        /*const divFilters = document.querySelector(".filters");*/

        // Création d’une balise dédiée à un projet
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id

        /*const filtersElement = document.createElement("div");
        filtersElement.dataset.id = projects[i].id*/

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;

        /*const facetElement = document.createElement("a");
        facetElement.innerText = div.name;*/

        // Rattachement de la balise figure a la section Filters & Portfolio
        
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(titleElement);  

        /*divFilters.appendChild(filtersElement);
        filtersElement.appendChild(facetElement);*/
    }
}

genererProjects(projects);


/*const btnTous = document.querySelector("#btn-tous");
btnTous.addEventListener("click", function(){
    const projectsFiltered = projects.filter(function (project){
        return project.categoryId == 2;
    });
    console.log(projectsFiltered);
});*/

/* Filter les projets par Objets */
const inputFilteredProjectsByObjets = document.querySelector('#btn-objets')
inputFilteredProjectsByObjets.addEventListener('click', function(){
    const filteredProjectsByObjets = projects.filter(function(project){
        return project.categoryId == 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByObjets);    
})

/* Filter les projets par Appartements */
const inputFilteredProjectsByAppartements = document.querySelector('#btn-appartements')
inputFilteredProjectsByAppartements.addEventListener('click', function(){
    const filteredProjectsByAppartements = projects.filter(function(project){
        return project.categoryId == 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByAppartements);    
}) 

/* Filter les projets par Hôtels */
const inputFilteredProjectsByHotels = document.querySelector('#btn-hotels')
inputFilteredProjectsByHotels.addEventListener('click', function(){
    const filteredProjectsByHotels = projects.filter(function(project){
        return project.categoryId == 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(filteredProjectsByHotels);    
}) 

/* Filter les projets par Tous */
const inputNotFilteredProjects = document.querySelector('#btn-tous')
inputNotFilteredProjects.addEventListener('click', function(){
    const notFilteredProjects = projects.filter(function(project){
        return project.categoryId == 1 || 2 || 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(notFilteredProjects);    
}) 

/*
let btnTous = document.getElementById("tous");
btnTous.addEventListener("click", () => {
    genererProjects(projects);
})
*/
