# Library-Node-to-AWS-Serverless

Practica del master Cloud Apps de la URJC para pasar de una aplicacion Node a una aplciacion serverless gestionada por AWS.

## Arquitectura



## Rutas para pruebas con las funciones lambda de AWS

* **Mostrar todos los usuarios**

  **Method**: GET <br/>
  **Route:** https://**<AWS_URL>**/users <br/>
  
---

* **Mostrar el detalle de un usuario**

  **Method**: GET <br/>
  **Route:** https://**<AWS_URL>**/users/{id} <br/>

---

* **Crear nuevo usuario**:
  
   **Method**: POST <br/>
   **Route:** https://**<AWS_URL>**/users <br/>
   **Body parameters:** <br/>
     ```json
     {
         "nick": "cristofer",
         "email": "cristofer@gmail.com"
     }
     ```

---

* **Borrar un usuario**

  **Method**: DELETE <br/>
  **Route:** https://**<AWS_URL>**/users/{id} <br/>

---

* **Mostrar todos los libros**

  **Method**: GET <br/>
  **Route:** https://**<AWS_URL>**/books <br/>
  
---

* **Detalle de un libro**:

  **Method**: GET <br/>
  **Route:** https://**<AWS_URL>**/books/{id} <br/>
  
---

* **Crear nuevo libro**:

  **Method**: POST <br/>
  **Route:** https://**<AWS_URL>**/books <br/>
  **Body parameters:** <br/>
     ```json
    {
        "title": "Nuevo libro",
        "summary": "El resumen del libro",
        "author": "Autor",
        "publisher": "Editorial",
        "publicationYear": 2020
    }
     ```
  
---

* **Crear nuevo comentario para un libro**:

  **Method**: POST <br/>
  **Route:** https://**<AWS_URL>**/books/{id}/comments <br/>
  **Body parameters:** <br/>
     ```json
    {
        "comment": "comentario",
        "score": 5,
        "author": "cristofer" // debe existir un usuario con ese nick
    }
     ```
  
---

* **Borrar un comentario de un libro**:

  **Method**: DELETE <br/>
  **Route:** https://**<AWS_URL>**/books/{id}/comments/{commentid} <br/>