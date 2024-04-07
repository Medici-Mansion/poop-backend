WITH search_keys AS (
  SELECT
    b.id,
    b."createdAt",
    b."updatedAt",
    b."deletedAt",
    b."nameKR",
    b."nameEN",
    b.avatar,
    get_choseong((b."nameKR") :: text) AS "searchKey"
  FROM
    breeds b
)
SELECT
  id,
  "createdAt",
  "updatedAt",
  "deletedAt",
  "nameKR",
  "nameEN",
  avatar,
  "searchKey",
  ascii("searchKey") AS "searchKeyCode"
FROM
  search_keys;