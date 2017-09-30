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

S'il s'agit d'une image externe:
- `{{< img src="URL_IMAGE" >}}`
- `![](URL_IMAGE)`
