const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

app.use(express.json());

const dataBase = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "restapi2",
});

dataBase.connect((err) => {
  if (err) {
    console.log("ERREUR DE CONNEXION A LA DATABASE");
  } else {
    console.log("BRAVO, VOUS ÊTES CONNECTE A LA DATABASE");
  }
});

app.listen(port, () => {
  console.log("MON SERVEUR TOURNE SUR LE PORT :", port);
});

app.get("/items", (req, res) => {
  const sql = "SELECT * FROM item;";

  dataBase.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else if (results.length === 0) {
      return res.status(200).json({ error: "AUCUN ITEM" });
    } else {
      return res.status(200).json(results);
    }
  });
});

app.post("/createItem", (req, res) => {
  const { name, price, id_category, description } = req.body;
  if (!name || !price || !id_category || !description) {
    return res.status(400).json({ error: "AJOUTER TOUS LES CHAMPS" });
  }
  const sql =
    "INSERT INTO item (name, price, id_category, description) VALUES (?, ?, ?, ?);";
  dataBase.query(sql ,[name, price, id_category, description], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.put("/updateItem/:id", (req, res) => {
  const { name, price, id_category, description } = req.body;
  const { id } = req.params;
  if (!name || !price || !id_category || !description) {
    return res.status(400).json({ error: "AJOUTER TOUS LES CHAMPS" });
  }
  const sql =
    "UPDATE item SET name = ?, price = ?, id_category = ?, description = ? WHERE id = ?";
  dataBase.query(
    sql,
    [name, price, id_category, description, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else if (results.length === 0) {
        return res.status(200).json({ error: "AUCUN ITEM" });
      } else {
        return res.status(200).json(results);
      }
    }
  );
});

app.delete("/deleteItem/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM item WHERE id = ?";
  dataBase.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else {
      return res.status(200).json(results);
    }
  });
});

app.get("/itemID", (req, res) => {
  const sql = `
    SELECT item.id AS item_id, category.id AS category_id
    FROM item
    INNER JOIN item_category ON item.id = item_category.item_id
    INNER JOIN category ON item_category.category_id = category.id;
    `;
  dataBase.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else if (results.length === 0) {
      return res.status(200).json({ error: "AUCUN ITEM" });
    } else {
      return res.status(200).json(results);
    }
  });
});

app.get("/itemName/:category", (req, res) => {
  const category = req.params.category;
  const sql = `
    SELECT item.name
    FROM item
    INNER JOIN item_category ON item.id = item_category.item_id
    INNER JOIN category ON item_category.category_id = category.id
    WHERE category.name = ?;
  `;
  dataBase.query(sql, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR DU SERVEUR" });
    } else if (results.length === 0) {
      return res.status(404).json({ message: "AUCUN ITEM DANS LA CATEGORY" });
    } else {
      return res.status(200).json(results);
    }
  });
});



/*app.post("/createItemCategory", (req, res) => {
  const { name, price, description, categoryName } = req.body;
  if (!name || !price || !description || !categoryName) {
    return res.status(400).json({ error: "AJOUTER TOUS LES CHAMPS" });
  }
  const sql = "INSERT INTO item (name, price, description) VALUES (?, ?, ?)";
  const sqlcategory = "SELECT id FROM category WHERE name = ?";
  const sqlitem_category = "INSERT INTO item_category (item_id, category_id) VALUES (?, ?)";
  dataBase.query(sql, [name, price, description], (err, resultItem) => {
    if (err) {
      return res.status(500).json({ error: "ERREUR INSERTION ITEM" });
    }
    const itemId = resultItem.insertId;
    dataBase.query(sqlcategory, [categoryName], (err, resultCategory) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR RECHERCHE CATEGORY" });
      }
      if (resultCategory.length === 0) {
        return res.status(404).json({ error: "AUCUNE CATEGORY TROUVEE" });
      }
      const categoryId = resultCategory[0].id;
      dataBase.query(sqlitem_category, [itemId, categoryId], (err) => {
        if (err) {
          return res.status(500).json({ error: "ERREUR ASSOCIATTION ITEM/CATEGORY" });
        }
        res.status(200).json({
          itemId,
          categoryId
        });
      });
    });
  });
});*/

app.post("/createItemCategory", (req, res) => {
  const { name, price, description, categoryName } = req.body;

  const sql = "INSERT INTO item (name, price, description) VALUES (?, ?, ?)";
  const sqlcategory = "SELECT id FROM category WHERE name = ?";
  const sqlitem_category = "INSERT INTO item_category (item_id, category_id) VALUES (?, ?)";

  dataBase.query(sql, [name, price, description], (err, resultItem) => {
    const itemId = resultItem.insertId;

    dataBase.query(sqlcategory, [categoryName], (err, resultCategory) => {
      const categoryId = resultCategory[0].id;

      dataBase.query(sqlitem_category, [itemId, categoryId], (err) => {
        res.status(200).json({
          itemId,
          categoryId
        });
      });
    });
  });
});

app.delete("/deleteAllItem/:category", (req, res) => {
  const category = req.params.category;
  const sqldelete = `
    DELETE item_category
    FROM item_category
    INNER JOIN category ON item_category.category_id = category.id
    WHERE category.name = ?;
  `;
    const sqldeleteItem = `
      DELETE item
      FROM item
      INNER JOIN item_category ON item.id = item_category.item_id
      INNER JOIN category ON item_category.category_id = category.id
      WHERE category.name = ?;
    `;
    dataBase.query(sqldeleteItem, [category], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "ERREUR DE SUPPRESSION" });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({ message: "AUCUN ITEM TROUVE" });
      } else {
        return res.status(200).json({ message: "ITEMS SUPPRIMES" });
      }
  });
});