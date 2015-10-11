function ActionData(ev) {
    ev.preventDefault();
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "";
    }
    var URIobs=ev.dataTransfer.getData("Text");
    console.log("URIobs: ", URIobs);
    var endpoint = "http://localhost:8890/sparql";

    // in the cube also ?D2RQPropertyBridge on the ?dimvalue - eg also on the individual codelist value
    // This would make the identification of D2RQ-PropertyBridge for factor much simpler ...
    
    // get the parts needed for building a SPARQL query for retrievning the data
    var rqquery= [
	"prefix qb: <http://purl.org/linked-data/cube#> ",
	"prefix rrdfqbcrnd0: <http://www.example.org/rrdfqbcrnd0/> ",
	"  select ?obs ?codelist ?dimvalue ?propdim ?D2RQPropertyBridgeContVar ?D2RQPropertyBridge ?rrdfqbcrnd0Rcolumnname ?Rselectionoperator ?Rselectionvalue",
	"where {",
	"       ?obs ?propdim ?dimvalue .",
	"  ?propdim a qb:DimensionProperty .",
	"  ?propdim qb:codeList ?codelist .",
	"  optional { ?dimvalue rrdfqbcrnd0:R-selectionoperator ?Rselectionoperator } . ",
	"  optional { ?dimvalue rrdfqbcrnd0:D2RQ-PropertyBridge ?D2RQPropertyBridgeContVar . }",
	"  optional { ?dimvalue rrdfqbcrnd0:R-selectionvalue  ?Rselectionvalue . } ",
	"  optional { ?codelist rrdfqbcrnd0:codeType ?rrdfqbcrnd0codeType . }",
	"  optional { ?codelist rrdfqbcrnd0:R-columnname ?rrdfqbcrnd0Rcolumnname . }",
	"  optional { ?obs qb:dataSet ?qbdataSet .",
        "              ?qbdataSet rrdfqbcrnd0:D2RQ-DataSetName ?D2RQdsname .",
        "              ?codelist  rrdfqbcrnd0:DataSetRefD2RQ ?reference .",
        "              ?reference rrdfqbcrnd0:D2RQ-DataSetName ?D2RQdsname .",
        "              ?reference rrdfqbcrnd0:D2RQ-PropertyBridge ?D2RQPropertyBridge . }",
	"  optional { ?obs qb:dataSet ?qbdataSet .",
        "              ?qbdataSet rrdfqbcrnd0:D2RQ-DataSetName ?D2RQdsname .",
        "              ?dimvalue rrdfqbcrnd0:DataSetRefD2RQ ?reference .",
        "              ?reference rrdfqbcrnd0:D2RQ-DataSetName ?D2RQdsname .",
        "              ?reference rrdfqbcrnd0:D2RQ-PropertyBridge ?D2RQPropertyBridgeContVar . }",
	"values ( ?obs ) {",
	"(<"+URIobs+">)",
	"}",
	"}",
    ].join("\n")			       
    ;
    console.log("SPARQL query "+rqquery );

    function queryData( data ) {
	var numberOfCrit= data.results.bindings.length+1;


	//  Where Rselectionoperator is == and not 	    
	// ?rrdfqbcrnd0Rcolumnname != 'procedure' && ?rrdfqbcrnd0Rcolumnname != 'factor'",
	//      "	   && ?Rselectionoperator = '==' 	
	//  ?record  D2RQPropertyBridge  Rselectionvalue .
	// When ?rrdfqbcrnd0Rcolumnname == 'factor'" use the R-selectionvalue for variable name,
	// change to uppercase - and match on D2RQPropertyBridge
	var rqquerylines= [ 
	    "prefix qb: <http://purl.org/linked-data/cube#> ",
	    "prefix rrdfqbcrnd0: <http://www.example.org/rrdfqbcrnd0/> ",
	    "select * where {",
        ];

	// issue: code list binding to more than one D2RQPropertyBridge - as SAFFL appears in both ADAE and ADSL
	// solution: make an approach where the underlying dataset is also refered to ...
	// issue: ADSL_PROPORTION should not exist
	var rqqueryvaluesdef=["values", "(" ];
	var rqqueryvaluespart=[ "{", "(" ];
	var rqquerylinesatend= [ " "];
	for (var i = 0; i < data.results.bindings.length; i++ ){
	    var rrdfqbcrnd0Rcolumnname= data.results.bindings[i]["rrdfqbcrnd0Rcolumnname"].value;
	    console.log (rrdfqbcrnd0Rcolumnname );
	    console.log (data.results.bindings[i]["Rselectionoperator"] );
	    if (rrdfqbcrnd0Rcolumnname != 'procedure' &
		rrdfqbcrnd0Rcolumnname != 'factor' 
		 ) {
		var vn="?" +rrdfqbcrnd0Rcolumnname;
		rqquerylines.push(" ?record "+ "<"+data.results.bindings[i]["D2RQPropertyBridge"].value+">" + " " +
				  vn + " ." );
	    }
	    if (rrdfqbcrnd0Rcolumnname != 'procedure' &&
		rrdfqbcrnd0Rcolumnname != 'factor' &&
		data.results.bindings[i]["Rselectionoperator"] &&
		data.results.bindings[i]["Rselectionoperator"].value == '==' ) {
		rqqueryvaluesdef.push(vn);
		rqqueryvaluespart.push( '"'+data.results.bindings[i]["Rselectionvalue"].value+'"');
	    }
	    if (data.results.bindings[i]["D2RQPropertyBridgeContVar"]){
		var vn="?" + data.results.bindings[i]["Rselectionvalue"].value;
		rqquerylinesatend.push(" ?record "+ "<"+
				  data.results.bindings[i]["D2RQPropertyBridgeContVar"].value+">" + " " +
				  vn + " ." );
		
	    }
	    }

// Pattern	
// select ?record ?TRT01A ?SEX ?AGE 
// where {
//   ?record <http://www.example.org/datasets/vocab/ADSL_TRT01A> ?TRT01A ;
//   <http://www.example.org/datasets/vocab/ADSL_SEX> ?SEX ;
//   <http://www.example.org/datasets/vocab/ADSL_AGE> ?AGE .
//   values (?TRT01A ?SEX) {
//     ( "Placebo"  "F" )
//   }
// }

	rqqueryvaluesdef.push( ")");
	rqqueryvaluespart.push(")");
        
	rqquerylines.push( rqquerylinesatend.join(" ") );
	rqquerylines.push( rqqueryvaluesdef.join(" ") );
	rqquerylines.push( rqqueryvaluespart.join(" ") );
	rqquerylines.push("}");
	rqquerylines.push("}");
	
	var rqquery2=rqquerylines.join("\n");

	var pre= document.createElement("pre");
        var txt= document.createTextNode(rqquery2);
	pre.appendChild(txt);

	var show2 = document.getElementById("ShowResult2");
        show2.appendChild(pre);


	var sparqlURI="http://localhost:8890/sparql?default-graph-uri=&query="+encodeURIComponent(rqquery2)+"&format=text%2Fhtml&timeout=0&debug=on";
	console.log(" --> query: ", rqquery2);
	console.log(" --> Open: ", sparqlURI);
	setsrc(sparqlURI);

	// var promise2= $.ajax({
	//     dataType: "json",
	//     url:  endpoint,
	//     data: {
	// 	"query": rqquery2,
	// 	"output": "json"
	//     }
        // });
	
	// promise2.then( function(data) {
	// }
	
    }

    var promise1= $.ajax({
	dataType: "json",
	url:  endpoint,
	data: {
	    "query": rqquery,
	    "output": "json"
	}
        });

    promise1.then( function(data) {
    
	var table = document.createElement('table');
	console.log( "data.head.vars.length: ", data.head.vars.length );
	console.log( "data.head.vars: ", data.head.vars );
	var tr = document.createElement('tr');   
	for (var j=0; j < data.head.vars.length; j++) {
	    var th = document.createElement('th');
	    console.log("Header cell: "+data.head.vars[j]);
	    var cell= document.createTextNode(data.head.vars[j]);
	    th.appendChild(cell);
	    tr.appendChild(th);
	}
	table.appendChild(tr);
	console.log("End header row");
		   
	console.log( "data.results.bindings.length: ", data.results.bindings.length );
	for (var i = 0; i < data.results.bindings.length; i++ ){
	    var tr = document.createElement('tr');   
	    for (var j=0; j <data.head.vars.length; j++) {
		if (data.results.bindings[i][data.head.vars[j]]) {
		console.log("data.results.bindings[i][data.head.vars[j]].value",
			    data.results.bindings[i][data.head.vars[j]].value);
		}
	    }
	    for (var j=0; j < data.head.vars.length; j++) {
		
		var td = document.createElement('td');
		if (data.results.bindings[i][data.head.vars[j]]) {
		    var item=data.results.bindings[i][data.head.vars[j]];
		    if (item.type=="uri") {
			var cell= document.createElement("div");
			var att=document.createAttribute("class");
			att.value="clickuri";
			cell.setAttributeNode(att); 

			//    var att2=document.createAttribute("onclick"); 
			//    att2.value="myLookupsubject(this)";
			//    cell.setAttributeNode(att2);  

			cell.appendChild( document.createTextNode(item.value) );
		    } else if  (item.type=="typed-literal") {
			var cell= document.createTextNode(item.value);
		    }
		    else {
			var cell = document.createTextNode(item.value);
		    }
		} else {
			var cell= document.createTextNode(" ");
		}
		    td.appendChild(cell);
		    tr.appendChild(td);
		    console.log("End cell");
		}
		table.appendChild(tr);
		console.log("End row");
	    }
	console.log("End table");
        var tablearea = document.getElementById("ShowResult");
        tablearea.appendChild(table);

	queryData( data )
	// build the sparql query to get the data
	// invoke the next query
    } );

    
    // Still need to transpose the data - this will be mapping specific
    // Not clever 

   

//    var sparqlURI="http://localhost:8890/sparql?default-graph-uri=&query="+encodeURIComponent(rqquery)+"&format=text%2Fhtml&timeout=0&debug=on";
//    console.log(" --> Open: ", sparqlURI);
//    setsrc(sparqlURI);

}

