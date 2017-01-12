$(document).ready(function() {

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // if login
  }
  else{
    window.location.href='index.html';
  }
});

var module_name       = "category";
var btn_create_category  = "<button id='crete_category' class='btn btn-primary'> Create Category </button>";
var btn_back          = "<button class=\"btn btn-info\" id=\"module_category\" >BACK</button>";

//DEFAULT
$("#title_page").text("List Category");
$("#title_small_page").text("List Category");
$("#title_page_breadcrumb").text("List Category");
$("#title_page_h3").html(btn_create_category);

//show hide
global_show_and_hide();


list_category();
setTimeout(function(){
    $('body').addClass('loaded');
}, 3000); //hide loader after 3000 ms (3s)


/**MODULE category**/
//list category
$(document).on('click','#module_category',function(){
  $('body').removeClass('loaded');   
  
  //Text explaination
  $("#title_page").text("List Category");
  $("#title_small_page").text("all list category");
  $("#title_page_breadcrumb").text("List category");
  $("#title_page_h3").html(btn_create_category);

  //show hide data 
  global_show_and_hide();

  //show data
  list_category();
  setTimeout(function(){
      $('body').addClass('loaded'); 
  }, 3000); //hide loader after 3000 ms (3s)
});

//detail category
$(document).on('click','#detail_category',function(){
  //Text explaination
  $("#title_page").text("Detail category");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Detail category");

  var id_db = $(this).data('key');

  //show hide data 
  global_show_and_hide();

  detail_category(id_db);
});


//input category
$(document).on('click','#crete_category',function(){
  var do_db_category = "<button id='do_db_category' class='btn btn-primary'>Submit</button>";

  //Text explaination
  $("#title_page").text("Input category");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Input category");
  $("#title_page_h3").html("<div class='text-right'></div>");

  //show hide data 
  global_show_and_hide();

  //make select option for category
  $('#html_form_list').show();

});


//edit category
$(document).on('click','#edit_category',function(){
  var do_db_category = "<button id='do_db_category' class='btn btn-primary'>Edit</button>";
  //Text keterangan
  $("#title_page").text("Edit Category");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Edit Category");
  $("#title_page_h3").html("<div class='text-right'></div>");

  //show hide data
  global_show_and_hide();
  $('#html_form_list').show();

  var id_db = $(this).data('key');

  var db = firebase.database().ref().child(module_name).child(id_db);
  db.on('value', function(data) {
      var image = (data.val().image_url == 0) ? "images/default.png" : data.val().image_url;

      $("#key").val(data.key);
      $("#nama_category").val(data.val().nama_category);
      $("#foto").val(data.val().image);
      $("#foto_url").val(data.val().image_url);
      $('#image').attr('src',image);
  });


});

//function show list category
function list_category()
{

    //show list category
    $('#html_category_list').show();
    var html_category_list = $('#html_category_list');
    html_category_list.empty();
    html_category_list.append('<table class="table table-bordered table-hover" id="mytable"><thead><tr><th>No.</th><th>Image</th><th>Name</th><th class="text-right">Action</th></tr></thead><tbody id="datacategory"></tbody></table>')

    //wait after html category list finish
    setTimeout(function(){
      var datacategory = $('#datacategory');
      datacategory.empty();
      var db = firebase.database().ref().child(module_name);
      db.on('value', function(data) {
          i = 1;
          data.forEach(function(data) {

            var isi='<tr><td>'+ i++  +'</td><td><img id="sh_image'+i+'" alt="waiting..." width="200px" ></td><td>'+data.val().nama_category+'</td><td class="text-right"><button class="btn btn-info" id="edit_category" data-key="'+data.key+'"><span class="fa fa-pencil"></span></button><button class="btn btn-danger" id="delete_category" data-key="'+data.key+'" ><span class="fa fa-trash"></span></button></td></tr>';               
            datacategory.append(isi);

          });
      });
    }, 500); //get data after 500 ms (0.5 s)

    //Show Images
    setTimeout(function(){
      var db = firebase.database().ref().child(module_name);
      db.on('value', function(data) {
          i = 2;
          data.forEach(function(data) {
              var image = (data.val().image_url == 0) ? "images/default.png" : data.val().image_url;
              $('#sh_image'+i).attr('src', image);
              i++;
          });
      });
    }, 2500); //show image after 2500 ms (2.5s)
    

    setTimeout(function(){
       $('#mytable').dataTable({
        "pageLength": 5,
        "bPaginate": true,
        "bLengthChange": true,
        "aLengthMenu": [ 5, 10, 20, 50, 100 ],
        "bFilter": true,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": false,
        "sEmptyTable": "",
      }).fnPageChange('first' );
    }, 3000); //go to first page data Table

}

//show detail category
function detail_category(key)
{
    var db = firebase.database().ref().child(module_name).child(key);
    db.on('value', function(data) {

      var head              = "<div class='text-right'>"+btn_back+"</div><br>";
      var img_name          = data.val().image;
      var image             = "<img class=\"img-thumbnail img-responsive center\" style=\"margin:10px; max-width: 80%\"  src=\""+data.val().image+"\"><br>";

      $('#html_category_detail').append(head);
      $('#html_category_detail').append(data.val().nama_category);
      $('#html_category_detail').append(image);

      $("#title_page_h3").text(data.val().nama_category);
    });

}

//GLOBAL SHOW AND HIDE
function global_show_and_hide()
{
  //show and hide
  $('#html_category_list').hide();
  $('#html_category_detail').empty();
  $('#html_form_list').hide();

  //reset form
  $("#nama_category").val("");
  $("#foto").val(0);
  $("#foto_url").val(0);
  $("#foto_button").val("");
  $('#image').attr('src',"images/default.png");

  //alert
  $("#alert").attr('class', '');
  $("#alert").hide();

  //progress bar
  $("#uploader").hide();
}

/**
  BUTTON ACTION
          **/
//PROSES INPUT dan Delete category
$(document).on('click','#do_db_category',function(){

    //disable_alert
    $("#alert_nama_category").html();
    $("#alert_file").html();

    //get_values
    var key            = $("#key").val();
    var nama_category  = $("#nama_category").val();
    var foto           = $("#foto").val();
    var foto_url        = $("#foto_url").val();
    // var foto        = "https://firebasestorage.googleapis.com/v0/b/dilo-category.appspot.com/o/images%2"+foto1+"?alt=media";

    //Validasi
    if(nama_category.length == 0){
      $("#alert_nama_category").html("put category name here");
      $("#nama_category").focus();
      return false();
    }
    else
    {
        //for  Input
        if(key == 0)
        {
            var dbRef = firebase.database().ref(module_name);
            dbRef.push({
                  nama_category: nama_category,
                  image: foto,
                  image_url: foto_url,
            });

            $("#alert").addClass('alert alert-success');
            $("#alert").html("New Category Added Successfully");
            $("#alert").show();
        }
        else  //for  Edit
        {
            var dbRef = firebase.database().ref(module_name+"/"+key);

            dbRef.update({
                nama_category: nama_category,
                image: foto,
                image_url: foto_url,
            });

            $("#alert").addClass('alert alert-success');
            $("#alert").html("Category Edited Successfully");
            $("#alert").show();
        }


      //IF Success
        $('body').removeClass('loaded');

        //Text keterangan
        $("#title_page").text("List Category");
        $("#title_small_page").text("all list category");
        $("#title_page_breadcrumb").text("List category");
        $("#title_page_h3").html(btn_create_category);

        //show hide data
        $('#html_form_list').hide();

        //show data
        list_category();
        setTimeout(function(){
              $('body').addClass('loaded');
        }, 3000); //hide loader after 3000 ms (3s)
    }
    //end

});

//DELETE category
$(document).on('click','#delete_category',function(){
  $('body').removeClass('loaded');

  var confirm1 = confirm('Are you sure you want to delete this item?');
  if (confirm1) {
    var id_db = $(this).data('key');
    
    //detele file if exist
    var db = firebase.database().ref().child(module_name).child(id_db);
    db.on('value', function(data) {
      var img_name  = data.val().image;
      if(img_name != "")
      {
          delete_file(img_name);
      }
    });

    //delete the data
    var db = firebase.database().ref(module_name).child(id_db);
    db.remove();

    //alert
    $("#alert").attr('class', '');
    $("#alert").hide();

    $("#alert").addClass('alert alert-danger');
    $("#alert").html("Category Deleted Successfully");
    $("#alert").show();

    list_category();
    setTimeout(function(){
        $('body').addClass('loaded');
    }, 3000); //hide loader after 3000 ms (3s)

  } else {
    // alert('false');
  }

});

// PROSES LOGOUT
$(document).on('click','#do_logout',function(){

  firebase.auth().signOut().then(function() {
     console.log("Logged out!");
  }, function(error) {
     console.log(error.code);
     console.log(error.message);
  });

});
/**
    BUTTON
            **/

/**
  UPLOAD
          **/
          //get elements
var btn_foto        = document.getElementById("foto_button");
var progress_upload = document.getElementById("uploader");

// listen for file selection
btn_foto.addEventListener('change', function(e)
{
  var foto_val = $("#foto").val();
  //if old file exist, delete file first
  if(foto_val != 0)
  {
      delete_file(foto_val);
  }

  $("#uploader").show();

  // Get file
  var file = e.target.files[0];
  // Create e storage ref
  var storageRef = firebase.storage().ref('images/'+file.name);
  // Upload file
  var task = storageRef.put(file);
  
  //Upadate progress bar
  task.on('state_changed',
    function progress(snapshot){
      //make progress
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
    },
    function error(err)
    {
      //if error
    },
    function complete()
    { //if complete
        var get_url_name =  task.snapshot.downloadURL;
        $('#image').attr('src',get_url_name);
        $("#foto").val(file.name);
        $("#foto_url").val(get_url_name);
    }

  );

});

function delete_file(img_name)
{
  var desertRef = firebase.storage().ref().child('images/'+img_name);
  // Delete Old file
  desertRef.delete().then(function() {
    // Old File deleted successfully
  }).catch(function(error) {
    // Uh-oh, an error occurred!
  });
}
/**
  END UPLOAD
          **/

//SEARCH GAGAL
// var key = "-KWUG3p068X4LVQVN_at";
// var rootRef = firebase.database().ref();
// var query  = rootRef.child('user').orderByChild('email').equalTo('cakra.ds@gmail.com');
// query.on("child_added", function(data) {
//    console.log("Equal to filter: " + data.val().nama);
// });

// var playersRef = firebase.database().ref("user/");
//
// playersRef.orderByChild("email").equalTo("cakra.ds@gmail.com").on("child_added", function(data) {
//    console.log("Equal to filter: " + data.val().email);
// });

});
