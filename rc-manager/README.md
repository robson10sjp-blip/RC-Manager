# RC Manager

Este projeto é uma aplicação React para gerenciamento de clientes, utilizando o Firebase Firestore como banco de dados. O módulo de clientes inclui funcionalidades para cadastro, listagem, pesquisa, edição e exclusão de clientes.

## Estrutura do Projeto

```
rc-manager
├── public
│   └── index.html          # Página HTML principal
├── src
│   ├── components          # Componentes React
│   │   ├── ClientForm.tsx  # Formulário de cadastro e edição de clientes
│   │   ├── ClientList.tsx  # Lista de clientes cadastrados
│   │   ├── ClientSearch.tsx # Componente de pesquisa de clientes
│   │   └── ClientModule.tsx # Módulo principal que integra os componentes
│   ├── firebase
│   │   └── config.ts       # Configuração do Firebase e inicialização do Firestore
│   ├── services
│   │   └── clientService.ts # Funções para interagir com o Firestore
│   ├── styles
│   │   └── client.css       # Estilos CSS para os componentes
│   ├── App.tsx              # Ponto de entrada da aplicação
│   └── main.tsx             # Montagem da aplicação no DOM
├── package.json             # Configuração do npm
├── tsconfig.json            # Configuração do TypeScript
├── vite.config.ts           # Configuração do Vite
└── README.md                # Documentação do projeto
```

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/robson10sjp-blip/RC-Manager.git
   ```

2. Navegue até o diretório do projeto:
   ```
   cd RC-Manager
   ```

3. Instale as dependências:
   ```
   npm install
   ```

## Uso

Para iniciar a aplicação em modo de desenvolvimento, execute:
```
npm run dev
```

Para compilar a aplicação para produção, execute:
```
npm run build
```

## Funcionalidades

- **Cadastro de Clientes**: Adicione novos clientes através do formulário.
- **Listagem de Clientes**: Visualize todos os clientes cadastrados em uma lista.
- **Pesquisa de Clientes**: Filtre a lista de clientes com base em critérios de pesquisa.
- **Edição de Clientes**: Edite as informações de clientes existentes.
- **Exclusão de Clientes**: Remova clientes da lista.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie um pull request com suas alterações.