$(document).ready(function () {

    // Which page am I on?
    if (document.URL.includes("saved")) {
      // if on saved page, only pull saved articles
      $.get('/api/saved', function (data, status) {
        // if response is empty [], then do nothing
        // otherwise send data to be printed to dom
        if (data.length === 0) {
          // Do nothing
          console.log('The database is empty');
        } else {
          // print articles with comment option and 'delete from saved articles'
          printSavedPosts(data);
          // Preparing on click for Save button DOM element
          noteSaveBtnDom();
        }
      });
    } else {
      // if on home page, pull all articles
      // AJAX call to server to get data
      $.get('/api/data', function (data, status) {
        // if response is empty [], then do nothing
        // otherwise send data to be printed to dom
        if (data.length === 0) {
          // Do nothing
          console.log('The database is empty');
        } else {
          printPosts(data);
        }
      });
    }
  
  
  
  
  });
  
  
  
  
  // function that takes an object with link and title properties and prints to the dom as an article post
  // print articles with only 'save article' option
  function printPosts(article) {
    // This functiont takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article panel
    for (let i = 0; i < article.length; i++) {
      let panel;
      // if saved property is true, do not print saved button
      if (article[i].saved) {
        panel = $(
          [
            "<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            "<a class='article-link' target='_blank' href='" + article[i].link + "'>",
            article[i].title,
            "</a>",
            "<span class='glyphicon glyphicon-ok saved'>Saved</span>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article[i].title,
            "</div>",
            "</div>"
          ].join("")
        );
      } else {
        panel = $(
          [
            "<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            "<a class='article-link' target='_blank' href='" + article[i].link + "'>",
            article[i].title,
            "</a>",
            "<span class='btnSave save'>",
            "<a class='btn btn-success save'>",
            "Save Article",
            "</a>",
            "</span>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article[i].title,
            "</div>",
            "</div>"
          ].join("")
        );
      }
  
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to save
      panel.data("_id", article[i]._id);
      // We return the constructed panel jQuery element
      $('.main-articles').append(panel);
  
    }
  
    // Active DOM For elements just created;
    // activate saved & save
    // activateDOM();
    saveBtnDom();
  
  };
  
  // print articles with comment option and 'delete from saved articles'
  function printSavedPosts(data) {
    // Creating Post HTML and Appending it to page for every object in the parameter Object
    for (let i = 0; i < data.length; i++) {
      // This functiont takes in a single JSON object for an article/headline
      // It constructs a jQuery element containing all of the formatted HTML for the
      // article panel
      let panel = $(
        [
          "<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
          "<a class='article-link' target='_blank' href='" + data[i].link + "'>",
          data[i].title,
          "</a>",
          "<span class='delete'>",
          "<a class='btn btn-danger'>",
          "Delete From Saved",
          "</a>",
          "</span>",
          "<span class='notes'>",
          "<a class='btn btn-info btnNotes notes'>Article Notes</a>",
          "</span>",
          "</h3>",
          "</div>",
          "<div class='panel-body'>",
          data[i].title,
          "</div>",
          "</div>"
        ].join("")
      );
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to remove or open notes for      
      panel.data("_id", data[i]._id);
      // We return the constructed panel jQuery element
      $('.main-articles').append(panel);
  
  
    }
    // Active DOM For elements just created;
    // activateDOM();
    deleteBtnDom();
    notesBtnDom();
  };
  
  // Function to print notes to the modal
  function printNotes(data, articleID) {
    // Emptying Modal if it has been used previously
    $('.note-container').empty();
    // $('.modal-body').empty();
    $('#article_id').text('');
    // Declaring variable to use when pushing DOM elements
    let noteData;
    // Assigning articleid to the page for reference
    $('#article_id').text(articleID);
    // do something unique if data is empty
    if (data.length === 0) {
  
      // print basic line saying no data
      noteData = $(
        [
          "<li class='list-group-item'>There are no comments for this article yet.</li>"
        ].join("")
      );
      // Appending Note Data, in this case it's empty
      $('.note-container').append(noteData);
    } else {
      // loop to go through the data object and print each comment to the modal. with unique specifying butons to delete
      for (let i = 0; i < data.length; i++) {
  
        // Create notedata for each data item.
        noteData = $(
          [
            "<li class='list-group-item'>",
            data[i].comment,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        // Giving noteData .data for comment id for easy reference
        noteData.data('_id', data[i]._id);
        // Appending Note Data
        $('.note-container').append(noteData);
  
      }
    }
  
    // Active DOM For elements just created;
    // activateDOM();
    noteDeleteBtnDom();
    // Launches Modal
    $('#myModalSaved').modal();
  };
  
  // AJAX call to scrape data from the server
  // On click for the "Get News" button
  $('#scrape-button').on('click', function () {
  
    // GET AJAX call
    $.get('/api/scrape');
  
    // activate modal, then refresh page after 3 seconds to activate the data to the page
    setTimeout(() => {
      location.reload();
    }, 3000);
    // turns modal on
    $('#myModal').modal();
  })
  
  
  function saveBtnDom() {
    // On click function for .save buttons to change to a checkmark when saved
    $('.btnSave').on('click', function () {
      // $(this).html("<span class='glyphicon glyphicon-ok saved'>Saved</span>");
      // This changes the button to a glyphicon showing checked
      $(this).attr('class', 'glyphicon glyphicon-ok saved');
      $(this).text('Saved');
  
      // On click function for saved button that will send ajax call to server stating the id has been 'saved'
      // get article id from data of the button
      let articleID = $(this).parents(".panel").data("_id");
      // ajax call saving article by article
      // put jquery call needs to be updated
      // $.put('/api/saved/' + articleID);
      $.post('/api/saved/' + articleID)
        .done(function (msg) {
          console.log('article updated');
  
        })
        .fail(function (xhr, status, error) {
          postError(xhr);
        });
      console.log($(this).parents(".panel").data("_id"));
    })
  }
  
  function deleteBtnDom() {
    // On click function for .delete buttons to change to a checkmark when deleted
    $('.delete').on('click', function () {
      // This changes the button to a glyphicon showing checked
      $(this).attr('class', 'glyphicon glyphicon-ok deleted');
      $(this).text('Deleted');
  
      // On click function for deleted button that will send ajax call to server stating the id has been 'deleted'
      // get article id from data of the button
      let articleID = $(this).parents(".panel").data("_id");
      // ajax call saving article by article
      // put jquery call needs to be updated
      // $.put('/api/saved/' + articleID);
      $.post('/api/unsaved/' + articleID)
        .done(function (msg) {
          // postSuccess();
          console.log('article updated');
  
        })
        .fail(function (xhr, status, error) {
          postError(xhr);
        });
    })
  }
  
  function notesBtnDom() {
    // On click function for .notes buttons to launch modal and populate with notes data
    $('.btnNotes').on('click', function () {
  
      // get article id from data of the button
      let articleID = $(this).parents(".panel").data("_id");
      // Sending article id to function to handle the dirty work
      notesModal(articleID);
    });
  }
  
  function noteDeleteBtnDom() {
      // On click function for Note Delete button
      $('.note-delete').on('click', function () {
  
        // get comment id from data of the button
        let commentID = $(this).parents("li").data("_id");
        $.ajax({
          url: '/api/deletecomment/' + commentID,
          type: 'DELETE',
          success: function (result) {
            console.log('successfully deleted comment');
            // Refreshes the notes on the modal
            notesModal($('#article_id').text());
          }
        });
      });
  }
  
  function noteSaveBtnDom() {
      // On click function for the Save button in the Modal
      $('.noteSave').on('click', function () {
  
        // Declaring object to send to server
        let noteObject = {
          comment: '',
          article: ''
        }
        // Capture article ID
        noteObject.article = $('#article_id').text();
        // Capture text of the note
        noteObject.comment = $('textarea').val().trim();
    
        // Send data to server through AJAX for the new comment
        $.post('/api/addcomment/', noteObject)
          .done(function (msg) {
            console.log('Note Added');
            // Refreshes the notes on the modal
            notesModal($('#article_id').text());
          })
          .fail(function (xhr, status, error) {
            console.log(xhr);
          });
  
          // Empties the text area so as to avoid duplicate notes
          $('textarea').val('');
      });
  }
  
  
  // Function for printing notes to the modal
  function notesModal(articleID) {
    // ajax call getting saved notes data
    $.get("/api/comments/" + articleID, function (data, status) {
      // send object of data to function to be printed to the modal
      printNotes(data, articleID);
  
    });
  }