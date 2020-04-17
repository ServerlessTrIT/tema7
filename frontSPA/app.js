var books = [];

/***********************************
               API
************************************/

const API_KEY=""
const API_URL = "";
const API_LOGIN = API_URL+"login";
const API_SIGNUP = API_URL+"signup";
const API_CONFIRMSIGNUP = API_URL+"confirmsignup";
const API_BOOKS = API_URL+"books";

/* USERS */
function signup(event){
  console.log("signup");
  event.preventDefault();
  $.ajax({
    url: API_SIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    //$("div[id='msg']").text(resp.message);
    goTo('/confirmsignup');
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return true;
}

function confirmSignup(){
  console.log("confirmsignup");
  event.preventDefault();
  $.ajax({
    url: API_CONFIRMSIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "code":$("input[id='code']").val()
    })
  }).done(function(resp){
    $("div[id='msg']").text(resp.message);
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return false;
}

function login(event){
  console.log("login");
  event.preventDefault();
  
  $.ajax({
    url: API_LOGIN,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    localStorage.setItem('token', resp.token);
    goTo("/");
  }).fail(function(error){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Credenciales incorrectas");
  });
  
  return false;
}

/* BOOKS */

function getBooks(){
  console.log("getBooks");
  //event.preventDefault();
  
  $.ajax({
    url: API_BOOKS,
    method: "GET",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    }
  }).done(function(resp){
    books=resp.items;
    goTo("/books");
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

function putBook(){
  console.log("putBook");
  event.preventDefault();
  
  $.ajax({
    url: API_BOOKS,
    method: "POST",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "isbn":$("input[id='isbn']").val(),
      "title":$("input[id='title']").val()
    })
  }).done(function(resp){
    getBooks(); //actualizar listado de libros
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

function deleteBook(event){
  console.log("deleteBook");
  event.preventDefault();
  isbn = $(this).attr('id').split("_")[1];
  console.log(isbn);
  $.ajax({
    url: API_BOOKS,
    method: "DELETE",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "isbn":isbn
    })
  }).done(function(resp){
    getBooks(); //actualizar listado de libros
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

/***********************************
      VISTAS Y RENDERIZACIÓN
************************************/
function loginPage(){
  content ='<h1>Login</h1><br/><div id="msg"></div><br/><form id="formLogin"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button type="submit" value="Enviar" id="btnLogin">Enviar</button></form>';
  return content;
}

function signupPage(){
  content ='<h1>Registro</h1><br/><div id="msg"></div><br/><form id="formSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button type="submit" id="btnSignup">Enviar</button></form>';
  return content;
}
function confirmSignupPage(){
  content ='<h1>Confirmar e-mail</h1><br/><div id="msg"></div><br/><form id="formConfirmSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="text" name="code" id="code" placeholder="Código"><button type="submit"  id="btnConfirmSignup">Enviar</button></form>';
  return content;
}

function  newBookPage(){
  content='<h1>Nuevo libro</h1><br/>';
  content+='<form id="formBook"><input type="text" name="isbn" placeholder="ISBN" id="isbn"><input type="text" name="title" id="title" placeholder="Título"><button type="submit" value="Enviar" id="btnNewBook">Enviar</button></form>';
  return content;
}

function booksPage(){
  content='<h1>Libros</h1><br/><button id="linkNewBook">Nuevo libro</button><br/>';
  content+='<table border="1"><tr><th>ISBN</th><th>Título</th><th>Eliminar</th></tr>';
  for (i = 0; i< books.length; i++){
    content+='<tr><td>'+books[i].isbn+'</td><td>'+books[i].title+'</td><td><button id="isbn_'+books[i].isbn+'">X</button></td></tr>';
  }
  content+='</table>'
  return content;
}

function renderApp() {
  /* MENÚ */
  var li_books = document.getElementById('li_books');
  var li_login = document.getElementById('li_login');
  var li_logout = document.getElementById('li_logout');
  var li_signup = document.getElementById('li_signup');
  if (localStorage.getItem('token')===null){
    li_books.style.display = 'none';
    li_logout.style.display = 'none';
    li_login.style.display = 'block';
    li_signup.style.display = 'block';
  }else{
    li_books.style.display = 'block';
    li_logout.style.display = 'block';
    li_login.style.display = 'none';
    li_signup.style.display = 'none';
  }

/* CARGAR VISTAS */
  var content;
  if (window.location.pathname === '/books') {
    content = booksPage();
  } else if (window.location.pathname === '/newbook') {
    content = newBookPage();
  } else if (window.location.pathname === '/') {
    content = '<h1>¡Bienvenidos!</h1>';
  } else if(window.location.pathname === '/login'){
    content = loginPage();
  }else if(window.location.pathname === '/signup'){
    content = signupPage();
  }else if(window.location.pathname ==='/confirmsignup'){
    content=confirmSignupPage();
  }else if(window.location.pathname ==='/logout'){
    localStorage.removeItem('token');
    content = '<h1>¡Hasta pronto!</h1>';
    goTo("/");
  }
  var main = document.getElementsByTagName('main')[0];
  main.innerHTML = content;
}

/***********************************
             NAVEGACIÓN
************************************/
function navigate(evt) {
  evt.preventDefault();
  var href = evt.target.getAttribute('href');
  if(href==='/books'){
    getBooks();
  }
  window.history.pushState({}, undefined, href);
  renderApp();
}

function goTo(path) {
  window.history.pushState({}, undefined, path);
  renderApp();
}

function newBook(event){
  goTo('/newbook');
}


/***********************************
          INICIALIZACIÓN
************************************/
$(document).ready(init);

function init(){
  $("nav").click(navigate);
  $("body").on("click","form button[id='btnLogin']",login);
  $("body").on("click","form button[id='btnSignup']",signup);
  $("body").on("click","form button[id='btnConfirmSignup']",confirmSignup);
  $("body").on("click","button[id^='isbn']",deleteBook);
  $("body").on("click","button[id='linkNewBook']",newBook);
  $("body").on("click","form button[id='btnNewBook']",putBook);
  renderApp();
}