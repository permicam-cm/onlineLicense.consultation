function getXMLHttp(){
	var xmlHttp = false;
	try{
		//try to get request object for IE 5 or later
		xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	}catch(e){
		//get request object for earlier versions of IE.
		try{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}catch(e){

		}
	}

	if(!xmlHttp && typeof XMLHttpRequest !== 'undefined'){
		xmlHttp = new XMLHttpRequest();
	}

	return xmlHttp;
}

function doGet(url, idResultContener){
//	displayLoading(idResultContener);
    var xmlHttp     =   getXMLHttp();
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlHttp.onreadystatechange = function(){
      if(xmlHttp.status !== 200){
      	$("#"+idResultContener).html(xmlHttp.responseText);
          return;
      }
      if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
      //	$("#"+idResultContener).html(xmlHttp.responseText);
      document.getElementById(idResultContener).innerHTML = xmlHttp.responseText;
      }else{
    	  $("#"+idResultContener).html("ERROR 202");
      }
  };
  xmlHttp.send(null);
}



	
	
	
	

function doPost(url,formData,idResult) {
	let token =  $("meta[name='_csrf']").attr("content");
	let header = $("meta[name='_csrf_header']").attr("content");
	displayLoading(idResult);
    return new Promise(function (resolve, reject) {
        var xhr =  getXMLHttp();
        //xhr.setRequestHeader(header,token);
        xhr.onload = function (event) {
            resolve(xhr.responseText);
        };

        xhr.onerror = function (err) {
            reject(err);
        }

        xhr.open('POST', url, false);
        xhr.send(formData);
    });
}



var __PDF_DOC,
__CURRENT_PAGE,
__TOTAL_PAGES,
__PAGE_RENDERING_IN_PROGRESS = 0;



function showPDF(pdf_url,i) {
	if(i!= undefined)
		__CANVAS = document.getElementById('pdf-canvas-'+i);
	else
		__CANVAS = document.getElementById('pdf-canvas');
	__CANVAS_CTX = __CANVAS.getContext('2d');
	pdfjsLib.getDocument({ url: pdf_url }).then(function(pdf_doc) {
	__PDF_DOC = pdf_doc;
	__TOTAL_PAGES = __PDF_DOC.numPages;
	// Show the first page*
	showPage(1,i);
	}).catch(function(error) {

	alert(error.message);
	});

}


function showPage(page_no,i) {
	var canVasx=$("#pdf-canvas-"+i);
	if(i!= undefined)
		$("#pdf-canvas-"+i).hide();
	else
		$("#pdf-canvas").hide();
	// Fetch the page
	__PDF_DOC.getPage(page_no).then(function(page) {
		// As the canvas is of a fixed width we need to set the scale of the viewport accordingly

		var scale_required = canVasx.width / page.getViewport(1).width;
		// Get viewport of the page at required scale
		var viewport = page.getViewport(scale_required);

		// Set canvas height
		canVasx.height = viewport.height;
		var renderContext = {
		canvasContext: __CANVAS_CTX,
		viewport: viewport
		};
		// Render the page contents in the canvas
		page.render(renderContext).then(function() {
			//page has finished rendering or is not rendering at all
			__PAGE_RENDERING_IN_PROGRESS = 0;
			// Show the canvas and hide the page loader
			if(i!= undefined)
				$("#pdf-canvas-"+i).show();
			else
				$("#pdf-canvas").show();
		});
	});
}

function doget(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function (event) {
            resolve(xhr.responseText); // Si la requête réussit, on résout la promesse en indiquant le contenu du fichier
        };

        xhr.onerror = function (err) {
            reject(err); // Si la requête échoue, on rejette la promesse en envoyant les infos de l'erreur
        }

        xhr.open('GET', url, true);
        xhr.send(null);
    });
}
function dopost_promise(url, data) {
    return new Promise(function (resolve, reject) {
        var xhr =  getXMLHttp(); 
        xhr.onload = function (event) {
            resolve(xhr.responseText); 
        };

        xhr.onerror = function (err) {
            reject(err); 
        }
        
        xhr.open('POST', url, true);
        xhr.send(data);
    });
}
function dopost_promiseJson(url, data) {
    return new Promise(function (resolve, reject) {
        var xhr =  getXMLHttp(); 
        xhr.onload = function (event) {
            resolve(xhr.responseText); 
        };

        xhr.onerror = function (err) {
            reject(err); 
        }
        
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(data);
    });
}


function dopost_promiseMultiContent(url, data) {
    return new Promise(function (resolve, reject) {
        var xhr =  getXMLHttp(); 
        xhr.onload = function (event) {
            resolve(xhr.responseText); 
        };

        xhr.onerror = function (err) {
            reject(err); 
        }
        
        xhr.open('POST', url, true);
        //xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(data);
    });
}

 function displayLoading(){
    	$('#preloader-wrap').removeClass('loaded');
    }

    function removeLoading(){
    	$('#preloader-wrap').addClass('loaded');
    }

    function initDatePickers(){

       // alert("moise");
        $(".date-picker").each(function(e){
        //$("#dob").on('click', function(){
           $('.date-picker').datepicker({
                 todayBtn: "linked",
                 language: "it",
                 autoclose: true,
                 todayHighlight: true,
                 minDate: '01/01/1930',
                 maxDate : new Date(),
                 dateFormat: 'dd/mm/yy'
           });
        });
    }
    
    function closeFrame(fileCode, baseUrl){
    let sessionToken = sessionStorage.getItem("!@@@sessionToken-adwa");
    	let url =baseUrl+"/order/init/check-order-status?fileCode="+fileCode;
     if(fileCode==0){
      let message={token :btoa(sessionToken), data:null};
       window.parent.postMessage(message, "*");
     }
     else  
     {
      doget(url).then(response=>{
      
       let message={token : btoa(sessionToken), data:JSON.parse(response)};
       window.parent.postMessage(message, "*");
      });
     }
    }
    
    function resetIframe(url){
        let sessionToken = sessionStorage.getItem("!@@@sessionToken-adwa");
    	let baseUrl =url+"?sessionToken="+sessionToken;
    	window.location.replace(baseUrl);
    }


function openModal(){
	document.getElementById("overlay-preloader").style.display="block";	
}

function closeModal(){
	document.getElementById("overlay-preloader").style.display="none";	
}
