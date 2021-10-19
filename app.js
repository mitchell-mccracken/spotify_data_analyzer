// ****************************** //
// ********** OVERVIEW ********** //
// ****************************** //
// Purpose: this app is made to analyse spotify streaming data
// Goal: The goal was to make a website where you could upload you data but from what I can understand this is prevented by the web browser. I believe it is a security risk to allow a browser to read local files. I think I will re-write in either python and output as an executable or write in java or C# so others can use it. 


// ************************** //
// ********** CODE ********** //
// ************************** //

// md = require('./StreamingHistory0.json')            //this is for running only the first file, used for program testing
// import md from './StreamingHistory0'               //adde for running in web browser, turns out this would not work with web browser...
const testFolder = './streaming_history_files/'         // place all StreamingHistory.json files here
const fs = require('fs')

// get all files for streaming history and save as files array, this is used in a for loop
let files = []
fs.readdirSync(testFolder).forEach(file => {
    let sliced_string = file.slice(0,16)
    if (sliced_string === 'StreamingHistory') {
        files.push(testFolder + file)
    }
    return files
})

//combine contents of all streaming files to one master data variable (md)
let bigFile = []
for (let j = 0; j < files.length; j++) {
    const file = files[j];
    let md = require(file) 
// bigFile.push(files[2])
    for (let i = 0; i < md.length; i++) {
        const element = md[i];
        bigFile.push(element)
    }
}

//originally I wrote this program using md as a single file so all functions are wrote with the input of 'md', I could find and replace but I took the easy way out for now. 
let md = bigFile;

//filter by dates, never used
date_filtered_md = []
DateFilter = (start , end) => {
    let st = Date.parse(start)
    let et = Date.parse(end)
    md.forEach(element => {
        let song_time = Date.parse(element.endTime)
        if (song_time < et && song_time> st){
            console.log(element.trackName , ' | ', element.artistName)
            date_filtered_md.push(element)
        }
        // console.log(element.endTime) 
    });
}

//made this just for fun
Shortest_Play_Time = () => {
    let playtime = 60000000
    let count = 0
    let index =0
    md.forEach( el => {
        if (el.msPlayed < playtime) {
            playtime = el.msPlayed
            index = count
        }
        count +=1
    })
    console.log(playtime)
    console.log(index)
    console.log(md[index])
}

// top song played
TopSong = () => {
    const song_arr=[]
    for (let index = 0; index < md.length; index++) {
        const el = md[index];
        let index_pos = song_arr.findIndex( song => song.song === el.trackName)
        if (index_pos>=0) {
            song_arr[index_pos].count += 1
        } else {
            let my_obj = {
                artist: el.artistName,
                song: el.trackName,
                count: 1
            }
            song_arr.push(my_obj)
        }
    }
    return song_arr
}

TopSongPlayTimeFiltered = (msTime) => {
    const song_arr=[]
    for (let index = 0; index < md.length; index++) {
        const el = md[index];
        let index_pos = song_arr.findIndex( song => song.song === el.trackName)
        if (index_pos>=0 && el.msPlayed >= msTime) {
            song_arr[index_pos].count += 1
        } else if (el.msPlayed < msTime) {
        } else {
            let my_obj = {
                artist: el.artistName,
                song: el.trackName,
                count: 1
            }
            song_arr.push(my_obj)
        }
    }
    return song_arr
}

// top artist played, this could be misleading because 'artist' and 'artist featuring other artist' are treated as two different artist
TopArtist = () => {
    const artist_arr =[]
    for (let index = 0; index < md.length; index++) {
        const el = md[index];
        let index_pos = artist_arr.findIndex( artist => artist.artist === el.artistName)
        if (index_pos >= 0 ){
            // console.log(index_pos)
            artist_arr[index_pos].count += 1
            // console.log(artist_arr[index_pos])
        } else {
            let my_obj = {
                artist: el.artistName,
                count:1
            }
            artist_arr.push(my_obj)
        }      
    }
    return artist_arr
}

//top artist filted by minimum song playtime (msTime)
TopArtistPlayTimeFiltered = (msTime) => {
    const artist_arr =[]
    for (let index = 0; index < md.length; index++) {
        const el = md[index];
        let index_pos = artist_arr.findIndex( artist => artist.artist === el.artistName)
        if (index_pos >= 0 && el.msPlayed >= msTime){
            // console.log(index_pos)
            artist_arr[index_pos].count += 1
            // console.log(artist_arr[index_pos])
        } else if ( el.msPlayed < msTime) {                         //igonore song if played less than msTime
            // console.log('song not played long enough')
        } else {
            let my_obj = {
                artist: el.artistName,
                count:1
            }
            artist_arr.push(my_obj)
        }      
    }
    return artist_arr
}

//basic function to sort and reduce the array, inside this function you can choose ascending or descending 
SortAndSlice = (array , number) => {
    array.sort( (a , b) => {
        return b.count -a.count     //sorts descending
    })
    sliced = array.slice(0,number)
    console.log(sliced)
}

//If you listen to podcasts they will mostlikely be the longest played tracks...
SortTimePlayed = (number) => {
    md.sort((a , b) => {
        // return a.msPlayed - b.msPlayed       //ascending 
        return b.msPlayed - a.msPlayed          //descending
    })
    sliced = md.slice(0 , number)
    console.log(sliced)
}

//total time listend on spotify
TotalTimeListened = () => {
    let time = 0
    md.forEach(element => {
        time += element.msPlayed
    });
    console.log(time/1000 , " seconds")
    console.log(time/ 60000 , ' minutes')
    console.log(time/60000/60, ' hours')
    console.log(time/60000/60/24, ' days')
    return time
}
//not sure why I made this but I will leave it
RandoFunction = () => {
    console.log('rando function run')
}

console.log('----------------')
// use these variable to inport into the 'SortAndSlice' function or make your own
top_artist = TopArtist()
top_artist_filtered = TopArtistPlayTimeFiltered(15000)
top_artist_filtered_2 = TopArtistPlayTimeFiltered(60000)
top_songs_filtered = TopSongPlayTimeFiltered(60000)
top_songs = TopSong()
let num = 10                                                //how many artist to display
// TotalTimeListened()
// console.log(SortAndSlice(top_artist_filtered_2 , num))
SortAndSlice(top_artist_filtered_2 , num)
SortAndSlice(top_songs_filtered , num)

