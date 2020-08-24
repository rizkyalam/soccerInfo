// import api from './config/api.js';
import loadNav from './loader/nav.js';
import loadPage from './loader/page.js';

document.addEventListener('DOMContentLoaded', function(){    

    // load navbar dan sidenav
    let nav = document.querySelector('.sidenav');
    M.Sidenav.init(nav);
    loadNav();
    
    // load halaman
    let page = window.location.hash.substr(1);
    if(page === '') page = 'home';                     
    loadPage(page);
    
});