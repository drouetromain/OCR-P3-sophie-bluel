function connexionUser() {
    console.log("connexionUser loqded");
    const logInForm = document.querySelector(".login-form");
    logInForm.addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("hqppen here");

        // Création de l’objet de connexion
        const connexion = {
        email: event.target.querySelector("[name=username]").value,
        password: event.target.querySelector("[name=password]").value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(connexion);
        console.log(chargeUtile);

        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
        })
        .then(response => response.json())
        .then(data => {
            // Si data retourne un token, redirection vers la HP, sinon afficher le message d'erreur
            if (data.token != null && data.token != undefined){
                localStorage.setItem("token", data.token);
                window.location.href = "/FrontEnd/";

            }else{
                const errorMessage = document.querySelector('#error-message');
                errorMessage.textContent = "les informations email / mot de passe ne sont pas correctes";
            }
        });
    });
}



connexionUser();
