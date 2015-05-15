$(function(){

  $.get('/parts', appendToList ); 

  function appendToList(parts) {
    var list = [];
    for(var i in parts){
      var part = parts[i];
      var content = '<a href="/parts/'+part+'">'+part+'</a>';
      content = content + ' :: <a href="#" data-block="'+part+'">Delete</a>';
      list.push($('<li>', { html: content }));
    }
    $('.parts-list').append(list);
  }
  
  $('form').on('submit', function(event){
    event.preventDefault();
    var form = $(this);
    var blockData = form.serialize();
   
    $.ajax({
      type: 'POST', url: '/parts', data: blockData
      }).done(function(blockName){
        appendToList([blockName]);
        form.trigger('reset');
    });
  });
  
  $('.parts-list').on('click', 'a[data-block]', function(event){
    if(!confirm('Are you sure?')){
      return false;
    }
    
    var target = $(event.currentTarget);
    $.ajax({
      type: 'DELETE', url: '/parts/' + target.data('name')
    }).done(function(){
      target.parents('li').remove();
    });
  });
});