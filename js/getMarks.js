// Parameters
var debugTxt = false; // debug text
var debugImg = false; // debug img
var displayMarksOnConsole = true; // display marks on console

// Credentials
var login = "yourENTlogin"
var password = "yourENTpassword"

// Urls
var login_url = "https://cas.univ-bpclermont.fr/cas/login?service=http://ent.univ-bpclermont.fr/Login";
var mydirectory_url = "https://ent.univ-bpclermont.fr/render.userLayoutRootNode.uP?uP_root=u8l1n28&uP_sparam=activeTab&activeTab=3";
var logout_url = "http://ent.univ-bpclermont.fr/logout/glogout.jsp";

// Functions
function info(strOut) {
    if(debugTxt) {
        console.log("[INFO] " + strOut);
    }
}

function error(strErr) {
    console.log("[ERROR] " + strErr);
    // exit with error code
    phantom.exit(2);
}

// open Homepage
info("Starting...");
var page = require('webpage').create();
 
// on each successful loading
var i=0;
page.onLoadFinished = function(status) {
    i++;
    if(debugImg) {
        page.render(i+"-page.png");
    }
    info('Finish loading : ' + status + ' (capture '+i+"-page.png)");
};

// -- STARTING PROCESS
 
// Open login page
page.open(login_url, function(status) {
    info('Openning Homepage...');
    if (status === "success") {
        info("Homepage loaded!");
   
        // insert LOGIN/PASSWORD and SUBMIT        
        page.evaluate(function(login, password) {
            document.getElementById("username").value = login;
            document.getElementById("password").value = password;
            document.querySelector("input.input-submit").click();
        }, login, password);

        info("Logging in...");
    } else {
        error("Homepage not loaded!");
    }
});
 
// Move to "Mon dossier" then go to tab "Notes et resultats"
window.setTimeout(function() {
    info('Moving to tab "Mon dossier"...');
    page.open(mydirectory_url, function(status) {
            if (status === "success") {
                info('Moving to "Notes et resultats"...');
                page.evaluate(function() {
                    document.getElementById("formMenu:linknotes1").click();
                });
            } else {
                error('Cannot move to "Notes et resultats"...');
            }
        }
    )
}
, 5000);
 
// Move to ZZ3 marks
window.setTimeout(
    function() {
        info("Moving to ZZ3 marks...");
        var isOkay = page.evaluate(function() {
            var linkToMarks = document.querySelector('table.portlet-table tbody a');
            if(linkToMarks == null) {return false;}
            linkToMarks.click();
            return true;
        });

        // check
        if(!isOkay) { error('A problem appears when moving to ZZ3 marks');}
    }
, 8000);
 
// Get marks then disconnect
window.setTimeout(function() {
 
    // get and display marks
    if(displayMarksOnConsole) {
        var marks = page.evaluate(function() {
            var marks_table = document.querySelector("table.portlet-table");
            if(marks_table == null){return "ERROR";}
            return marks_table.innerText;
        });
        console.log(marks);
    }
 
    // clean disconnect
    info("Disconnecting...");
    page.open(logout_url, function(status) {
            if (status === "success") {           
                info("Well disconnected!");
            } else {
                error("Cannot disconnect...");
            }

            // Exit without problem
            phantom.exit(0);
        }
    )
}
, 10000);

window.setTimeout(function(){
   error("Timeout... Auto exit js script");
}
, 20000);
