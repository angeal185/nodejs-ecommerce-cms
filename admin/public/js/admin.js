const socket = io.connect();

var itemListTpl = _.template('<div class="card"><div class="card-content"><div class="row"><div class="card-title col s10">{{title}}</div><div class=" col s2"><i class="material-icons toPull right">dehaze</i></div></div><button type="button" class="btn showBtn">view</button><button type="button" class="btn deleteBtn right">delete</button><div class="itemsGroup"></div></div></div>'),
itemsListTpl = _.template('<label>{{label}}</label><input class="form-control {{cls}}" type="text" value="{{val}}">')

function init(nav,){
  addNav(nav)
  scrollTop('body')
}

function addNav(nav){
  $('body').prepend(navTpl({"title":title}))
  _.forEach(nav,function(i){
    $('#nav-mobile').append(navLnk({"href":i,"title":i}))
  })
}


function sortInit(){
  var container = document.getElementById("sortIt");
  var sort = Sortable.create(container, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    handle: ".toPull", // Restricts sort start click/touch to the specified element
    draggable: ".card", // Specifies which items inside the element should be sortable
    onUpdate: function (evt/**Event*/){
      // var item = evt.item; // the current dragged HTMLElement
    }
  });
}

function changeTitle(){
  $('.title').off();
  $('.title').keyup(function() {
    $(this).parents('.card-content').find($('.card-title')).html(this.value)
  });

}

function inputToTextarea(){
  if (title === 'items'){
    $('input.description').replaceWith('<textarea class="form-control description"></textarea>');
  } else if (title === 'blog'){
    $('input.content').replaceWith('<textarea class="form-control content"></textarea>');
  }
}

function createItems(items){
  _.forEach(items,function(item,index){

    $('.itemsDiv').append(itemListTpl({"title":item.title}))
    _.forIn(item,function(i,e){
      $('.itemsGroup').eq(index)
        .append(itemsListTpl({"label":_.startCase(e),"cls":e,"val":i}))
    })
    inputToTextarea();
  })
  if (title != 'gallery'){
    $(".id,.date").attr('disabled','true');
  }
}

function deleteItem(){
  $('.deleteBtn').off();
  $('.deleteBtn').click(function(event) {
    $(this).parents('.card').remove()
  });
}

function showItem(){
  $('.showBtn').off();
  $('.showBtn').click(function(event) {
    $(this).siblings('.itemsGroup').toggle();
  });
}

function addItem(items){
  $('#addItem').click(function(event) {

    $('.itemsDiv').append(itemListTpl({"title":""}))
    _.forIn(items,function(i,e){
      $('.itemsGroup:last').append(itemsListTpl({"label":_.startCase(e),"cls":e,"val":""}))
    })

    if ((title === 'items') || (title === 'blog')){
      if (title === 'items'){
        $(".id:last").attr('disabled','true').val($(".id").length);
      }
      $(".date:last").attr('disabled','true').val(Date.now());
    }
    inputToTextarea()
    showItem()
    deleteItem()
    changeTitle();
  });
}

function updateInfo(){
  $('#updateBtn').click(function() {
    var out = _.clone(arr)
    $( ".itemsGroup" ).each(function(i, el) {
      if (title === 'items'){
        out.push({
        "id":$(el).find($('.id')).val(),
        "title":$(el).find($('.title')).val(),
        "subTitle":$(el).find($('.subTitle')).val(),
        "price":parseInt($(el).find($('.price')).val()),
        "category":$(el).find($('.category')).val(),
        "tags":_.words($(el).find($('.tags')).val(), /[^, ]+/g),
        "description":$(el).find($('.description')).val(),
        "link":$(el).find($('.link')).val(),
        "date":$(el).find($('.date')).val(),
        "imgMain":$(el).find($('.imgMain')).val(),
        "imgSub":$(el).find($('.imgSub')).val(),
        "imgList":_.words($(el).find($('.imgList')).val(), /[^, ]+/g),
        "status":$(el).find($('.status')).val()
      })
    } else if (title === 'gallery'){
      out.push({
      "img":$(el).find($('.img')).val(),
      "title":$(el).find($('.title')).val(),
      "description":$(el).find($('.description')).val()
      })
    } else if (title === 'blog'){
      out.push({
        "title":$(el).find($('.title')).val(),
        "subTitle":$(el).find($('.subTitle')).val(),
        "author":$(el).find($('.author')).val(),
        "img":$(el).find($('.img')).val(),
        "date":$(el).find($('.date')).val(),
        "description":$(el).find($('.description')).val()
      })
    }
    });
    //console.log(out)
    socket.emit('updateItems', {
      data: out,
      type: title
    });
  });
}

function bcrumbInit(){
  $('nav').after(
    $(div)
      .clone()
      .addClass('bcrumb-list')
      .append(
        bCrumb({
        "href":"/",
        "title":"Dashboard"
      }),bCrumb({
        "href":"#!",
        "title":title
      }))
  );
  if (title != 'dash'){
    $('.breadcrumb').eq(1).css('display', 'inline-block');
  }
  //bCrumb({"href":"#!","title":""})
}

function initItems(i,e){
  sortInit()
  createItems(i)
  deleteItem()
  showItem()
  updateInfo()
  addItem(e)
  changeTitle()
}



socket.on('success', function(i){
  console.log(i)
  showtoast(i)
});

socket.on('reload', function(i){
  location.reload
});
