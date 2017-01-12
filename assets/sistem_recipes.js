$(document).ready(function() {

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // if login
  }
  else{
    window.location.href='index.html';
  }
});

var module_name       = "recipes";
var btn_create_recipes  = "<button id='crete_recipes' class='btn btn-primary'> Create Recipes </button>";
var btn_back          = "<button class=\"btn btn-info\" id=\"module_recipes\" >BACK</button>";

//DEFAULT
$("#title_page").text("List Recipes");
$("#title_small_page").text("List Recipes");
$("#title_page_breadcrumb").text("List Recipes");
$("#title_page_h3").html(btn_create_recipes);

//show hide
global_show_and_hide();


list_recipes();
setTimeout(function(){
    $('body').addClass('loaded'); 
}, 3000); //hide loader after 3000 ms (3s)


/**MODULE recipes**/
//list recipes
$(document).on('click','#module_recipes',function(){
  $('body').removeClass('loaded');   
  
  //Text explaination
  $("#title_page").text("List Recipes");
  $("#title_small_page").text("all list recipes");
  $("#title_page_breadcrumb").text("List recipes");
  $("#title_page_h3").html(btn_create_recipes);

  //show hide data 
  global_show_and_hide();

  //show data
  list_recipes();
  setTimeout(function(){
      $('body').addClass('loaded'); 
  }, 3000); //hide loader after 3000 ms (3s)
});

//detail recipes
$(document).on('click','#detail_recipes',function(){
  //Text explaination
  $("#title_page").text("Detail recipes");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Detail recipes");

  var id_db = $(this).data('key');

  //show hide data 
  global_show_and_hide();

  detail_recipes(id_db);
});


//input recipes
$(document).on('click','#crete_recipes',function(){
  var do_db_recipes = "<button id='do_db_recipes' class='btn btn-primary'>Submit</button>";

  //Text explaination
  $("#title_page").text("Input recipes");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Input recipes");
  $("#title_page_h3").html("<div class='text-right'></div>");

  //show hide data 
  global_show_and_hide();

    //make select option for category
    list_category(0);
  $('#html_form_list').show();

});


//edit recipes
$(document).on('click','#edit_recipes',function(){
  var do_db_recipes = "<button id='do_db_recipes' class='btn btn-primary'>Edit</button>";
  //Text explaination
  $("#title_page").text("Edit recipes");
  $("#title_small_page").text("");
  $("#title_page_breadcrumb").text("Edit recipes");
  $("#title_page_h3").html("<div class='text-right'></div>");

  //show hide data 
  global_show_and_hide();
  $('#html_form_list').show();

  var id_db = $(this).data('key');

  var db = firebase.database().ref().child(module_name).child(id_db);
  db.on('value', function(data) {
      var image = (data.val().image_url == 0) ? "images/default.png" : data.val().image_url;

      $("#key").val(data.key);
      $("#nama_recipes").val(data.val().nama_recipes);
      $("#cooking_time").val(data.val().cooking_time);
      CKEDITOR.instances["description"].setData(data.val().description);
      $("#foto").val(data.val().image);
      $("#foto_url").val(data.val().image_url);
      $('#image').attr('src',image);
      list_category(data.val().category);
  });


});

//function show list category
function list_recipes()
{

    //show list recipes
    $('#html_recipes_list').show();
    var html_recipes_list = $('#html_recipes_list');
    html_recipes_list.empty();
    html_recipes_list.append('<table class="table table-bordered table-hover" id="mytable"><thead><tr><th>No.</th><th>Image</th><th>Category</th><th>Recipes Name</th><th>Cooking Time</th><th class="text-right">Action</th></tr></thead><tbody id="datarecipes"></tbody></table>')

    //wait after html recipes list finish
    setTimeout(function(){
      var datarecipes = $('#datarecipes');
      datarecipes.empty();
      var db = firebase.database().ref().child(module_name);
      db.on('value', function(data) {
          i = 1;
          data.forEach(function(data) {

            var isi = '<tr><td>'+ i++  +'</td><td><img id="sh_image'+i+'" alt="waiting..." width="200px"></td><td>'+data.val().category+'</td><td>'+data.val().nama_recipes+'</td><td>'+data.val().cooking_time+'</td><td class="text-right"><button class="btn btn-info" id="edit_recipes" data-key="'+data.key+'"><span class="fa fa-pencil"></span></button><button class="btn btn-danger" id="delete_recipes" data-key="'+data.key+'" ><span class="fa fa-trash"></span></button></td></tr>';
            datarecipes.append(isi);

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

//function show list category in option
function list_category(id_category_sebelumnya)
{
    var datacategory = $('#option_category');
    datacategory.empty();

    datacategory.append('<select id="category" class="form-control"><option value="0"> Choose the Category </option>');
    select_category = $('#category');
    var list_option = "";
    var db = firebase.database().ref().child('category');
    db.on('value', function(data) {
        i = 1;
        data.forEach(function(data) {
          
          if(id_category_sebelumnya == data.val().nama_category)
          {
            var isi='<option value="'+data.val().nama_category+'" selected>'+data.val().nama_category+'</option>';
          }
          else
          {
            var isi='<option value="'+data.val().nama_category+'">'+data.val().nama_category+'</option>';
          }

          select_category.append(isi);
        });
    });
    
    datacategory.append('</select>');

    $('#option_category').fadeIn(1000);
}

//show detail recipes
function detail_recipes(key)
{
    var db = firebase.database().ref().child(module_name).child(key);
    db.on('value', function(data) {

      var head              = "<div class='text-right'>"+btn_back+"</div><br>";
      var img_name          = data.val().image;
      var image             = "<img class=\"img-thumbnail img-responsive center\" style=\"margin:10px; max-width: 80%\"  src=\""+data.val().image+"\"><br>";

      $('#html_recipes_detail').append(head);
      // $('#html_recipes_detail').append(data.val().nama_recipes);
      $('#html_recipes_detail').append(image);

      $("#title_page_h3").text(data.val().nama_recipes);
    });

}

//GLOBAL SHOW AND HIDE
function global_show_and_hide()
{
  //show and hide
  $('#html_recipes_list').hide();
  $('#html_recipes_detail').empty();
  $('#html_form_list').hide();

  //reset form
  $("#nama_recipes").val("");
  $("#cooking_time").val("");
  $("#foto").val(0);
  $("#foto_url").val(0);
  $("#foto_button").val("");
  $('#image').attr('src',"images/default.png");
  $("#description").val("");

  //alert
  $("#alert").attr('class', '');
  $("#alert").hide();

  //progress bar
  $("#uploader").hide();
}

/**
  BUTTON ACTION
          **/
//PROSES INPUT dan Delete recipes
$(document).on('click','#do_db_recipes',function(){

    //disable_alert
    $("#alert_nama_recipes").html();
    $("#alert_file").html();

    //get_value
    var key             = $("#key").val();
    var nama_recipes    = $("#nama_recipes").val();
    var cooking_time    = $("#cooking_time").val();
    var category        = $("#category").val();
    var foto            = $("#foto").val();
    var foto_url        = $("#foto_url").val();
    var description     = CKEDITOR.instances["description"].getData();
    // var foto        = "https://firebasestorage.googleapis.com/v0/b/dilo-recipes.appspot.com/o/images%2"+foto1+"?alt=media";

    //Validation
    if(nama_recipes.length == 0){
      $("#alert_nama_recipes").html("put your recipes name here");
      $("#nama_recipes").focus();
    }
    else if(cooking_time.length == 0){
      $("#alert_cooking_time").html("put how long the dish cooked here");
      $("#tanggal").focus();
    }
    else if(category == 0){
      $("#alert_category").html("choose category recipes");
      $("#waktu").focus();
    }
    else{

        //for  Input
        if(key == 0)
        {
            var dbRef = firebase.database().ref(module_name);
            dbRef.push({
              nama_recipes: nama_recipes,
              cooking_time:cooking_time,
              category:category,
              description:description,
              image: foto,
              image_url: foto_url,
            });

            $("#alert").addClass('alert alert-success');
            $("#alert").html("New Recipe Added Successfully");
            $("#alert").show();
        }
        else  //for  Edit
        {
            var dbRef = firebase.database().ref(module_name+"/"+key);

            dbRef.update({
              nama_recipes: nama_recipes,
              cooking_time:cooking_time,
              category:category,
              description:description,
              image: foto,
              image_url: foto_url,
            });

            $("#alert").addClass('alert alert-success');
            $("#alert").html("New Recipe Edited Successfully");
            $("#alert").show();
        }

      //IF Success
        $('body').removeClass('loaded');

        //Text explaination
        $("#title_page").text("List Recipes");
        $("#title_small_page").text("all list recipes");
        $("#title_page_breadcrumb").text("List recipes");
        $("#title_page_h3").html(btn_create_recipes);
 
       //show hide data 
        $('#html_form_list').hide();

        //show data
        list_recipes();
        setTimeout(function(){
              $('body').addClass('loaded');
        }, 3000); //hide loader after 3000 ms (3s)
    }
    //end

});

//DELETE recipes
$(document).on('click','#delete_recipes',function(){
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
    $("#alert").html("Recipes Deleted Successfully");
    $("#alert").show();


    list_recipes();
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
