function init_row_toggle()
{
	$(".row_toggle").click(function(){
		if ($(".row_toggle_container:animated").length == 0)
		{
			if ($(this).hasClass("open"))
			{
				$(this).removeClass("open");
				$(this).next(".row_toggle_container").slideUp();
			//	$(this).next(".row_toggle_container").hide();
			}
			else
			{
				var _parent = $(this).closest('.only_one');
				if (_parent.length > 0)
				{
					
					$('.row_toggle',_parent).removeClass("open");
					$('.row_toggle_container',_parent).slideUp();
				//	$('.row_toggle_container',_parent).hide();
					
				}
				
				$(this).addClass("open");
				$(this).next(".row_toggle_container").slideDown();
			//	$(this).next(".row_toggle_container").show();
			}
		}
	});
	$(".row_toggle.open").each(function(){
		$(this).next(".row_toggle_container").slideDown();
	});

}

function initFancy()
{

	$(".fancybox-gallery").fancybox(
	{
		theme : 'light',
		helpers : { thumbs : true },
		openEffect  : 'fade',
		closeEffect : 'fade',
		nextEffect  : 'fade',
		prevEffect  : 'fade',
		'showNavArrows' :   true
	});

//	$(".popup").click( function()
	$(document).on("click",".popup",function(){
		var form_id = $(this).attr('href');

		var title = $(this).data('title');
		var subject = $(this).data('subject');
		var form_name = $(this).data('form');
		var btn_text = $(this).data('btn');

		$(".popup_container .form_title").html(title);

		$.fancybox.open( $(form_id).html(),
		{
			padding: 0,
			content: $(form_id).html(),
		//	modal: true,
			scrolling: "no",
			margin: 5,
			/*closeBtn: false,*/
			afterShow: function()
			{
			
			
				$(".popup_container input[name='subject']").val(subject);
				$(".popup_container input[name='Форма']").val(form_name);			
				$(".popup_container button span").text(btn_text);			
			
				$("input[name=Телефон]").inputmask("+7(999) 999-99-99");			
				
			}
		} );
		return false;
	});
}//end_ func


function initForm()
{

	$("input[name=Телефон]").inputmask("+7(999) 999-99-99");

	$( "body" ).on( "submit", "form", function()
	{
		if ($(this).hasClass("not_agree")) return false;

		var l_form_object = $(this);
		$("input,textarea,select",this).closest(".form-group").removeClass("has-danger");
		var l_err = false;
		$(".nacc",this).each( function()
		{
			if ( $(this)[0].tagName=="SELECT" || $(this)[0].tagName=="INPUT" )
			{
				if ( $.trim($(this).val())=="" )
				{
					l_err = true;
					$(this).closest(".form-group").addClass("has-danger");
				}//end_ if
			}//end_ if
		} );

		if ( l_err==true )
		{
			alert("В одном или нескольких полях введены неверные данные");
			return false;
		}//end_ if

		
		_form_title = $("input[name='title']",this).val();
		_form_comment = $("input[name='comment']",this).val();
		_form_name = $("input[name='form_name']",this).val();
		_form_type_model_name = $("input[name='form_type_model_name']",this).val();
		_form_diler = $("input[name='form_diler']",this).val();

		var _form = this;


		var l_hash = "8cfeaf5c6baa746972dc720c3ac80214";
		var l_host = "http://suzuki-samara.ru/";
		var l_phone = $(this).find("input[name=Телефон]").val();

		if ( ("-="+l_phone).indexOf("_")>0 )
		{
			alert("Заполните поле Телефон");
			return false;
		}

		if ( typeof(CallKeeper)!="undefined" )
		{
			var l_callkeeper_url = '//api.callkeeper.ru/formReceiver?isSend&widgetHash='+l_hash+'&phone='+l_phone+'&backUrl='+l_host+'&cookiesBasket='+CallKeeper.f.justCookies();
			$.post( l_callkeeper_url, $(this).serialize()+"&form="+this.id+"&form_title="+_form_title, function( data )
			{
			});
			console.log( "[callkeeper working]" );
			console.log( l_callkeeper_url );
		}else
		{
			//var cookiesBasket = '&cookiesBasket=current:::typ=utm|||src=actioncall|||mdm=cpc|||cmp=lpnoscript|||cnt=(none)|||trm=(none)^#^#.';
			var cookiesBasket = '&cookiesBasket=' + encodeURIComponent('current:::typ=utm|||src=actioncall|||mdm=cpc|||cmp=lpnoscript|||cnt=(none)|||trm=(none)^#^#session:::cpg='+l_host+'^#^#');
			var l_callkeeper_url = '//api.callkeeper.ru/formReceiver?isSend&widgetHash='+l_hash+'&phone='+l_phone+'&backUrl='+l_host+cookiesBasket;
			$.post( l_callkeeper_url, $(this).serialize()+"&form="+this.id+"&form_title="+_form_title, function( data )
			{
			});
			_form_title = _form_title + " [callkeeper default utm]";
			console.log( "[callkeeper static utm]" );
			console.log( l_callkeeper_url );
		}//end_ if

		if ( typeof(window.yaCounter52650682)!="undefined" ) {
			if ( typeof(window.ym)!="undefined" ) {
				ym(52650682,'reachGoal','lead');
				console.log( "[ym ok]" );
			} else {
				yaCounter52650682.reachGoal('lead');
				console.log( "[yaCounter ok]" );
			}
		}
		
		$.post( "mail.php", $(this).serialize(), function( data )
		{
		console.log(data);
			
			$(_form).trigger('reset');
			$('input[name=files]',_form).val('');
			$('.uploader_text',_form).css('display','inline-block');
			$('.uploader_images_count',_form).hide();
			alert("Сообщение успешно отправлено");
			$.fancybox.close();
		});

		return false;
	} );
}//end_ func





function init_topmenu()
{
	$('.btn_menu').click(function(){
		if ($(this).hasClass('open'))
		{
			$(this).removeClass('open');
		}
		else
		{
			$(this).addClass('open');
		}
	});
	$(document).mousedown(function(event){if ($(event.target).closest('.menu_container').length == 0 && !$(event.target).hasClass('btn_menu')) {$('.btn_menu').removeClass('open');}});



}
function anchor_click()
{
	$('.anchor[href^="#"]').click(function(){
		var _shift = 0;
		if ($(this).attr('_shift') != undefined) _shift = $(this).attr('_shift');
		
		var el = $(this).attr('href');
		var _pos = $(el).offset().top - $("body").offset().top - _shift;
		
		$("html,body").animate({ scrollTop: _pos }, 500);
		return false; 
	});
	
	$('.anchor2[href^="#"]').click(function(){
	
		var _model = $(this).attr("_model");
		if ($('#filter_table select[name=models]').length > 0)
			$("#filter_table select[name=models] option[value='"+_model+"']").prop("selected",true).change();
	
		var _shift = 0;
		if ($(this).attr('_shift') != undefined) _shift = $(this).attr('_shift');
		
		var el = $(this).attr('href');
		var _pos = $(el).offset().top - $("body").offset().top;
		$("html,body").animate({ scrollTop: _pos }, 500);
		return false; 
	});
}

function init_resp_table()
{
	var i = 1;
	$('.resp_table').each(function(){
		$(this).addClass('resp_table'+i);
		var _add_style = "";
		var j = 1;
		$('th',this).each(function(){
			var _text = $(this).html();
			_text = _text.replace("<br>"," ");
			_text = _text.replace("<br/>"," ");
			_text = _text.replace("</br>"," ");
			_text = _text.replace("/r","");
			_text = _text.replace(/\r|\n/g, '')
			_text = _text.replace(/<\/?[^>]+>/g,'');
			_text = _text.replace(/\s{2,}/g, ' ');
			if (_text != "") _add_style += ".resp_table"+i+ " tr td:nth-child("+j+"):before {content:'"+_text+"'}";
			j++;
		});
		$(this).after("<style>"+_add_style+"</style>");
		
		i++;
	});
}
function refresh_table()
{
	var curWidth = $(window).width();
	if (curWidth < 700) {
		$('.resp_table').each(function(){
		});
	}
	else
	{
	}
}
function init_agree()
{
	$(document).on("change","input[name='agree']",function(){
		var _form = $(this).closest('form');
		if ($("input[name='agree']:not(:checked)",_form).length == 0)
			$(_form).removeClass("not_agree");
		else
			$(_form).addClass("not_agree");
		
	});
	$(document).on( "click","form.not_agree input[type='submit'],form.not_agree button[type='submit'],form.not_agree a.submit",function(){
		var _form = $(this).closest('form');
		if ($(_form).hasClass('not_agree')) return false;
	});

	$(document).on( "submit","form",function(){
		if ($(this).hasClass('not_agree')) return false;
	});

	
	
	$( "body" ).on('change','.agree',function()
	{
		var _form = $(this).closest('form');
		if ($('.agree:not(:checked)',_form).length == 0)
			$(_form).removeClass("not_agree");
		else
			$(_form).addClass("not_agree");
		
	});

	$( "body" ).on( "submit", "form", function(){
		if ($(this).hasClass("not_agree")) return false;
	});

}

function _init_tabs()
{
	$('.tabs_control > li a').click(function(){
		$('.tabs_control > li a').removeClass("current");
		$(this).addClass("current");
		var _parent = $(this).closest(".tabs_control");
		var _target = $(_parent).attr("data-target");
		var _index = $(this).closest("li").index();
		console.log("#"+_target+" > li:eq("+_index+")");
		$("#"+_target+" > li").removeClass("current");
		$("#"+_target+" > li:eq("+_index+")").addClass("current");
		return false;
	});
}


function initHighLightText()
{
	window.highlight_scrolled_elements = $(".title1_container .title1 b i, .cars_items > li .car_title b");

	isScrolledIntoView = function(elem)
	{
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();
	
	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();
	
	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	scrollFunction = function() 
	{
		$(window.highlight_scrolled_elements).each( function()
		{
			if ( isScrolledIntoView(this) )
			{
				$(this).addClass("show");
			}else
			{
				$(this).removeClass("show");
			}
		} );
	}
	$(window).resize( function()
	{
		scrollFunction();
	} );
	$(window).scroll( function()
	{
		scrollFunction();
	} );
	scrollFunction();
}//end_ func






$( function() {

	init_agree();
	anchor_click();
	init_topmenu();
	initFancy();
	initForm();
	init_resp_table();
	init_row_toggle();
	_init_tabs();
	
	AOS.init({
		// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
		offset: 80, // offset (in px) from the original trigger point
		delay: 0, // values from 0 to 3000, with step 50ms
		duration: 300, // values from 0 to 3000, with step 50ms
		easing: 'linear', // default easing for AOS animations
		once: false, // whether animation should happen only once - while scrolling down
		mirror: true, // whether elements should animate out while scrolling past them
		anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
	});
	initHighLightText();

	$('.disclamer_switch').click(function () {
		$('.disclamer').slideToggle({
			start: function () {
				$("html, body").animate({scrollTop: $("html, body").height()}, "slow");
			}
		});
		return false;
	});

	// ТАЙМЕР

	$('#Dtimer').eTimer({
		etType: 1, 
		etDate: "28.10.2020.0.0",
		etTitleText: "", 
		etTitleSize: 10, 
		etShowSign: 1, 
		etSep: ":", 
		etFontFamily: "inherit", 
		etTextColor: "black", 
		etPaddingTB: 0, 
		etPaddingLR: 0, 
		etBackground: "transparent", 
		etBorderSize: 0, 
		etBorderRadius: 0, 
		etBorderColor: "transparent", 
		etShadow: "inset 0px 0px 0px 0px transparent", 
		etLastUnit: 4, 
		etNumberFontFamily: "inherit", 
		etNumberSize: 59, 
		etNumberColor: "black", 
		etNumberPaddingTB: 0, 
		etNumberPaddingLR: 0, 
		etNumberBackground: "inherit", 
		etNumberBorderSize: 0, 
		etNumberBorderRadius: 0, 
		etNumberBorderColor: "transparent", 
		etNumberShadow: "inset 0px 0px 0px 0px transparent"
	});

	function echo_date(date) {
		var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
		echo_date = function(date) {
			date = new Date(date);
			return {
				"date": date,
				"month": months[date.getMonth()],
				"day_num": date.getDate()
			};
		}
		return echo_date(date);
	};
	var myDate = echo_date(Date.now() + 120 * 60 * 60 * 1000);

	// ВЫвод даты +5 дней
	$('.cars_items li').each(function(){
		$(this).find('#myDate').html(myDate.day_num);
		$(this).find('#myMonth').html(myDate.month);
	});

});

