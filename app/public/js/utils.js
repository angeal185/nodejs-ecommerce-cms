
function initBaseTpl(){
  $('body').prepend(baseTpl())
}

function backToTop(i) {
  $("html,body").animate({
    scrollTop: i
  }, 200)
}

function initDisqus(data,){
  if (data.comments){

  } else  {
    console.log('comments disabled')
  }
}

function setTransition(i,e){
  backToTop(0)
  $(i).empty().addClass(e)
  setTimeout(function(){
    $(i).removeClass(e)
  },3000)
}

function convertDate(i){
  return new Date(i).toLocaleDateString()
}

function dedupe(arr) {
  return arr.reduce(function (p, c) {
    var id = [c.title,c.id,c.category,c.price,c.status,c.link].join('|');
    if (p.temp.indexOf(id) === -1) {
      p.out.push(c);
      p.temp.push(id);
    }
    return p;
  }, { temp: [], out: [] }).out;
}

function setCart(i){
  var storedData = localStorage.getItem("cartData");
  var newData = i;
  if (storedData) {
    var gotData = JSON.parse(storedData);
    newData = dedupe(_.concat(gotData, newData));
    localStorage.removeItem("cartData");
    localStorage.setItem("cartData",  JSON.stringify(newData));
    //console.log(JSON.stringify(i,0,2))
    $('.cartBadge').html(newData.length);
  } else {
    localStorage.setItem("cartData",  JSON.stringify(newData));
    $('.cartBadge').html('1');
  }
}

function cartBadgeInit(){
  var storedData = localStorage.getItem("cartData");
  if (storedData) {
    var gotData = JSON.parse(storedData);
    var x = gotData.length;
    $('.cartLnk').after(cartBadgeTpl({"no":JSON.stringify(x)}));
  } else {
    $('.cartLnk').after(cartBadgeTpl({"no":0}));
  }
}

function initCartList(){
  var storedData = localStorage.getItem("cartData");
  if (storedData) {
  var gotData = JSON.parse(storedData);
  $('#main-view').append(cartListTpl());
  _.forEach(["Title","Id","Category","Price","Status","Link","Buy",""],function(i){
    $('#listObj').append('<th>'+i+'</th>');
  })
  _.forEach(gotData,function(i){
    $('#listItems').append(cartItemTpl({
      "title":i.title,
      "id":i.id,
      "category":i.category,
      "price":i.price,
      "stat":i.status,
      "link":i.link
    }));
  })

  $('.cartDel').click(function() {
    var gotData = JSON.parse(storedData);
    console.log('working')
    var filtered = _.reject(gotData,{ 'id': this.id})
    console.log(JSON.stringify(filtered,0,2))
    localStorage.setItem("cartData",  JSON.stringify(filtered));
    $('.cartBadge').html(filtered.length);
    $(this).parents('tr').remove();
    page('/cart')
  });

  } else{
    $('#main-view').html('cart empty!');
  }
}



function latestItems(items){
  var x = _.clone(arr);
  $('#sidebar').append(latestItemsBase())
  _.forEach(_.sortBy(items, ['date']),function(i){
    x.push(i)
  });
  _.forEach(_.reverse(x.slice(arr.length - 3)),function(i){
    $('.latestItemsList').append(latestItemTpl({"img":i.imgSub,"title":i.title,"price":i.price,"src":i.title}))
  })

}

function bcrumbInit(){
  $('nav').after($(div).clone().addClass('bcrumb-list').append(bCrumb({"href":"/","title":"Home"}),bCrumb({"href":"#!","title":""})))
}

function bcrumbChange(i){
  var item = $('.breadcrumb').eq(1).html(i);
  if (item != i){
    item.css('display', 'inline-block');
  }
}

function  bcrumbHide(){
  $('.breadcrumb').eq(1).html('').css('display', 'none');
}

function empty(i){
  $('#main-view').empty();
}

function initItemSlider(data){
  $('#main-view').prepend(itemSliderTpl());
  _.forEach(data,function(i){
    $('.slides').append(itemSlideTpl({"img":i.img,"align":i.align,"title":i.title,"sub":i.sub}))
  })
  $('.slider').slider();
}

function itemSingle(data,res){
  var sect = ['itemTop','itemMid','itemBot']
  $('#main-view').append(itemTpl());

  _.forEach(sect,function(i){
    $(div).clone().appendTo('#itemDetail').addClass(i);
  })

  _.forEach(_.filter(data, {'title': res}),function(i){
    var lst = {
      id:i.id,
      title: i.title,
      subtitle:i.subTitle,
      description:i.description,
      date: convertDate(i.date)
    }

    $('#itemImg').append(itemImgTpl({"img":i.imgSub}),$(div).clone().addClass('row img-group'));
    _.forEach(i.imgList,function(item){
      $('.img-group').append(itemImgSmallTpl({"img":item}));
    })
    $('.itemTop').append(itemHeadTpl({"price":i.price,"title":i.title}));
    _.forIn(lst,function(x,e){
      $('.itemMid').append(itemDescTpl({"key":e,"val":x}))
    })
    $('.itemBot').append(itemFootTpl({"link":i.link}));
    $('#addCart').click(function() {
      setCart([{
        title:i.title,
        id:i.id,
        category:i.category,
        price: i.price,
        status: i.status,
        link: i.link
      }])
    });

  })
  $('.materialboxed').materialbox();

}

function itemSingleBlog(data,res){

  //$('#main-view').append(itemTpl());


  _.forEach(_.filter(data, {'title': res}),function(i){

    $('#main-view').append(blogItemTpl({
      "title":i.title,
      "sub":i.subTitle,
      "date":convertDate(i.date),
      "img":i.img,
      "content":i.content,
      "author":i.author
    }));

  })

}

function addItems(i){
  $('#itList').append(
    itemListTpl({
      "imgSub":i.imgSub,
      "title":i.title,
      "link":i.link,
      "description":i.description
    })
  );
}

function searchItems(data){
  $('#searchBtn').click(function() {
    var toSearch = $('#searchBox').val();
    if (toSearch === ''){
      console.log('search cannot be empty')
    } else {
      page('/search/' + toSearch);
    }

  });
  $('#searchBox').keydown(function(e) {
    if(e.keyCode == 13){
      $('#searchBtn').click()
    }
  });
}

function basePaginate(){
  _.forEach(['itList','holder'],function(i){
    $('#main-view').append('<div id="'+i+'"></div>');
  })
  $('#holder').addClass('pagination center col s12')
}

function itemPaginate(){
  $('#holder').jPages({
    containerID: 'itList',
    perPage: 8,
    startPage: 1,
    startRange: 1,
    midRange: 3,
    endRange: 1,
    first: false,
    last: false
  });
}

function itemList(data){
  basePaginate()
  _.forEach(data,function(i){
    addItems(i)
  })
  itemPaginate()
}

function initSidebar(data){
  searchBase();
  _.forIn(data,function(i,e){
    $('#sidebar').append(
      sidebarTpl({
        "id":e,
        "title":i
      })
    );
  })
}

function initFooter(a,b){
  $('#app').append(
    footerTpl({
      "text":a,
    })
  );
  _.forEach(b,function(i){
    $('.footerLinks').append(
      footerLinkTpl({
        "href":i.link,
        "text":i.title
      })
    );
  })
}

function addTags(e) {
  var tags = _.union(_.flattenDeep(_.map(e, "tags")));
  _.forEach(_.sortedUniq(tags), function(i) {
    $("#tagList").append(categorieTpl({
      e: "tag",
      i: i
    }))
  })
}

function addCategories(e) {
  var categories = _.union(_.map(e, "category"));
  _.forEach(_.sortBy(categories), function(i) {
    $("#catList").append(categorieTpl({
      e: "category",
      i: i
    }))
  })
}



function searchTag(data){
  $('.tag').click(function() {
    var toSearch = this.innerHTML;
    page('/tag/' + toSearch);
  });
}



function searchCat(data){
  $('.category').click(function() {
    var toSearch = this.innerHTML;
    page('/category/' + toSearch);

  });
}

function initGallery(data,res){
  $('#main-view').prepend(headerTpl({
    title:"Gallery"
  }))
  basePaginate();
  _.forEach(data,function(i){
    $('#itList').append(galleryItemTpl({
      "title":i.title,"text":i.description,
      "src":i.img
    }))
  })
  itemPaginate()
  $('.materialboxed').materialbox();
}

function initBlog(data){
  $('#main-view').prepend(headerTpl({
    title:"Blog"
  }))
  basePaginate();
  _.forEach(data,function(i){
    $('#itList').append(blogItemsTpl({
      "title":i.title,
      "sub":i.subTitle,
      "date":convertDate(i.date),
      "img":i.img,
      "content":i.content,
      "author":i.author
    }))
  })
  itemPaginate()
}

function searchBase(){
  $('#sidebar').append(searchBaseTpl())
}

function searchInit(res,data){
  $('#main-view').prepend(searchResTpl({title:res}))
  basePaginate()
  _.forEach(_.filter(data, {'title': res}),function(i){
    addItems(i)
  })
  itemPaginate()
}

function catInit(res,data){
  $('#main-view').prepend(searchResTpl({title:res}))
  basePaginate()
  _.forEach(_.filter(data, {'category': res}),function(i){
    addItems(i)
  })
  itemPaginate()
}

function tagInit(res,data){
  $('#main-view').prepend(searchResTpl({title:res}))

  basePaginate()
  _.forEach(_.filter(data, {'tags': [res]}),function(i){
    addItems(i)
  })
  itemPaginate()
}

function initNav(items){

  $('#app').prepend(navTpl({
    "title":"ecommerce"
  }));
  _.forIn(items,function(i,e){
    $('#nav-mobile').append(navLnk({
      "href":e,"title":i
    }))
  })
  $('#nav-mobile').prepend(navLnk({
    "href":"","title":"Store"
  }))
}
