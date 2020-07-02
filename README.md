# Jahresarbeit 12. Klasse

Meine Jahresarbeit bestande darin eine **Beinenstockwaage** zu entwickeln.

## API Documentation

## GET /init/<name>

A GET request to `/init/<name>` checks the database for an document
with the field `name: <name>`. If non is found a document is created.

The route is then returning the objectID of the Document in json format.
```json
{
    "_id": 5e7facb28689c1479e9f9405
}
```
