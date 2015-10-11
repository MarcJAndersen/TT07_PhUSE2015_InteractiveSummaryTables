library(rrdf)
help.start()

sparql.remote("http://localhost:8890/sparql",
              paste(
    "PREFIX qb:  <http://purl.org/linked-data/cube#>",
    "SELECT *",
    "WHERE { ?s a qb:Observation }",
    "LIMIT 5"
  )
)
