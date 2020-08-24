import pages from '../config/api.js';
import db from '../config/db.js';

function loadPage(page, dataDb = undefined)
{
    var content = document.querySelector('.main-content');

    fetch(`html/${page}.html`)
    .then(response => {
        if(response.status === 200) {
            return response.text();
        } else if (response.status === 404) {
            return `<p>Halaman Tidak Ditemukan</p>`;
        } else {
            return `<p>Halaman Tidak Dapat di Akses</p>`;
        }
    })
    .then(data => {
        if(page === 'home') {
            content.innerHTML = data;

            // link yang di klik pada url di halaman home
            content.addEventListener('click', e => {
                if(e.target.getAttribute('href')){
                    let url = e.target.getAttribute('href').substring(1);
                    
                    switch(url)
                    {
                        case 'epl':
                            loadPage(url);
                            pages.league('2021');
                            break;
                        case 'laliga':
                            loadPage(url);
                            pages.league('2014');
                            break;
                        case 'saved':
                            loadPage(url);
                            break;
                        default:
                            loadPage(url);
                            break;
                    }

                }
            });
        } else if(page === 'saved') {
            content.innerHTML = data;
            
            // membuat promise untuk menampilkan seluruh data
            db.getData()
            .then( data => {
                return new Promise( (resolve, reject) => {

                    // memeriksa jumlah data
                    if(data.length <= 0) {
                        document.querySelector('.saved-list')
                        .innerHTML = '<h6 class="center">Data Match tersimpan tidak ada</h6>';
                    } else {
                        let list = document.querySelector('#match-list');

                        // mengatasi bug
                        list.innerHTML = '';
                        let no = 1;                        

                        // menampilkan seluruh data
                        for( let i = 0; i < data.length; i++)
                        {
                            list.innerHTML += `
                                    <tr>
                                        <td>${no + i}</td>
                                        <td>${data[i].head2head.homeTeam.name}</td>
                                        <td>${data[i].head2head.awayTeam.name}</td>
                                        <td>${data[i].match.utcDate.substr(0, 10)}</td>
                                        <td>
                                            <button class="btn red accent-4" id="delete" data-id="${data[i].match.id}">delete</button>
                                            <a href="#detail" class="btn waves-effect waves-light" id="detail" data-id="${data[i].match.id}">Detail</a>
                                        </td>
                                    </tr>`;
                        }

                        // membuat tombol delete dan detail berfungsi
                        list.addEventListener('click', function(e){
                            // mengambil data primarykey
                            let id = e.target.getAttribute('data-id');

                            if (e.target.getAttribute('id') === 'delete') {
                                // data match di hapus
                                db.deleteData(parseInt(id));
                                loadPage('saved');

                            } else if (e.target.getAttribute('id') === 'detail') {
                                // promise untuk mengambil data untuk detail
                                db.getDataBy(parseInt(id))
                                .then( dataDb => {
                                    return new Promise( (resolve, reject) => {                                        
                                        loadPage('detail', dataDb);
                                    });
                                })
                                .catch( error => console.log(error));
                            }
                        });
                    }
                });
            });
            
        } else if(page === 'detail') {
            // memuat halaman
            content.innerHTML = data;

            // membuat data detail pertandingan
            let matchs = dataDb.match;
            let h2h = dataDb.head2head;
            let elm = document.querySelector('.detail-match');
            elm.innerHTML = `
            <div class="card">
                <div class="card-content center">
                    <div class="row">
                        <div class="card-title">
                            ${matchs.competition.name}
                        </div>
                        <div class="col s12">
                            ${matchs.utcDate.substr(0, 10)}
                        </div>        
                    </div>
                    <div class="row">
                        <div class="col s4">${h2h.homeTeam.name}</div>
                        <div class="col s4">vs</div>
                        <div class="col s4">${h2h.awayTeam.name}</div>
                    </div>                
                    <div class="row">
                        <div class="col s4">${matchs.score.halfTime.homeTeam === null ? 0 : matchs.score.halfTime.homeTeam}</div>
                        <div class="col s4">Half Time</div>
                        <div class="col s4">${matchs.score.halfTime.awayTeam === null ? 0 : matchs.score.halfTime.awayTeam}</div>
                    </div>
                    <div class="row">
                        <div class="col s4">${matchs.score.fullTime.homeTeam === null ? 0 : matchs.score.fullTime.homeTeam}</div>
                        <div class="col s4">Full Time</div>
                        <div class="col s4">${matchs.score.fullTime.awayTeam === null ? 0 : matchs.score.fullTime.awayTeam}</div>
                    </div>
                    <div class="row">
                        <div class="col s4">${matchs.score.extraTime.homeTeam === null ? 0 : matchs.score.extraTime.homeTeam}</div>
                        <div class="col s4">Extra Time</div>
                        <div class="col s4">${matchs.score.extraTime.awayTeam === null ? 0 : matchs.score.extraTime.awayTeam}</div>
                    </div>
                    <div class="row">
                        <div class="col s4">${matchs.score.penalties.homeTeam === null ? 0 : matchs.score.penalties.homeTeam}</div>
                        <div class="col s4">Penalty</div>
                        <div class="col s4">${matchs.score.penalties.awayTeam === null ? 0 : matchs.score.penalties.awayTeam}</div>
                    </div>
                    <div class="row col s12">Head 2 Head</div>
                    <div class="row">
                        <div class="col s4">${h2h.homeTeam.wins}</div>
                        <div class="col s4">Win</div>
                        <div class="col s4">${h2h.awayTeam.wins}</div>
                    </div>
                    <div class="row">
                        <div class="col s4">${h2h.homeTeam.draws}</div>
                        <div class="col s4">Draw</div>
                        <div class="col s4">${h2h.awayTeam.draws}</div>
                    </div>
                    <div class="row">
                        <div class="col s4">${h2h.homeTeam.losses}</div>
                        <div class="col s4">Lost</div>
                        <div class="col s4">${h2h.awayTeam.losses}</div>
                    </div>
                </div>
            </div>`;

            // menghapus match
            let del = document.querySelector('#delete');
            del.addEventListener('click', e => {

                if(e.target.getAttribute('data-name') === 'delete') {
                    db.deleteData(parseInt(dataDb.id_match));
                    loadPage('saved');
                }
            });
        } else {
            content.innerHTML = data;
        }
    })
    .catch(error => console.log('error: ' + error));
}

export default loadPage;