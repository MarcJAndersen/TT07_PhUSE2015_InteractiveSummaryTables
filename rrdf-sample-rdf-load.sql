
# How to execute script
# linux
# /usr/local/virtuoso-opensource/bin/isql 1111 dba dba rrdf-sample-rdf-load.sql
#
# Note: for virtuoso to load the file the virtuoso.ini file must allow access to the files
#
# windows
# isql 1111 dba dba rrdf-sample-rdf-load.sql
#
# see https://confluence.deri.ie:8443/display/webstar/The+complete+tutorial+for+RDF+data+ingestion+in+Virtuoso
#
# or cut-paste the text below into an isql session


# Why delete the graph: loading does not remove changed triples. It is obvious, but took me a few tries to graps.

# see http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VirtTipsAndTricksGuideDeleteLargeGraphs
log_enable(3,1);
SPARQL CLEAR GRAPH  <http://www.example.org/TT07>;

# see http://phenoscape.org/wiki/Virtuoso
delete from db.dba.load_list;

# Change the path below to fit your setup
ld_dir('../sample-rdf', 'DC*.ttl', 'http://www.example.org/TT07');
ld_dir('../sample-rdf', 'adsl*.ttl', 'http://www.example.org/TT07');
ld_dir('../sample-rdf', 'adae*.ttl', 'http://www.example.org/TT07');
ld_dir('../CUBE-standards-rdf', 'cube.ttl', 'http://purl.org/linked-data/cube#');
set isolation='uncommitted';
rdf_loader_run();
# show the status - ll_state 2 means it has been processed, 1 means it's being processed
select ll_file, ll_state, ll_done, ll_error from  DB.DBA.load_list;
