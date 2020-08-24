import loadPage from './page.js';
import pages from '../config/api.js';
import db from '../config/db.js';

function loadNav()
{       
    fetch('./html/navbar.html')
    .then( response => {
        if (response.status !== 200) return;
        return response.text();    
    })
    .then(data => {
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav")
        .forEach(elm => elm.innerHTML = data);

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll('.sidenav a, .topnav a')
        .forEach(elm => {
            elm.addEventListener('click', e => {
                // Tutup sidenav
                var sidenav = document.querySelector('.sidenav');
                M.Sidenav.getInstance(sidenav).close();
                
                // Muat konten halaman yang dipanggil 
                let page = e.target.getAttribute('href').substring(1);   
                
                switch(page)
                {
                    case 'epl':
                        loadPage(page);
                        pages.league('2021');
                        break;
                    case 'laliga':
                        loadPage(page);
                        pages.league('2014');
                        break;
                    case 'saved':
                        loadPage(page);
                        db.getData();
                        break;
                    default:
                        loadPage(page);
                        break;
                }
                                                        
            });
        });
        
    })
    .catch(error => console.log(`Error : ${error}`));    
}

export default loadNav;