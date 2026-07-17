# My Clientes App

Este projeto é uma aplicação React para gerenciamento de clientes, utilizando o Firestore como banco de dados. A aplicação permite o cadastro, listagem, pesquisa, edição e exclusão de clientes.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

```
my-clientes-app
├── src
│   ├── modules
│   │   └── clientes
│   │       ├── ClienteForm.tsx      # Componente para cadastro de novos clientes
│   │       ├── ClienteList.tsx      # Componente que exibe a lista de clientes
│   │       ├── ClienteSearch.tsx     # Componente para pesquisa de clientes
│   │       ├── ClienteEdit.tsx       # Componente para edição de dados de clientes
│   │       ├── ClienteDelete.tsx      # Componente para exclusão de clientes
│   │       └── clienteService.ts      # Serviço para interações com o Firestore
│   ├── firebase
│   │   ├── config.ts                 # Configuração do Firebase
│   │   └── firestore.ts               # Instância do Firestore
│   ├── App.tsx                       # Ponto de entrada da aplicação
│   └── index.tsx                     # Renderização do componente App
├── package.json                      # Configuração do npm
├── tsconfig.json                     # Configuração do TypeScript
├── firebase.json                     # Configuração do Firebase
└── README.md                         # Documentação do projeto
```

## Funcionalidades

- **Cadastro de Clientes**: O componente `ClienteForm` permite que novos clientes sejam cadastrados.
- **Listagem de Clientes**: O componente `ClienteList` exibe todos os clientes cadastrados.
- **Pesquisa de Clientes**: O componente `ClienteSearch` permite a busca de clientes pelo nome.
- **Edição de Clientes**: O componente `ClienteEdit` permite a edição dos dados de um cliente existente.
- **Exclusão de Clientes**: O componente `ClienteDelete` permite a remoção de um cliente.

## Instalação

Para instalar as dependências do projeto, execute:

```
npm install
```

## Execução

Para iniciar a aplicação, utilize o comando:

```
npm start
```

## Build

Para gerar a versão de produção da aplicação, execute:

```
npm run build
```

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie suas pull requests.