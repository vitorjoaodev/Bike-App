# BikeShare SP - Sistema de Aluguel de Bicicletas

![BikeShare SP](https://github.com/vitorjoaodev/Bike-App/blob/main/my.menu.jpg?raw=true)

## Visão Geral

BikeShare SP é uma aplicação web moderna para aluguel de bicicletas em São Paulo, inspirada no modelo operacional do Uber. O sistema permite que usuários localizem estações de bicicletas próximas, visualizem as bicicletas disponíveis, efetuem reservas e gerenciem seus aluguéis através de uma interface intuitiva e responsiva.

## Funcionalidades Principais

- **Mapa Interativo**: Visualize todas as estações de bicicletas disponíveis em São Paulo em um mapa interativo.
- **Pesquisa de Estações**: Encontre estações por localização ou nome.
- **Detalhes das Estações**: Visualize informações detalhadas de cada estação, incluindo horários de funcionamento, capacidade e disponibilidade.
- **Visualização de Bicicletas**: Veja os diferentes modelos de bicicletas disponíveis em cada estação.
- **Planos de Aluguel**: Escolha entre planos por hora, diário ou semanal.
- **Agendamento**: Agende reservas para datas e horários específicos.
- **Notificações**: Opção para receber atualizações sobre seu aluguel via SMS ou e-mail.
- **Navegação**: Instruções de navegação para chegar até a estação selecionada.
- **Perfil de Usuário**: Gerencie seu perfil e visualize histórico de aluguéis.

## Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca JavaScript para construção da interface de usuário.
- **TypeScript**: Superset de JavaScript para tipagem estática.
- **Vite**: Ferramenta de build para desenvolvimento rápido.
- **Tailwind CSS**: Framework CSS para estilização responsiva.
- **Shadcn UI**: Componentes UI reutilizáveis.
- **Framer Motion**: Biblioteca para animações fluidas.
- **React Query**: Para gerenciamento de estado e chamadas de API.
- **React Hook Form**: Para gerenciamento de formulários.
- **Leaflet**: Biblioteca de mapas interativos.
- **Zod**: Validação de esquemas.

### Backend
- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework web para Node.js.
- **PostgreSQL**: Banco de dados relacional para persistência de dados.
- **Drizzle ORM**: ORM (Object-Relational Mapping) para interação com o banco de dados.

## Arquitetura

O projeto segue uma arquitetura full-stack com separação clara entre cliente e servidor:

- **Cliente**: Aplicação React Single Page Application (SPA).
- **Servidor**: API RESTful em Express.js que se comunica com o banco de dados PostgreSQL.
- **Banco de Dados**: PostgreSQL gerenciado pelo Drizzle ORM.

## Diferenciais do Projeto

1. **Interface Intuitiva**: Design centrado no usuário com foco em usabilidade móvel.
2. **Animações Fluidas**: Transições suaves e animações que melhoram a experiência do usuário.
3. **Performance Otimizada**: Tempo de carregamento rápido e experiência de uso fluida.
4. **Responsividade**: Adaptação perfeita para dispositivos móveis, tablets e desktops.
5. **Persistência de Dados**: Armazenamento confiável de informações de usuários e aluguéis no PostgreSQL.
6. **Georeferenciamento**: Uso de mapas para localização precisa de estações.

## Instalação e Execução

### Pré-requisitos
- Node.js v16+
- PostgreSQL

### Configuração
1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/bikeshare-sp.git
   cd bikeshare-sp
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e adicione:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/bikeshare
   ```

4. Execute as migrações do banco de dados:
   ```
   npm run db:push
   ```

5. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

6. Acesse a aplicação em `http://localhost:5000`

## Estrutura do Projeto

```
bikeshare-sp/
├── client/             # Código do frontend
│   ├── src/            
│   │   ├── components/ # Componentes React reutilizáveis
│   │   ├── hooks/      # React hooks personalizados
│   │   ├── lib/        # Utilitários e configurações
│   │   ├── pages/      # Páginas da aplicação
│   │   └── types/      # Definições de tipos TypeScript
├── server/             # Código do backend
│   ├── routes.ts       # Definição de rotas da API
│   ├── storage.ts      # Interface de armazenamento
│   └── db.ts           # Configuração do banco de dados
├── shared/             # Código compartilhado entre frontend e backend
│   └── schema.ts       # Esquemas do banco de dados
└── README.md           # Documentação do projeto
```

## Futuras Implementações

- **Pagamentos Integrados**: Integração com gateways de pagamento.
- **Autenticação Social**: Login com Google, Facebook, etc.
- **QR Code para Desbloqueio**: Sistema de desbloqueio por QR Code.
- **Gamificação**: Sistema de pontos e recompensas para usuários frequentes.
- **Recomendações Personalizadas**: Sugestões com base no histórico do usuário.
- **Análise de Rotas**: Recomendações de rotas cicláveis mais seguras.
- **Integração com Transporte Público**: Combinação de aluguel de bicicletas com transporte público.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

Desenvolvido por João Vitor Belasque
joaovitorbelasque@outlook.com
