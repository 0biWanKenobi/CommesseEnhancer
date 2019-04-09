function IsNaNAlert(hours) {
    if(hours === undefined) return true;
    if (isNaN(hours))	 {		
        alert("Il campo Totale Ore deve contenere valori numerici (es:5.5).");		
        hours.focus();		
        return false;	
    }
}


function SubmitHoursForm(formElement, submitUrl) {	
    $('#loader-container').attr('class', 'loader-container');
    $.ajax({				
        url: submitUrl				,
        data: formElement.serialize()				,
        method: 'POST'				,
        success: function() {		
            $('#loader-container').removeAttr('class');
            alert("Salvataggio riuscito");					
            //$.modal.close();					
            //location.reload();				
        }				,
        error: function() {					
            alert("Salvataggio fallito!!");				
        }	
    });
}


function CheckAggiunteNewForm(iframe, operationId) {
    console.log("check aggiunte new");
    var submitUrl = "inserisci_aggiunte_new.php?ope="+operationId;
    var form = iframe.contents().find('form');	
    var commessa = form.find('input[name=id_commessa]');
    if (commessa.val() == 0)	 {		
        alert("Valorizzare il campo commessa");		
        commessa.focus();		
        return false;		
    }	
    SubmitHoursForm(form, submitUrl);	
    return true;
}


function CheckExtraHoursForm(iframe) {	
    console.log("check extra hours");
    var hoursForm = iframe.contents().find('form');	
    var hours = hoursForm.find('input[name=ore]');	
    var extraHoursUrl = "/Commesse/modelview/worktime/inserisci_aggiunte_orarie.php";		
    if (IsNaNAlert(hours.val()))					 return;		
    SubmitHoursForm(hoursForm, extraHoursUrl);	
}

function CheckWorkingHoursForm(iframe) {		
    var workingHoursForm = iframe.contents().find('form');		
    var hours = workingHoursForm.find('input[name=ore]');	
    var activity = workingHoursForm.find('input[name=id_attivita_svolta]');	
    var commessa = workingHoursForm.find('input[name=id_commessa]');	
    var nota = workingHoursForm.find('input[name=nota]');	
    var conferma = iframe.get(0).contentWindow.conferma;	
    var workingHoursUrl = "/Commesse/modelview/worktime/inserisci_singola_commessa.php";	
    var replaceCurrentJob = iframe.contents().find("#replacecurrentJobCheckbox").is(':checked');
    
    if(!replaceCurrentJob){
        var newJob = iframe.contents().find('#id_commessa').val();
        iframe.contents().find('input[name=id_commessa_vecchia]').val(newJob);
    }
    
    if (IsNaNAlert(hours.val())) return;
    	
    else if (commessa.val() == 0)	 {		
        alert("Valorizzare il campo commessa");		
        commessa.focus();	        
    }						
    else if	 (hours.val() != '' && hours.val() != 0) {			
        if (activity.val() == 0) {				
            alert("Valorizzare il campo Attivita' Svolta.");				
            activity.focus();	
        }						
        else if (nota.val() == '') {				
            alert("Valorizzare il campo Descrizione Attivita'.");
        }						
        else if (replaceCurrentJob && conferma() == false) return;				
        SubmitHoursForm(workingHoursForm, workingHoursUrl);	
    }		
    else {			
        if (replaceCurrentJob && conferma() == false) return false;					
        hours.val(0);				
        SubmitHoursForm(workingHoursForm, workingHoursUrl);		
    }

}