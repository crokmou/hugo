Pour démarrer le projet:
- Ouvrir Atom
- Ouvrir le terminal
- Ouvrir github-desktop
- Fetch les modifications depuis github-desktop
- $ `cd && cd Documents/Blog/ && npm run serve`
- Ouvrir `localhost:1313` dans chrome

Pour mettre à jour une modification:
- Ajouter un message de commit depuis github-desktop
- Cliquer sur `commit`
- Pusher les fichier modifiés
- `ctrl + c` dans le terminal pour éteindre le server
- $ `npm run deploy`

## Ajouter une image

- `{{< img src="URL_IMAGE" alt="EXPLICATION DE L'IMAGE" >}}`
- `![](URL_IMAGE)`

## Ajouter une gallerie

```
{{< gallery >}}
  {{< img src="https://cdn.rawgit.com/crokmou/images/1.0.7/i/voyage-nord-massif-vosges-france-chateau-sch%C5%93neck-crokmou-blog-cuisine-voyage-belgique-2.jpg" >}}
  {{< img src="https://cdn.rawgit.com/crokmou/images/1.0.7/i/voyage-nord-massif-vosges-france-chateau-sch%C5%93neck-crokmou-blog-cuisine-voyage-belgique-1.jpg" >}}
{{< /gallery >}}
```
