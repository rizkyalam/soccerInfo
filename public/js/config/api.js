import loadPage from '../loader/page.js';
import progressBar from '../loader/progressBar.js';
import db from './db.js';

let url = 'https://api.football-data.org/v2/';
let token = '97c973ce45124016bb7284e2069117e4';
let api = {
    method: 'get', 
    headers: {
        'x-auth-token': token
    }
}

// klasemen liga
let league = (id_liga) => {   
    if ('caches' in window) {
        caches.match(`${url}competitions/${id_liga}/standings`).then(function(response) {
            if (response) {
                response.json()
                .then(data => elmLeague(data));
            }
        })
    }

    return fetch(`${url}competitions/${id_liga}/standings`, api)
    .then(response => response.json())
    .then(data => elmLeague(data))
    .catch(error => console.log(error));    
}

// fungsi untuk detail setiap tim
let team = (teamId) => {
    return fetch(`${url}teams/${teamId}`, api)
    .then(response => response.json())
    .then(data => {

        // mengisi data info team
        document.querySelector('#img-team').setAttribute('src', data.crestUrl);
        document.querySelector('#shortname').innerText = data.shortName;
        document.querySelector('#venue').innerText = data.venue;
        document.querySelector('#founded').innerText = data.founded;
        document.querySelector('#email').innerText = data.email;
        document.querySelector('#phone').innerText = data.phone;
        document.querySelector('#website').innerHTML = `<a href="${data.website}">${data.website}</a>`;

        // mengisi data pemain pada tim
        let elm = document.querySelector('.table-player');

        for(let i = 0; i < data.squad.length; i++)
        {
            elm.innerHTML += `
                <tr>
                    <td>${data.squad[i].shirtNumber === null ? 0 : data.squad[i].shirtNumber}</td>
                    <td>${data.squad[i].name}</td>
                    <td>${data.squad[i].position}</td>
                </tr>`;
        }
    })
    .catch(error => console.log(error));
}

// fungsi untuk pertandingan setiap tim
let matchTeam = (teamId) => {
    return fetch(`${url}teams/${teamId}/matches?status=SCHEDULED&limit=10`, api)
    .then(response => response.json())
    .then(data => {
        // menghilangkan progress bar
        progressBar();
        
        // memeriksa matches
        let infoMatches = document.querySelector('.match-info');
        let matches = data.matches;
        if(matches <= 0) {
            infoMatches.innerHTML = `
            <div class="col s12 card red">
                <div class="card-content white-text">
                    <span class="card-title center">Tidak ada pertandingan</span>
                </div>
            </div>
            `;
            
        } else {
            // mengisi matches
            for(let i = 0; i < matches.length; i++)
            {
                infoMatches.innerHTML += `
                <div class="col s12 m6 card">
                    <div class="card-content">
                        <div class="row">
                            <div class="col s8 competition-name">${matches[i].competition.name}</div>
                            <div class="col date-matches right">${matches[i].utcDate.substr(0, 10)}</div>
                        </div>
                        <div class="row">
                            <div class="col s6 home">${matches[i].homeTeam.name}</div>
                            <div class="col home-score right">${matches[i].score.fullTime.homeTeam === null ? 0 : matches[i].score.fullTime.homeTeam}</div>
                        </div>
                        <div class="row">
                            <div class="col s6 Away">${matches[i].awayTeam.name}</div>
                            <div class="col away-score right">${matches[i].score.fullTime.awayTeam === null ? 0 : matches[i].score.fullTime.awayTeam}</div>
                        </div>
                        <a href="#match" class="red-text text-darken-1" data-id="${matches[i].id}">Detail</a>
                    </div>
                </div>`;
            }

            // menambahkan event supaya dapat melihat detail
            infoMatches.addEventListener('click', e => {
                if(e.target.getAttribute('href')) {
                    loadPage('match');
                    matchDetail(e.target.getAttribute('data-id'));
                }
            });
        }
    })
    .catch(error => console.log(error));
}

// fungsi untuk detail match
let matchDetail = (id) => {
    if ('caches' in window) {
        caches.match(`${url}matches/${id}`).then(function(response) {
            if (response) {
                response.json()
                .then((data) => elmMatchDetail(data));
            }
        })
    }

    return fetch(`${url}matches/${id}`, api)
    .then(response => response.json())
    .then(data => elmMatchDetail(data))    
    .catch(error => console.log(error));
}

// function untuk memunculkan element html pada function league
let elmLeague = (data) => {
    // menghilangkan progress bar
    progressBar();

    // memunculkan daftar tim
    let teamList = document.querySelector('.list-team');
    teamList.style.display = "block";

    // inisialisasi untuk mengisi data tim
    let lengthData = data.standings[0].table.length;
    let elm = document.querySelector('.table-team')
    let no = 1;

    // memasukan nya ke dalam table
    for(let i = 0; i < lengthData; i++) {                        
        elm.innerHTML += `
                <tr>
                    <td>${no++}</td>
                    <td><a href="#team" data-id="${data.standings[0].table[i].team.id}">
                        ${data.standings[0].table[i].team.name}
                    </a>
                    </td>
                    <td>${data.standings[0].table[i].playedGames}</td>
                    <td>${data.standings[0].table[i].draw}</td>
                    <td>${data.standings[0].table[i].won}</td>
                    <td>${data.standings[0].table[i].lost}</td>
                    <td>${data.standings[0].table[i].points}</td>
                </tr>`;                    
    }

    elm.addEventListener('click', e => {
        if(e.target.getAttribute('href')) {
            var teamId = e.target.getAttribute('data-id');
            loadPage('team');
            team(teamId);
            matchTeam(teamId);
        }
    });
}

// function untuk memunculkan element html pada function matchDetail
let elmMatchDetail = (data) => {
    // menghilangkan progress bar
    progressBar();

    // membuat data detail pertandingan
    let matchs = data.match;
    let h2h = data.head2head;
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

    // menyimpan match
    let save = document.querySelector('#save');
    save.addEventListener('click', e => {

        if(e.target.getAttribute('data-name') === 'save') {
            // memasukan data
            let dataDb = {
                id_match: matchs.id,
                head2head: h2h,
                match: matchs
            };
            db.insert(dataDb);

            // mengubah attribut supaya tidak dapat menginsert data ke database
            document.querySelector('.save-btn')
            .setAttribute('data-name', '');

            // mengubah warna
            save.setAttribute('class', 'btn-floating btn-large grey lighten-2');
        }
    });
}

export default {league, team};