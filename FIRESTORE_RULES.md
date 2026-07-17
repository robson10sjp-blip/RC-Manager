# Regras recomendadas do Firestore para RC Manager

Use estas regras no Firebase Console para proteger a coleção `products`:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUid;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerUid;
    }
  }
}
```

Observações:
- Não coloque chaves privadas no código.
- Configure variáveis de ambiente em `.env` com os valores do Firebase Web App.
- O módulo de produtos salva produtos em uma coleção chamada `products` e associa cada documento ao usuário via `ownerUid`.
- Para usar no Vite, mantenha as variáveis de ambiente em `VITE_FIREBASE_*` e não faça commit de valores secretos.
