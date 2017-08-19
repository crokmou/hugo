## Ajouter une image

S'il s'agit d'une image interne:
- `{{< img cloudinary="URL_IMAGE_CLOUDINARY" >}}` (après `/upload/`)

S'il s'agit d'une image externe:
- `{{< img src="URL_IMAGE" >}}`
- `![](URL_IMAGE)`

## Ajouter une grille dans un article

```
{{< grid col="NOMBRE_DE_COLONE" gap="MARGE">}}
    {{< grid-child >}}CONTENT_TEXT{{< /grid-child >}}
    {{% grid-child %}}CONTENT_MARKDOWN{{% /grid-child %}}
    {{< img [src | cloudinary] >}}
{{< /grid }}
```

- `MARGE` = 1,2,3 ou 4 * 5px
- `CONTENT_TEXT` = Contenu textuel uniquement
- `CONTENT_MARKDOWN` = Peut contenir de la syntaxe en markdown
- `[src/cloudinary]` = Voir image

Chaque `grid-child` ou `img` peut être répété autant de fois qu'il le faut et peut prendre plusieurs 2 paramètres:

- `cover="true"` pour les img seulement. Permet de faire rentrer l'image entière dans le bloc, sans déformation.
- `col="DEBUT-FIN"` ou `DEBUT` correspond à la première colone où l'élément commence et FIN correspond à la dernière colone où l'élément comment

par exemple, si le parent a `NOMBRE_DE_COLONE` = 4:

- `col="1-3" veut dire que l'enfant prendra la place de 2 éléments. Il restera à sa droite encore la place pour 2 colones.
- `col="3-5" veut die que l'enfant prendra la place de 2 élement en commençant à la place du 3 élement de la lign.
- `col="1-5"` prendra la place de tous les éléments de la ligne et sera donc seul sur sa ligne.
- coupler `col="1-3"` avec un deuxième element qui a `col="3-5"` permet d'avoir une ligne de 2 éléments. Si le premier élément est une image horizontal et le deuxième, une une image verticale, `cover="true"` sur la première image permettra d'avoir une ligne uniforme.
