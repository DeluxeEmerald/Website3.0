const urlBase = "http://cop4331-89.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let globalUser = "";
let globalPass = "";
let oldName = "";
let oldPhone = "";
let oldMail = "";


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
                globalUser = login;
                globalPass = password;

                saveCookie();

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

function saveCookie(){
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",Username=" + globalUser + ",Password=" + globalPass + ",userId=" + userId;
}

function readCookie(){
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++){
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] == "firstName"){
            firstName = tokens[1];
        }
        else if(tokens[0] == "lastName"){
            lastName = tokens[1];
        }
        else if(tokens[0] == "Username"){
            globalUser = tokens[1];
        }
        else if(tokens[0] == "Password"){
            globalPass = tokens[1];
        }
        else if(tokens[0] == "userId"){
            userId = parseInt(tokens[1].trim());
        }
    }

    if(userId < 0){
        window.location.href = "index.html";
    }
}

function Welcome(){
    console.log(firstName);
    document.getElementById("User").innerHTML = firstName;
    console.log(globalUser);
    console.log(globalPass);
}


function Logout(){
    userId = 0;
    firstName = "";
    lastName = "";
    globalUser = "";
    globalPass = "";
    document.cookie = "firstName = ;";
    window.location.href = "index.html";
}

function loginReturn(){
    window.location.href = "Mainpage.html";
}

function  Cancel(){
    oldName = "";
    oldPhone = "";
    oldMail = "";
    document.getElementById("newName").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newMail").value = "";
    toggleView();
}

function searchContact(){
    let search = document.getElementById("searchText").value;
    document.getElementById("Message").innerHTML = "";

    let contactList = "";

    let tmp = {contactname:search, login:globalUser, password:globalPass};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Read.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);

                if(!jsonObject.contacts || !Array.isArray(jsonObject.contacts)){
                    document.getElementById("searchResult").innerHTML = jsonObject.error;
                    return;
                }

               const tableBody = document.getElementById("tableBody");
               tableBody.innerHTML = jsonObject.contacts.map(c => `
                    <tr class="bubble">
                        <td>${c.name}</td>
                        <td>${c.phone}</td>
                        <td>${c.email}</td>
                        <td class="Pic"><button onclick="flipSave('${c.name}', '${c.phone}', '${c.email}')"><img src="edit.png"></button></td>
                        <td class="Pic"><button onclick="removeContact('${c.name}', '${c.phone}', '${c.email}')"><img src="trash.jpeg"></button></td>
                    </tr>
                `).join('');
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("Error").innerHTML = err.error;
    }
}

function addContact(){
    let newName = document.getElementById("newName").value;
    let newPhone = document.getElementById("newPhone").value;
    let newMail = document.getElementById("newMail").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {login:globalUser, password:globalPass, contact:{name:newName, phone:newPhone, email:newMail}};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Create.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("Message").innerHTML = "Contact Added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("Error").innerHTML = err.error
    }
}


function flipSave(name, phone, email){
    toggleView();
    oldName = name;
    oldPhone = phone;
    oldMail = email;
    document.getElementById("newName").value = oldName;
    document.getElementById("newPhone").value = oldPhone;
    document.getElementById("newMail").value = oldMail;
}

function updateContact(){
    document.getElementById("Message").innerHTML = "";
    console.log("Update");
    let newName = document.getElementById("newName").value;
    let newPhone = document.getElementById("newPhone").value;
    let newMail = document.getElementById("newMail").value;

    let tmp = {login:globalUser, password:globalPass, contact:{name:oldName, phone:oldPhone, email:oldMail}, 
    newcontact:{name:newName, phone:newPhone, email:newMail}};

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Update.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("Message").innerHTML = "Contact Edited";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("Error").innerHTML = err.error
    }

}

function removeContact(name, phone, email){
    document.getElementById("Message").innerHTML = "";
    console.log("remove");

    let tmp = {login:globalUser, password:globalPass, contact:{name:name, phone:phone, email:email}};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Delete.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("Message").innerHTML = "Contact Removed";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("Error").innerHTML = err.error
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
                    globalUser = username;
                    globalPass = password;
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

function toggleView() {
    let tableView = document.getElementById("tableDiv");
    let formView = document.getElementById("formView");
    document.getElementById("newName").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newMail").value = "";

    if (tableView.style.display === "none") {
        tableView.style.display = "block";
        formView.style.display = "none";
    } else {
        tableView.style.display = "none";
        formView.style.display = "block";
    }
}