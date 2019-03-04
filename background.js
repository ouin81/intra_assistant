'use strict';

jQuery(document).ready(function(){

  //メンバー
  function split( val ) {
    return val.split( /,\s*/ );
  }
  function extractLast( term ) {
    return split( term ).pop();
  }

  function removeLabelAndUnselect(obj){
    var lbl = $(this);
    var ltxt = lbl.text().trim();
    memberSel.children("option:selected").each(function(){
      var op = $(this);
      if(ltxt == op.text().trim()) {
        op.prop("selected", false);
      }
    });

    lbl.remove();
  }
  
  function createMemberLabel(text) {
    var iconPath = chrome.extension.getURL("jquery-ui-1.12.1.custom/images/ui-icons_444444_256x240.png");
    return $("<label class='head'>" + text + "<span class='ui-icon ui-icon-circle-close' style='background-image: url(" + iconPath + ");'></span></label>");
  }

  function createMemberLabelAndBindEvent(text) {
    var l = createMemberLabel(text);
    l.on("click", removeLabelAndUnselect);
    searchTxt.before(l);
  }

  var memberSel = $("select[name='member[]']").hide();
  var searchTxt = $("<input placeholder='社員名／社員番号を入力する'>");
  var containerDiv = $("<div>");
  var showMemberChk = $("<span class='head'><input id='memberChk' class='memberChk' type='checkbox'/><label for='memberChk'></label></span>").on("click", 'input', function(){
    memberSel.toggle();
  });
  
  
  memberSel.before(containerDiv.append(searchTxt));
  memberSel.children("option:selected").each(function(){
    createMemberLabelAndBindEvent($(this).text().trim());
  });
  searchTxt.after(showMemberChk);

  var memberLst = [];
  memberSel.children("option").each(function(){
    memberLst.push($(this).text().trim());
  });

  memberSel.on("click", "option", function(){
    containerDiv.find("label.head").remove();
    memberSel.find("option:selected").each(function(){
      createMemberLabelAndBindEvent($(this).text().trim());
    });
  });

  searchTxt.autocomplete({
    source: memberLst,
    source: function( request, response ) {
      response( $.ui.autocomplete.filter(
        memberLst, extractLast( request.term ) ) );
    },
    select: function( event, ui ) {
      memberSel.children("option").each(function(){
        var op = $(this);
        var selected = op.prop("selected");
        if(ui.item.value == op.text().trim()) {
          op.prop("selected", !selected);
          if(!selected) {
            createMemberLabelAndBindEvent(ui.item.value);
          } else {
            containerDiv.find("label.head").each(function(){
              if($(this).text().trim() == ui.item.value) {
                $(this).remove();
              }
            });
          }
        }
      });
      searchTxt.val("");
      return false;
    }
  });

  //時刻
  var starthour = $("select[name='start_hour']");
  var startmin = $("select[name='start_min']");
  var endhour = $("select[name='end_hour']");
  var endmin = $("select[name='end_min']");
  var hyphen = "--";
  
  starthour.on("change", function(params) {
    if(startmin.val() == hyphen) {
      startmin.val("0");
    }
    if(this.value != hyphen) {
      endhour.val(parseInt(this.value) + 1);
      endmin.val("0");
    } else {
      startmin.val(hyphen);
      endhour.val(hyphen);
      endmin.val(hyphen);
    }
  });

});

