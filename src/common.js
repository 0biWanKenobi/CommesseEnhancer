async function recoverAccount() {
    
    var items = await getFromChromeStorage({userAccount: {}});
    console.log(items);
    if(isEmptyObj( items.userAccount )) return;
    $("#userName").attr("value", items.userAccount.user);
    $("#password").attr("value", items.userAccount.password);
    $("#userName").val(items.userAccount.user);
    $("#password").val(items.userAccount.password);
     
    return items.userAccount
}

function getFromChromeStorage(obj){
    var deferred = $.Deferred();
    chrome.storage.local.get(obj, function(result) {
       deferred.resolve(result);
    });
    return deferred.promise();    
}


function isEmptyObj(o){
    return JSON.stringify(o) === "{}";
}