// inisialisasi
let dbPromised = idb.open('soccer', 1, upgradeDb => {
    let table = upgradeDb.createObjectStore('match', {
        keyPath: 'id_match'        
    });
    table.createIndex('head2head', 'head2head', {unique: true});
    table.createIndex('match', 'match', {unique: true});
});

// fungsi untuk menyimpan data
function insert(data)
{
    dbPromised
    .then( db => {
        let tx = db.transaction('match', 'readwrite');
        let store = tx.objectStore('match');
        store.put(data);
        return tx.complete;
    })
    .then( () => {
        M.toast({
            html: `Match tersimpan`,
            classes: "rounded red",
        });
    })
    .catch( error => {
        M.toast({
            html: `Gagal Menyimpan`,
            classes: "rounded red",
        });
    });
}

// fungsi untuk melihat semua data pada table
function getData()
{
    return dbPromised
    .then( db => {
        let tx = db.transaction('match', 'readonly');
        let store = tx.objectStore('match');
        return store.getAll();
    });
}

// function untuk mengambil satu data pada table
function getDataBy(id)
{
    return dbPromised
    .then( db => {
        let tx = db.transaction('match', 'readonly');
        let store = tx.objectStore('match');
        return store.get(id);
    });
}

// function hapus data pada table
function deleteData(id)
{
    dbPromised
    .then( db => {
        let tx = db.transaction('match', 'readwrite');
        let store = tx.objectStore('match');
        store.delete(id);
        return tx.complete;
    })
    .then( () => {
        M.toast({
            html: `Data match berhasil di hapus`,
            classes: "rounded red",
        });
    })
    .catch( () => {
        M.toast({
            html: `Data match gagal di hapus`,
            classes: "rounded red",
        });
    })
}

export default {insert, getData, getDataBy, deleteData};