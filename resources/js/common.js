function initFancy()
{
	$(document).on("click",".popup",function(){
		var form_id = $(this).attr('href');

		var title = $(this).data('title');
		var subject = $(this).data('subject');
		var form_name = $(this).data('form');
		var btn_text = $(this).data('btn');

		$(".popup_container .form_title").html(title);
		$(".popup_container input[name='subject']").val(subject);
		$(".popup_container input[name='Форма']").val(form_name);			
		$(".popup_container button span").text(btn_text);

		$.fancybox.open(
		{
			padding: 0,
			src: form_id,
		//	modal: true,
			scrolling: "no",
			margin: 5,
			/*closeBtn: false,*/
			afterShow: function()
			{			
				$("input[name=Телефон]").inputmask("+7(999) 999-99-99");					
			}
		} );
		return false;
	});
}//end_ func

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
	initFancy();	
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

	$("input[name=Телефон]").inputmask("+7(999) 999-99-99");

	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);

		var l_phone = th.find("input[name=Телефон]").val();

		// Phone Validation
		if ( ("-="+l_phone).indexOf("_")>0 ) {
			swal({
				title: "Номер телефона",
				text: "Номер телефона введен некорректно. Заполните поле без 8 в виде: +7 (999) 999-99-99",
				icon: "info",
				buttons: {
					cancel: "Хорошо",
				},
			});
			return false;
		}

		var btnSubmit = th.find('button[type="submit"]');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize() +'&referer=' + replUrl
		}).done(function( data ) {
			// console.log( "success data:", data );
			if(data != "")
				setTimeout(function() {
					$.fancybox.close();
					try {
						res = JSON.parse(data);
					} catch(e) {
						res = "";
					}
					if(res.answer == 'ok'){
						th.trigger("reset");
						swal({
							title: "Спасибо!",
							text: "Ваше сообщение успешно отправлено.\nВ скором времени мы с Вами свяжемся.",
							icon: "success",
							button: "Хорошо",
						// timer: 3000
					});
					}else{
						swal({
							title: "Ошибка :(",
							text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова. Или позвоните нам.",
							icon: "error",
							buttons: {
								cancel: "Хорошо",
								catch: {
									text: "Позвонить",
									value: "call",
								},
							},
						})
						.then((value) => {
							switch (value) {

								case "call":
								location.href = "tel:+78469777779";
								break;

								default:
							}
						});
					}
					btnSubmit.removeAttr("disabled");
				}, 100);
		}).fail(function() {
			setTimeout(function() {
				$.fancybox.close();
				swal({
					title: "Ошибка :(",
					text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова. Или позвоните нам.",
					icon: "error",
					buttons: {
						cancel: "Хорошо",
						catch: {
							text: "Позвонить",
							value: "call",
						},
					},
				})
				.then((value) => {
					switch (value) {

						case "call":
						location.href = "tel:+78469777779";
						break;

						default:
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 100);
		});
		return false;
	});

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

