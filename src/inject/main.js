console.log('loaded main script');
//salva commessa nascosta su localStorage
function setInLocaStorage(idCommessa, rowText) {
	if (!!localStorage.hiddenRows) {
		console.log("adding to existing localStorage");
		var hiddenRows = JSON.parse(localStorage.getItem("hiddenRows")) || [];
		if (!hiddenRows.includes(idCommessa)) {
			hiddenRows.push(idCommessa);
			localStorage.hiddenRows = JSON.stringify(hiddenRows);
			//add option to restore row in dropdown
			var option = $('<option value="' + idCommessa + '">' + rowText + '</option>');
			restoreRows.append(option[0]);
		}

	}
	else {
		console.log("adding to new localStorage");
		var hiddenRows = [];
		hiddenRows.push(idCommessa);
		localStorage.hiddenRows = JSON.stringify(hiddenRows);
		var option = $('<option value="' + idCommessa + '">' + rowText + '</option>');
		restoreRows.append(option[0]);
	}
}

function showRow() {
	var rowId = $('#restoreRows').val();
	$(".tbl").find('#'+CSS.escape(rowId)).parent().show();

	//remove from localStorage
	var hiddenRows = JSON.parse(localStorage.getItem("hiddenRows"));
	hiddenRows.splice(hiddenRows.indexOf(rowId), 1);
	localStorage.hiddenRows = JSON.stringify(hiddenRows);

	//remove from dropDown
	$('#restoreRows option[value="' + rowId + '"]').remove();
	$('#restoreRows option[selected="selected"]').removeAttr('selected');
	$('#restoreRows option[value="?"]').attr('selected', 'selected');

}
function getPastMonthUrl(id, giorno) {
	return "/Commesse/modelview/worktime/show_note.php?giorno=" + giorno + "&id_ora=" + id;
}
function showPastMonthModal(id, giorno) {
	modalUrl = getPastMonthUrl(id, giorno);

	var iframe = $('#iframeSetWorkingHours');
	iframe.attr('src', modalUrl);
	iframe.modal();
}


function replaceCalendarDaysHref(calendarDay) {
	if (calendarDay.attr('href').indexOf('show_note') < 0)
		return false;
	calendarDay.attr('href', calendarDay.attr('href').replace('show_note', 'showPastMonthModal'));
	return true;
}

function handleInsertClick(e){
	e.preventDefault()
	e.stopPropagation()
}


var isFormSubmitted = false;

function setupPopup(iframe){	

	var iframeContents = iframe.contents();
	
	iframeContents.find('#footer_back').remove();
	iframeContents.find('table').eq(0).remove();
	iframeContents.find('.Container_form').css("margin-top", "");
	var visibleDateInput = iframeContents.find('input[name=data]').eq(0).removeAttr('disabled');
	var hiddenDateInput = iframeContents.find(":input[name='data'][ type=hidden]");
	var dateCommessaInput = iframeContents.find(":input[name='data_commessa']");
	var listCommesse = iframeContents.find("#id_commessa option")

	var hiddenRows = JSON.parse(localStorage.getItem("hiddenRows")) || [];

	listCommesse.filter((i,opt )=> {
		var match = hiddenRows.indexOf($(opt).val()) >= 0
		if(	match )
			$(opt).remove();
		return match
	})

	
	var idOraOriginal = iframeContents.find(":input[name='id_ora']").val();
	var idNotaOriginal = iframeContents.find(":input[name='id_nota']").val();
	var idNotaBlobOriginal = iframeContents.find(":input[name='id_nota_blob']").val();
	var dateInputOriginal = hiddenDateInput.val();
	
	visibleDateInput.on('change', function(){
		hiddenDateInput.val(visibleDateInput.val());
		dateCommessaInput.val(visibleDateInput.val());
		
		if(hiddenDateInput.val() == dateInputOriginal){
			iframeContents.find(":input[name='id_ora']").val(idOraOriginal);
			iframeContents.find(":input[name='id_nota']").val(idNotaOriginal);
			iframeContents.find(":input[name='id_nota_blob']").val(idNotaBlobOriginal);		
		}		
		else{
			iframeContents.find(":input[name='id_ora']").val(0);
			iframeContents.find(":input[name='id_nota']").val(null);
			iframeContents.find(":input[name='id_nota_blob']").val(null);			
		}
	});

	var closeButton = iframe.contents().find('input[name=Chiudi]');
	if (!!closeButton.length) {
		closeButton.removeAttr('onclick');
		closeButton.on('click', function () {
			$.modal.close();
		});
	}
	
	iframe.contents().find('td[colspan=3]').eq(0).parent().after('<td colspan=3><input id="replacecurrentJobCheckbox" type="checkbox">Sostituisci commessa precedente</input></td>')

	var submitButton = iframe.contents().find('input[value=Inserisci]');

	var newButton = $("<input type=\"button\" value=\"Inserisci\" id=\"insert\"  class=\"button_\" />")
	submitButton.replaceWith(newButton)
	
	
	var isWorkingHoursLink = $('#iframeSetWorkingHours').attr('src').indexOf('inserimento') > 0;
	var isAggiunteNew = $('#iframeSetWorkingHours').attr('src').indexOf('aggiunte_new') > 0;
	if (isWorkingHoursLink)
		newButton.on( 'click',
			function (e) {
				handleInsertClick(e)
				isFormSubmitted = true;
				CheckWorkingHoursForm(iframe);
			});
	else if(isAggiunteNew)
		newButton.on( 'click',
			function(e) {
				handleInsertClick(e)
			   isFormSubmitted = true;
			   CheckAggiunteNewForm(iframe, 1)
			});
	
	else
		newButton.on( 'click',
			function (e) {
				handleInsertClick(e)
				isFormSubmitted = true;
				CheckExtraHoursForm(iframe);
			});

	modalWidth = 440;
	modalHeight = iframe.contents().find('body').prop('scrollHeight') + 10; // account for 5px padding
		
	iframe.attr({
		'width': modalWidth,
		'height': modalHeight
	});
}

function attachPopupToCalendarDays() {
	
	var iframe, modalDiv;
	var outerLocation = location;


	$.get(chrome.extension.getURL('/assets/saveWorkingHours.html'), (iframeHtml) => {
		console.log(`saveWorkingHours: ${iframeHtml}`)
		$('body').append($(iframeHtml));
		iframe = $('#iframeSetWorkingHours');
		modalDiv = $('#modalSetWorkingHours');
		isFormSubmitted = false;

		modalDiv.on('hidden.bs.modal', function(event, modal){
			if(!!isFormSubmitted)
			outerLocation.reload();
		})
	
		var modalWidth;
		var modalHeight;
	
	
		iframe.on('load', () =>{ setupPopup(iframe) } );
	
	
	
		$('.giorni').each(function (idx, el) {
	
			if (!replaceCalendarDaysHref($(el))) {
				$(el).on('click', function (e) {
					e.preventDefault();
					this.blur();
					
					
					iframe.attr('src', this.href);
					modalDiv.modal();
				});
			}
		});


	});





	

}

function getIdCommessa(el){
	var href = $(el).find('.TDstatino_fest a').eq(0).attr('href')
	if(typeof(href) == "undefined") return "-1"
	var start = href.indexOf('id_comm')
	var end = href.indexOf('&data')
	if(start>=0 && end > start){
		return href.substring(start,end).substring("id_commessa=".length)
	}
	return "-1"
}


$(function () {

	//prevent bootstrap css override
	var tableCommesse = $('.table').switchClass('table', 'tbl').addClass('visible').attr('width', '95%');

	//popup modale
	if (!$('#iframeSetWorkingHours').length && !window.parent.length)
		attachPopupToCalendarDays();

	//aggiunta nome commessa a tooltip giorno di lavoro
	$('.giorni').css('white-space', 'pre-line');
	$('.giorni').each(function (idx, el) {
		var tr = $(el).parent().parent();
		var tdObj = tr.find('.tdintestazioneleft, .tdintestbottom').eq(0);
		var tdText = tdObj.html();
		$(el).attr('title', $(el).attr('title') + '\n' + tdText);
	}
	);

	//dropdown per il ripristino delle commesse nascoste

	var hiddenRows = JSON.parse(localStorage.getItem("hiddenRows")) || [];

	var restoreRows = $('<select id="restoreRows"></select>');
	restoreRows.append('<option value="?" disabled="disabled" selected="selected">Mostra commessa</option>');
	restoreRows.css({
		"margin": "10px auto",
		"display": "block",
		"padding": "2px"
	});


	//nascondi commesse secondo impostazioni salvate in localstorage
	tableCommesse.find('tr').each(function (idx, el) {
		var newCol = $('<td class="hiderow"></td>');


		var firstTd = $(el).find('td').eq(0);
		var firstTdClass = firstTd.attr('class');
		
		var firstTdContent = firstTd.html();
		var idCommessa = 0;		

		if (firstTdClass === 'TDintestazioneleft' && firstTdContent !== 'Totale' && firstTdContent !== 'Straordinari') {
			idCommessa = getIdCommessa(el)
			firstTd.attr('id', idCommessa);
			newCol.on('click', function () {
				$(el).hide();
				setInLocaStorage(idCommessa, firstTdContent);
			});
			newCol.append($('<input type="button" class="hideButton" value="Nascondi"/>'));
		}

		if (idx > 1 && (firstTdClass === 'TDintestazioneleft' || firstTdClass === 'TDintestbottom'))
			firstTd.before(newCol[0]);

		//if (hiddenRows.includes(firstTdContent)) {
		if (hiddenRows.includes(idCommessa)) {
			$(el).hide();
			var option = $('<option value="' + idCommessa + '">' + firstTdContent + '</option>');
			restoreRows.append(option);

		}
	});

	tableCommesse.eq(0).before(restoreRows[0]);
	$("#restoreRows").on('change', showRow);

	var colspan = $.grep(
		tableCommesse.find('tr'), function (row, index) {
			return index < 2;
		});

	$(colspan).each(function (idx, el) {
		$(el).find('td').eq(0).attr('colspan', '2');
	});


});