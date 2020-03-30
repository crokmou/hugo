# Despite being open sourced, all the content remain copyright of Sarah Blieux@Crokmou. So please don't steal/use/sell whatever and ask first so we can find an arrangment.


Pour démarrer le projet:
- Ouvrir Intellij
- Ouvrir le terminal
- Ouvrir github-desktop
- Fetch les modifications depuis github-desktop
- $ `cd && cd Documents/Crokmou/Blog/ && npm run dev`
- Ouvrir `localhost:1313` dans chrome

Pour mettre à jour une modification:
- Ajouter un message de commit depuis github-desktop
- Cliquer sur `commit`
- Pusher les fichier modifiés
- `ctrl + c` dans le terminal pour éteindre le server
- $ `npm run deploy`

## Ajouter une image
- Kill le server avec `ctrl + c`
- Ajoute l'image dans le dossier i du repo images
- Utilise le lien: `https://images.crokmou.com/NOM_DE_L_IMAGE`
- Lancer `npm run updateImage && npm run dev`

### Dans le contenu d'un article
 `{{< img src="URL_IMAGE" alt="EXPLICATION DE L'IMAGE" >}}`
### Dans le front matter d'un article (pour les recettes par exemple)
`![EXPLICATION DE L'IMAGE](URL_IMAGE)`

## Ajouter une gallerie dans le contenu de l'article

```
{{< gallery >}}
  {{< img src="https://images.crokmou.com/voyage-nord-massif-vosges-france-chateau-sch%C5%93neck-crokmou-blog-cuisine-voyage-belgique-2.jpg" >}}
  {{< img src="https://images.crokmou.com/voyage-nord-massif-vosges-france-chateau-sch%C5%93neck-crokmou-blog-cuisine-voyage-belgique-1.jpg" >}}
{{< /gallery >}}
```

## Créer un nouvel article

- Ouvrir un nouveau terminal (pomme + T) et taper: `cd Documents/Crokmou/Blog`
- Ensuite taper: `hugo new SECTION/aaaa-mm-dd-slug-de-l-article.md` (ex: `hugo new blog/2017-01-07-mon-nouveau-blog.md` ou s'il  y a un espace dans la section, il faut les prefixer par un `\` - `hugo new carnet\ de\ voyage/2017-01-07-mon-nouveau-voyage.md`

hugo new recettes/2020-03-30-yaksik-yakbap-gateau-riz-dessert-coreen.md