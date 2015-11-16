# TT07 _PhUSE2015 Interactive Summary Tables

This GitHub repository contains the source code and data for the Interactive Summary Tables presented in the PhUSE 2015 conference as paper TT07 'Dude, Where's My Graph?' Displaying RDF Data Cube Structure, Content and Summary Tables for Clinical Data (http://www.phuse.eu/2015ConferencePapers.aspx).

The text below is sortof raw - in the sense that it provides the instructions used for setting the interactive summary tables, but could definitively be improved for clarity and completeness.
Oh, the html and javascript is also in an unfinished form.

Marc Andersen, 11-oct-2015, updated 28-oct-2015

# Setup


## Windows specific

### Virtuoso installation

Follow installation instructions at
(http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSUsageWindows)

Note: the use of a command shell with administration rigths is
important to achive the descired results.

The simplest approach is to use the default database located in
`C:\Program Files\OpenLink Software\VOS7\virtuoso-opensource\database`.

This can be done by following the instructions at the above
web-page. Note that this will not be the optimal setup. The
virtuoso.ini file needs to be configured to allow access to the files
that will be imported. So, it is suggested to use the provided .ini
file in virtuoso_db directory.

### Starting virtuoso

To start virtuoso issue the following commands from a shell with administrative rights:

    cd/d h:\projects-s114h\GitHub\TT07_PhUSE2015\marc\interface2
    cd virtuoso_db
    virtuoso-t -f

### Populating virtouso database

The next steps are only relevant for the first run - or after deleting the database.

The "Entity Relations Faceted Browser" has to be loaded in
virtuoso. Download the package
(http://opldownload.s3.amazonaws.com/uda/vad-packages/7.2/fct_dav.vad)
- which is located at
(http://virtuoso.openlinksw.com/download/#Release72VADPackages) for
version 7.2.  Note: virtuoso should be restarted to enable the newly
installed package.

It is assumed fct_dav.vad is in the directory `../` relative to the virtuoso db directory.

    cd/d h:\projects-s114h\GitHub\TT07_PhUSE2015\marc\interface2
    isql 1111 dba dba fct_dav_install.sql

Finally, load the example turtle files.

    cd/d h:\projects-s114h\GitHub\TT07_PhUSE2015\marc\interface2
    isql 1111 dba dba rrdf-sample-rdf-load.sql


### Start web server

    cd/d h:/projects-s114h/GitHub/TT07_PhUSE2015/marc/interface2/
    c:\Python34\python.exe -m http.server

WEB server needed to overcome cors limitations.
(same origin)


## Linux specific

## Populate directory with files from R-package rrdfqbcrnd0 (https://github.com/MarcJAndersen/rrdfqbcrnd0), linux

The directory sample-rdf contains the nescessary files. This is only applicable if the sample files are changed.

    # change to destination directory (same directory as this file)
    cd ~/projects/TT07_PhUSE2015/marc/interface2
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/sample-cfg/DC-DEMO-sample.html .
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/sample-cfg/DC-AE-sample.html .

    mkdir -p sample-rdf
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/sample-rdf/DC*.ttl sample-rdf
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/sample-rdf/adsl*.ttl sample-rdf
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/sample-rdf/adae*.ttl sample-rdf
    mkdir -p CUBE-standards-rdf
    cp ~/projects/R-projects/rrdfqbcrnd0/rrdfqbcrnd0/inst/extdata/CUBE-standards-rdf/cube.ttl CUBE-standards-rdf


### Start web server

Change to destination directory (same directory as this file)

    cd /home/ma/projects/TT07_PhUSE2015/marc/interface2
    python3 -m http.server

### Start fuseki

Apache Jena fuseki can also be used, but will not provide a faceted browser.

### Start virtuoso
The virtuoso.ini uses relative paths, therefore the cd to the directory is needed.

    cd virtuoso_db
    /usr/local/virtuoso-opensource/bin/virtuoso-t -f

### Removing/Starting with empty virtuoso database - take care

If the virtuoso database is removed and recreated, the faceted browser has to be reloaded.

    cd virtuoso_db
    rm *.db *.pxa *.trx *log

To get the database and associated files created, start a virtuoso instance

    cd virtuoso_db
    rm *.db *.pxa *.trx *log

The faceted browser can be downloaded using - for virtuoso version 7.2 -

    cd virtuoso_db
    wget http://opldownload.s3.amazonaws.com/uda/vad-packages/7.2/fct_dav.vad

To install the faceted browser either use the web based interface at
(http://localhost:8890/conductor/), log in with dba dba and follow the
instruction at
(http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VirtFacetBrowserInstallConfig).


Alternatively, the `fct_dav.vad` package can be installed using isql, assuming that the file `fct_dav.vad` is downloaded into the virtuoso database directory:

    vad_install('./fct_dav.vad', 0);

Here is the expected output:


    SQL> vad_install('./fct_dav.vad', 0);
    SQL_STATE     SQL_MESSAGE
    LONG VARCHAR  VARCHAR
    _______________________________________________________________________________
    
    00000         GUI is accesible via http://host:port/fct
    00000         Post-installation guide is available from http://host:port/fct/post_install.html
    00000         No errors detected
    00000         Installation of "Faceted Browser" is complete.
    00000         Now making a final checkpoint.
    00000         Final checkpoint is made.
    00000         SUCCESS
    BLOB 0 chars



To do so, open another terminal window and issue

    cd $X
    /usr/local/virtuoso-opensource/bin/isql 1111 dba dba fct_dav_install.sql

More information:
- (http://docs.openlinksw.com/virtuoso/fn_vad_install.html)

### Load files into virtuoso, linux
This assumes that the virtuoso instance server is listening at port 1111, 

    cd ~/projects/TT07_PhUSE2015/marc/interface2
    /usr/local/virtuoso-opensource/bin/isql 1111 dba dba rrdf-sample-rdf-load.sql


## Overcomming CORS for development

See (http://enable-cors.org/server_virtuoso.html)

## Further information:
- Virtuoso isql (http://docs.openlinksw.com/virtuoso/isql.html)
- (http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSIndex)
- (http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/)

# Using the Interactive Summary table

Open (http://localhost:8000/main.html)

In Chrome CORS security can be disabled by starting chrome as

google-chrome --disable-web-security

Alternatively, the plugin (https://github.com/vitvad/Access-Control-Allow-Origin) can also be used .

# Using virtuoso faceted browser

To see an example of the virtuoso faceted browser open
(http://localhost:8890/describe/?url=http%3A%2F%2Fwww.example.org%2Fdc%2Fcode%2Faedecod-ABDOMINAL_DISCOMFORT&sid=1)

# SPARQL queries of interest

	prefix d2rq: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#> 
	select * where { ?s d2rq:dataStorage ?o }

# More...

### Optional: define a service for virtuoso

The following could be one approach for creating a service

    cd virtuoso_db
    virtuoso-t +service create +instance "TT07_PhUSE2015 Virtuoso" +configfile virtuoso.ini 
    virtuoso-t +instance "TT07_PhUSE2015 Virtuoso" +service start

### More on virtuoso trouble shooting

In windows service the virtuoso service is identified as display name "OpenLink Virtuoso Server [New Instance Name]". So, look for something starting with "OpenLink".

Ensure that no other than the wanted virtuoso services are running.

    virtuoso-t +service list

In my setup I had a service running - a left over from experimenting ....

    New Instance Name    Stopped
    TT07_PhUSE2015 Virtuoso Running

First the service is stopped:

    virtuoso-t +instance "TT07_PhUSE2015 Virtuoso" +service stop

giving output like

    The Virtuoso_TT07_PhUSE2015 Virtuoso service is being shut down

The service can also be deleted using

    virtuoso-t +instance "TT07_PhUSE2015 Virtuoso" +service delete

Finally, start virtuoso

    virtuoso-t -f


After the service is started change to directory containing the sample RDF files. In my setup this is h:/projects-s114h/GitHub/TT07_PhUSE2015/marc/interface2/.

#### removing virtuoso service

The service name is the one given in brackets in Services column Name.

virtuoso-t +service create +instance "OpenLink_Virtuoso_XX" +configfile "c:\Program Files\OpenLink Software\VOS7\virtuoso-opensource\database\virtuoso.ini"

virtuoso-t +service delete +instance "OpenLink_Virtuoso_XX"
The removal of the Virtuoso_OpenLink_Virtuoso_XX service registration was successful

virtuoso-t +service delete +instance "New Instance Name"
The removal of the Virtuoso_New Instance Name service registration was successful




# Acknowledments and thanks

The following resouce provided knowledge and/or source code for creating the prototype:

Layout example (http://www.w3schools.com/html/html_layout.asp)

iframe options (http://www.w3schools.com/html/html_iframe.asp)

drag-and-drop (http://www.w3schools.com/html/html5_draganddrop.asp)

drag-and-drop (http://stackoverflow.com/questions/13007582/html5-drag-and-copy)

SPARQL query (http://stackoverflow.com/questions/22769701/how-to-query-dbpedia-in-javascript)

Encoding component of SPARQL query (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

Copy to clipboard (https://www.lucidchart.com/techblog/2014/12/02/definitive-guide-copying-pasting-javascript/)

jquery (https://jquery.com/download/)

Apache Jena (http://jena.apache.org/)

Virtuoso (http://virtuoso.openlinksw.com)

The RDF Data Cube Vocabulary (http://www.w3.org/TR/vocab-data-cube/)

PhUSE Semantic Technology Project (http://www.phusewiki.org/wiki/index.php?title=Semantic_Technology)

Generating R-RDF Data Cube for Clinical Research & Development, work from a subgroup of PhUSE Semantic Technology Project (https://github.com/MarcJAndersen/rrdfqbcrnd0)

PhUSE Semantic Technology project Analysis Results Model (http://www.phusewiki.org/wiki/index.php?title=Analysis_Results_Model)
