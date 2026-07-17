# RC Manager Cloud 4.0

Primeira versão online do sistema de gestão da RC Confecções.

## O que já funciona

- Cadastro de conta com e-mail e senha
- Login real pelo Firebase Authentication
- Recuperação de senha por e-mail
- Cadastro de clientes no Cloud Firestore
- Cadastro de produtos e estoque no Cloud Firestore
- Sincronização automática entre aparelhos usando a mesma conta
- Painel com quantidade de clientes e peças em estoque

## Como publicar pelo GitHub no iPhone

1. Descompacte `RC_Manager_Cloud_4_Starter.zip` no aplicativo Arquivos.
2. Abra o repositório `RC-Manager` no GitHub.
3. Toque em **Add file** → **Upload files**.
4. Envie estes arquivos na raiz do repositório:
   - `index.html`
   - `_redirects`
   - `_headers`
   - `README.md`
5. Confirme em **Commit changes**.
6. O Netlify publicará automaticamente.

## Primeiro acesso ao site

Na primeira abertura, o RC Manager pedirá o objeto `firebaseConfig`.

No Firebase:

1. Configurações do projeto
2. Geral
3. Seus aplicativos
4. RC Manager Web
5. Configuração do SDK
6. Marque **Config**
7. Copie apenas o conteúdo do objeto `firebaseConfig`
8. Cole no RC Manager e toque em **Salvar e conectar**

## Regras de segurança do Firestore

O arquivo `firestore.rules` acompanha o projeto. Ele não é publicado pelo Netlify.

Para aplicar:

1. Firebase → Firestore Database → Regras
2. Substitua o conteúdo pelas regras do arquivo
3. Toque em **Publicar**

Essas regras garantem que cada usuário veja apenas os dados da própria conta.
