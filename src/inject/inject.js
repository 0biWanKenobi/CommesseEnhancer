var injectAndRun = function(actualCode){                
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();    
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("Commesse Enhancer initializing");
            // ----------------------------------------------------------

                
            
            
                       
            // var actualCode = `main();`;
            
            // injectAndRun(actualCode);   
            
        }
	}, 10);
});
