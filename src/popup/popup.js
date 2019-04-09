(function () {
    $(function(){

        createAccountDom();      
        initClickHandlers();        
        recoverAccount();
        
    })
    
    
    function createAccountDom(){
        $userAccountHtml = $("#userAccount-form").html()
        $userAccount = $(`${$userAccountHtml}`);
        $("#userAccount-wrap").html($userAccount);
    }

    function initClickHandlers(){
        $("#saveAccount").on("click", saveAccount);
    }



    function saveAccount(){
    
        var formData = $("#userAccount").serializeArray();  
        var accountObj = {
            user: get(formData, "user"),
            password: get(formData, "password")
        };
        
        chrome.storage.local.set({userAccount: accountObj});
        alert("Account saved");
    }



    function get(form, optionName){
        var option = form.find(o => o.name == optionName);
        if(option != null)
            return option.value;
        return null;
    }
})()
