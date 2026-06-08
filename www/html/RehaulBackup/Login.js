const urlBase = "http://cop4331-89.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function Login(){

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;

    document.getElementById("loginResult").innerHTML = "";

    //Confirm Input
    console.log("Username:" + login);
    console.log("Password:" + password);

    let tmp = {login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if(userId < 1)
                {
                    document.getElementById("loginResult").innerHTML = jsonObject.error;
                    return;
                }

                //Save information
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                //Redirect to page
                window.location.href = "Mainpage.html";
            }
            
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("loginResult").innerHTML = err.error;
        console.log("Error");
    }
    
}

function  Cancel(){
     window.location.href = "index.html";
}

function searchContact(){
    let search = document.getElementById("searchText").value;
    document.getElementById("searchResult").innerHTML = "";

    let contactList = "";

    let tmp = {search:search, userId:userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchhContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && thiis.status == 200){
                document.getElementById("searchResult").innerHTML = "Contacts have been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for(let i = 0; i < jsonObject.results.length; i++){
                    contactList += jsonObject.results[i];
                    if(i < jsonObject.results.length - 1){
                        contactList += "<br/>\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("searchResult").innerHTML = err.error;
    }
}

function addContact(){
    let newContact = document.getElementById("contactText").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {contact:newContact,userId,userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("contactAddResult").innerHTML = "Contact Added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("contactAddResult").innerHTML = err.error
    }

}

function register(){
    let fName = document.getElementById("fName").value;
    let lName = document.getElementById("lName").value;
    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;

    let tmp = {firstname:fName, lastname:lName, login:username, password:password};
    let jsonPayload = JSON.stringify(tmp);

    console.log(jsonPayload);


    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                document.getElementById("createResult").innerHTML = jsonObject.error;
                if(jsonObject.error === ""){
                    console.log("Good");
                    Login();
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("createResult").innerHTML = err.error
    }
}
