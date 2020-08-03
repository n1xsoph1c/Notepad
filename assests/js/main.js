const {dialog} = require("electron").remote
const path = require('path')
const fs = require('fs')
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function changeBGColor(cls, col, tag) {
    if (tag == undefined){
      var cols = document.getElementsByClassName(cls);
      for(i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = col;
      }
  }else{
    var cols = document.getElementsByTagName(tag);
      for(i = 0; i < cols.length; i++) {
        cols[i].style.backgroundColor = col;
      }
  }
}

function changeColor(id, col, bgcol) {
  document.getElementById(id).setAttribute('style', `color:${col} !important; background-color:${bgcol}`);
}

function changeTheme(){
  if(localStorage.theme == null){
    localStorage.theme="dark"
  }else{
    var theme = localStorage.theme;
    if(theme == "dark"){
      localStorage.theme = "light";
      changeBGColor("sidenav", "#f0eff4") // nav light - dark
      document.getElementById("changeThemeBtn").setAttribute("class", "btn btn-dark navbar-btn hvr-grow-rotate animated fadeInLeft hvr-icon-grow-rotate") //ChangeBtn Dark - light
      changeBGColor("limiter", "#262730") // limiter dark - light
      changeColor("notes", "#f0eff4", "#262730") // form-background light - dark
    }else{
      localStorage.theme = "dark";
      changeBGColor("sidenav", "#262730")
      document.getElementById("changeThemeBtn").setAttribute("class", "btn btn-default navbar-btn hvr-grow-rotate animated fadeInLeft hvr-icon-grow-rotate") //ChangeBtn ligh - Dark
      changeBGColor("limiter", "#f0eff4") // limiter light - dark
      changeColor("notes", "#262730", "#f0eff4") // form-background light - dark
    }
  }
}

function importNote(){
  var filename
  dialog.showOpenDialog({
    buttonLabel: "Open",  
    message: "Open a note",
    filters: [
      {name: "All files", extensions:['*']},
      {name: 'Text documents', extensions: ['txt'] },
      {name: 'Markdown documents', extensions: ['md'] }
    ],
    properties: ['openFile', 'multiSelections']
  }).then(result => {
    filename = result.filePaths[0]
    if(filename === undefined){
      alert("Sorry there some internal error openning the file")
      return ""
    }else{
      var x = document.getElementById("notes");
      var f = document.getElementById("note-file");
      fs.readFile(filename, (err, data) => { 
        if (err) {
          alert('an error ocurred while importing file ' + err.message);
          return ""
        }
        x.value = data;
        var n = path.parse(filename).base;
        f.setAttribute('placeholder', "File: "+ n);
        document.getElementById("file-path").setAttribute("placeholder", filename)
      }) 
    }
  })
   
    // // EMPTY THE Textarea First 
    // for(var i = 0; i<m.length - 1; i++){
    //   x.innerHTML += m[i];
    // }
    // console.log(`slected ${n}`)
  
}

function saveNote(){
  var file_path = document.getElementById("file-path").getAttribute("placeholder");
  var file_name = path.parse(file_path).base;
  var f = document.getElementById("note-file");
  var content = document.getElementById("notes").value;

  if(!file_path){
    alert("You must either create a new file or import a file before saving!");
  }else{
    fs.truncate(file_path, 0, function(err){
      if (err) alert(err)
      fs.writeFile(file_path, content, function (err) {
        if (err){
          f.setAttribute("placeholder", "Error saving file | " + file_name);
          document.getElementById("saveNoteBtn").setAttribute("class", "btn btn-danger navbar-btn hvr-forward animated fadeInLeft hvr-icon-buzz-out")
          sleep(2500).then(() => {
            f.setAttribute("placeholder", "File: " + file_name); 
            document.getElementById("saveNoteBtn").setAttribute("class", "btn btn-warning navbar-btn hvr-forward animated fadeInLeft hvr-icon-buzz-out")
          })
          throw err;
        }else{
          f.setAttribute("placeholder", "File Saved Succesfully | " + file_name);
          document.getElementById("saveNoteBtn").setAttribute("class", "btn btn-success navbar-btn hvr-forward animated fadeInLeft hvr-icon-buzz-out")
          sleep(2500).then(() => {
            f.setAttribute("placeholder", "File: " + file_name); 
            document.getElementById("saveNoteBtn").setAttribute("class", "btn btn-warning navbar-btn hvr-forward animated fadeInLeft hvr-icon-buzz-out")
          })
        }
      })
    })
  }
}

function createNote(){
  var filename
  dialog.showSaveDialog({
    buttonLabel: "Create",  
    message: "Create a new note",
    filters: [
      {name: 'Text documents', extensions: ['txt'] },
      {name: 'Markdown documents', extensions: ['md'] },
      {name: "All files", extensions:['*']}
    ],
    properties: ['openFile', 'multiSelections']
  }).then(result => {
    filename = result.filePath 
    if(filename === undefined){
      alert("Sorry there some internal error creating or saving the file")
      return ""
    }else{
      fs.writeFile(filename, "", (err) => {
        if (err) {
          alert('an error ocurred with file creation ' + err.message);
          return
        }
        var file_name = path.parse(filename).base;
        document.getElementById("file-path").setAttribute("placeholder", filename);
        document.getElementById("note-file").setAttribute("placeholder", "File: "+file_name);  
      })
    }
  })
}
