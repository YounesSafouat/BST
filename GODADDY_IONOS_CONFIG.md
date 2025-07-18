# Configuration GoDaddy + IONOS

## 1. Configuration DNS sur GoDaddy

### Étape 1 : Accéder aux DNS GoDaddy
1. Connectez-vous à votre compte GoDaddy
2. Allez dans "Mes produits" → "Domaines"
3. Cliquez sur votre domaine
4. Cliquez sur "Gérer les DNS"

### Étape 2 : Configurer les enregistrements DNS

#### Pour un hébergement web IONOS :
```
Type: A
Nom: @ (ou laissez vide)
Valeur: [IP de votre serveur IONOS]
TTL: 600 (ou 1 heure)

Type: A
Nom: www
Valeur: [IP de votre serveur IONOS]
TTL: 600
```

#### Pour un serveur VPS IONOS :
```
Type: A
Nom: @
Valeur: [IP de votre VPS IONOS]
TTL: 600

Type: A
Nom: www
Valeur: [IP de votre VPS IONOS]
TTL: 600
```

### Étape 3 : Enregistrements CNAME (optionnel)
```
Type: CNAME
Nom: www
Valeur: votre-domaine.com
TTL: 600
```

## 2. Obtenir l'IP de votre serveur IONOS

### Si vous avez un VPS IONOS :
1. Connectez-vous à votre panneau IONOS
2. Allez dans "Serveurs & Cloud" → "VPS"
3. Notez l'adresse IP de votre serveur

### Si vous avez un hébergement web IONOS :
1. Dans votre panneau IONOS
2. Allez dans "Hébergement web"
3. Notez l'adresse IP du serveur

## 3. Configuration SSL sur IONOS

### Étape 1 : Activer SSL
1. Panneau IONOS → "Domaines & SSL"
2. Sélectionnez votre domaine GoDaddy
3. Cliquez sur "Certificats SSL"
4. Activez "Certificat SSL gratuit"

### Étape 2 : Vérifier la propagation DNS
```bash
# Vérifiez que votre domaine pointe vers IONOS
nslookup votre-domaine.com
dig votre-domaine.com
```

## 4. Variables d'environnement pour GoDaddy + IONOS

Créez un fichier `.env.local` sur votre serveur IONOS :

```bash
# Configuration avec votre domaine GoDaddy
NEXT_PUBLIC_BASE_URL=https://votre-domaine-godaddy.com
NEXT_PUBLIC_SITE_URL=https://votre-domaine-godaddy.com
NEXTAUTH_URL=https://votre-domaine-godaddy.com

# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/blackswantechnology

# Configuration HubSpot
HUBSPOT_ACCESS_TOKEN=votre_token_hubspot

# Configuration NextAuth
NEXTAUTH_SECRET=votre_secret_nextauth

# Mode maintenance
MAINTENANCE_MODE=false

# Forcer HTTPS
FORCE_HTTPS=true
```

## 5. Configuration du serveur web

### Pour Apache (.htaccess) :
```apache
# Redirection HTTPS forcée
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirection www vers non-www (optionnel)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Headers de sécurité
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

### Pour Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine-godaddy.com www.votre-domaine-godaddy.com;
    return 301 https://votre-domaine-godaddy.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine-godaddy.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine-godaddy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine-godaddy.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 6. Déploiement

### Via SSH sur IONOS :
```bash
# Connectez-vous à votre serveur IONOS
ssh utilisateur@votre-serveur-ionos.com

# Naviguez vers votre projet
cd /var/www/votre-projet

# Mettez à jour le code
git pull origin main

# Installez les dépendances
npm install

# Construisez l'application
npm run build

# Redémarrez l'application
pm2 restart all
```

## 7. Vérification

### Test de propagation DNS :
```bash
# Vérifiez que votre domaine pointe vers IONOS
nslookup votre-domaine-godaddy.com
dig votre-domaine-godaddy.com

# Vérifiez les enregistrements DNS
whois votre-domaine-godaddy.com
```

### Test HTTPS :
- ✅ https://votre-domaine-godaddy.com
- ✅ Cadenas vert dans le navigateur
- ✅ Redirection HTTP → HTTPS
- ✅ Pas d'erreurs de certificat

## 8. Dépannage

### Problème : Site non accessible
1. Vérifiez la propagation DNS (peut prendre 24-48h)
2. Vérifiez que l'IP dans GoDaddy correspond à IONOS
3. Vérifiez que le serveur IONOS est actif

### Problème : Erreur SSL
1. Vérifiez que le certificat SSL est activé sur IONOS
2. Vérifiez que le domaine est correctement configuré
3. Attendez la propagation du certificat (jusqu'à 1h)

### Problème : Redirection en boucle
1. Vérifiez la configuration .htaccess
2. Vérifiez les variables d'environnement
3. Vérifiez la configuration du serveur web

## 9. Support

- **GoDaddy Support** : +33 1 70 99 41 00
- **IONOS Support** : +33 1 70 99 41 00
- **Documentation GoDaddy** : https://fr.godaddy.com/help
- **Documentation IONOS** : https://www.ionos.fr/help/ 