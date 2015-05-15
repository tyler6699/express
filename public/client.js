$(function(){

  $.get('/users', appendToList ); 

  function appendToList(users) {
    var list = [];
    for(var i in users){
      var user = users[i];
      var content = '<a href="/users/'+user+'">'+user+'</a>';
      content = content + ' :: <a href="#" data-block="'+user+'">Delete</a>';
      list.push($('<li>', { html: content }));
    }
    $('.users-list').append(list);
  }
  
  $('form').on('submit', function(event){
    event.preventDefault();
    var form = $(this);
    var blockData = form.serialize();
   
    $.ajax({
      type: 'POST', url: '/users', data: blockData
      }).done(function(userName){
        appendToList([userName]);
        form.trigger('reset');
    });
  });
  
  $('.users-list').on('click', 'a[data-block]', function(event){
    if(!confirm('Are you sure?')){
      return false;
    }
    
    var target = $(event.currentTarget);
    $.ajax({
      type: 'DELETE', url: '/users/' + target.data('name')
    }).done(function(){
      target.parents('li').remove();
    });
  });
});