
// API: Récupérer tous les projets de l'API
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

// dataURL to blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// API: Requete API pour ajouter les projets
export async function postProjectToAPI() {

    const newProjectsToSend = JSON.parse(localStorage.getItem("projectsAdded"));
    if (newProjectsToSend !== null) {
        newProjectsToSend.forEach(async function (project) {
            var blob = dataURLtoBlob(project.imageUrl);
            let token = localStorage.getItem("token");

            let categoryId = project.categoryId;
            let stringCategory = categoryId.toString();

            let data = new FormData();
            data.append('image', blob, project.imageName);
            data.append('title', project.title);
            data.append('category', stringCategory);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5678/api/works',
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=------WebKitFormBoundarysxw1qnGKu95V1YQu',
                    'Authorization': `Bearer ${token}`,
                },
                data: data
            };

            await axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
        });
        localStorage.removeItem("projectsAdded");
    }
}

// API: Requete API pour supprimer les projets
export async function postDeletedProjectToAPI() {

    const newDeletedProjectsToSend = JSON.parse(localStorage.getItem("projectsDeleted"));
    if (newDeletedProjectsToSend !== null) {
        newDeletedProjectsToSend.forEach(async function (project) {

            let projectId = project.id;
            let token = localStorage.getItem("token");

            let myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            const reponseProject = await fetch('http://localhost:5678/api/works/' + projectId, {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            });
        });

        localStorage.removeItem("projectsDeleted");

    }
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
        projectElement.dataset.id = projects[i].id || 99 - i;

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



// UI: Générer les filtres UI
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
        filterElement.id = categorie.id;
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

    });

}


// UI: Générer les categories pour le formulaire de la modal

export function genererCategoriesForm(categories) {

    categories.forEach(categorie => {
        // Récupération de l'élément du DOM qui accueillera les categories
        const selectCategoriesInForm = document.querySelector("#categories-options");

        // Création des balises <option>
        const categorieName = document.createElement("option");
        categorieName.value = categorie.id;
        categorieName.innerText = categorie.name;
        //categorieName.value.add('value' + categorie.id);

        // Rattachement de la balise <option> a la balise <select>
        selectCategoriesInForm.appendChild(categorieName);

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
        if (refresh == true) {
            renderProjects(projects);
        } else {
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

