function mainmenu(){
    $(" #nav ul ").css({display: "none"}); // Opera Fix
    $(" #nav li").hover(function()
            {
                $(this).find('ul:first').css({visibility: "visible",display: "none"}).show(400);
            //	if (document.all){$(document.getElementById("tabellaRicerca")).find('select').css({visibility: "hidden"})};
                if (document.all){$(document.getElementById("tabellaRicerca")).css({visibility: "hidden"})};
            },function(){
            $(this).find('ul:first').css({visibility: "hidden"});
            if (document.all){$(document.getElementById("tabellaRicerca")).css({visibility: "visible"})};
            
            });
    }
    
     
     
     $(document).ready(function(){					
        mainmenu();
    });