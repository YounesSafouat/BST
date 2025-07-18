# Configuration HTTPS pour IONOS

## 1. Activation SSL sur IONOS

### Étape 1 : Activer le certificat SSL
1. Connectez-vous à votre panneau IONOS
2. Allez dans "Domaines & SSL"
3. Sélectionnez votre domaine
4. Cliquez sur "Certificats SSL"
5. Activez le certificat SSL gratuit (Let's Encrypt)

### Étape 2 : Configuration du domaine
- Assurez-vous que votre domaine pointe vers votre serveur IONOS
- Vérifiez que les DNS sont correctement configurés

## 2. Variables d'environnement pour IONOS

Créez un fichier `.env.local` sur votre serveur IONOS :

```bash
# Configuration de base avec HTTPS
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
NEXTAUTH_URL=https://votre-domaine.com

# Configuration MongoDB (si hébergé sur IONOS ou externe)
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

## 3. Configuration du serveur web IONOS

### Si vous utilisez Apache (.htaccess) :
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers de sécurité
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

### Si vous utilisez Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. Déploiement sur IONOS

### Méthode 1 : Via SSH (recommandé)
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

### Méthode 2 : Via le panneau IONOS
1. Allez dans "Hébergement web"
2. Utilisez le gestionnaire de fichiers
3. Uploadez vos fichiers
4. Configurez les variables d'environnement

## 5. Vérification HTTPS

Après la configuration, vérifiez que :
- ✅ Votre site est accessible via `https://votre-domaine.com`
- ✅ Le cadenas vert apparaît dans le navigateur
- ✅ Les redirections HTTP → HTTPS fonctionnent
- ✅ Tous les liens internes utilisent HTTPS

## 6. Test de sécurité

Testez votre configuration avec :
- https://www.ssllabs.com/ssltest/
- https://securityheaders.com/
- https://observatory.mozilla.org/

## 7. Support IONOS

Si vous rencontrez des problèmes :
- Support IONOS : +33 1 70 99 41 00
- Documentation : https://www.ionos.fr/help/
- Chat en ligne disponible 24/7 