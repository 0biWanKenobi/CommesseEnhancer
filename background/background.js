var baseUrl = 'http://commesse.dp2000.it'
var baseUrlJs = `${baseUrl}/Commesse/script`
var baseUrlCss = `${baseUrl}/Commesse/include`


Object.defineProperty(String.prototype, "AsRedirectUrl", {
    value: function AsRedirectUrl(inlineJs) {       
        var newUrl = inlineJs != null
            ? `data:text/javascript,${encodeURIComponent(inlineJs)}` 
            : chrome.extension.getURL(this.toString());
        console.log(`Redirecting to ${newUrl}`)
        return  {redirectUrl: newUrl};
    },
    writable: true,
    configurable: true
});


chrome.webRequest.onBeforeRequest.addListener(
    
    function(details) {        
        switch (details.url) {
            case `${baseUrlJs}/jquery.min.js`:                
                return "/vendor/jquery/jquery-2.2.4.min.js".AsRedirectUrl()

            case `${baseUrlJs}/jquery-ui.min.js`:
                return "/vendor/jquery-ui/jquery-ui-1.12.1.min.js".AsRedirectUrl()

            case `${baseUrlCss}/jquery-ui.css`:
                return "/vendor/jquery-ui/jquery-ui-1.12.1.min.css".AsRedirectUrl()

            case `${baseUrlJs}/jquery.dynDateTime.js`:
                return "nothing".AsRedirectUrl("")

            case `${baseUrlJs}/calendar-en.js`:
                return "nothing".AsRedirectUrl("")

            case `${baseUrlJs}/menu.js`:
                return "src/inject/menu.js".AsRedirectUrl()

            case `${baseUrlCss}/base.css`:
                return "src/inject/base.css".AsRedirectUrl()
                
            case `${baseUrl}/favicon.ico`:
                return "http://commesse.dp2000.it/Commesse/img/favicon.ico".AsRedirectUrl()
            default:
                return details.url.AsRedirectUrl();
        }        
    },
    {urls: [`${baseUrlJs}/*.js`, `${baseUrlCss}/*.css`, `${baseUrl}/favicon.ico`]},
    ["blocking"]
);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){       
        sendResponse ( {text: "OK", success: true} );
    }
)

var userAccount = {}


const doRecoverAccount = async () => {
    userAccount = await  recoverAccount()
}

doRecoverAccount();



chrome.webRequest.onAuthRequired.addListener(
    function(details, callbackFn) {
        console.log("onAuthRequired!", details, callbackFn);
        console.log(userAccount)
        callbackFn({
            authCredentials: {username: userAccount.user, password: userAccount.password}
        });
    },
    {urls: ["<all_urls>"]},
    ['asyncBlocking']
);
