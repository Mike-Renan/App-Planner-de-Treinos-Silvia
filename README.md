# 💪 Planner de Treinos

Um aplicativo web moderno e responsivo para planejar e acompanhar treinos de musculação. Desenvolvido com HTML, CSS (Tailwind), e JavaScript puro.

## ✨ Características

- **Visualização Semanal**: Organize seus treinos por dia da semana (segunda a sexta)
- **Visualização Mensal**: Acompanhe o histórico de treinos realizados mês a mês
- **Gerenciamento de Exercícios**: 
  - Adicionar novos exercícios
  - Editar exercícios existentes
  - Excluir exercícios
  - Marcar exercícios como concluídos
- **Armazenamento Local**: Todos os dados são salvos no localStorage do navegador
- **Vídeos de Referência**: Links para vídeos explicativos de cada exercício
- **Histórico de Check-ins**: Rastreie quantas vezes você realizou cada dia de treino
- **Interface Moderna**: Design elegante com gradientes e tema escuro

## 🎯 Funcionalidades

### Treinos Pré-configurados
O aplicativo vem com um plano de treino padrão:

- **Segunda**: Peito
  - Supino reto (4x8-10)
  - Crucifixo com halteres (3x12)

- **Terça**: Costas
  - Remada curvada (4x10)
  - Barra fixa (3 séries até falha)

- **Quarta**: Pernas
  - Agachamento livre (5x5)
  - Leg press (4x12)

- **Quinta**: Ombros
  - Desenvolvimento com barra (4x8)
  - Elevação lateral (3x15)

- **Sexta**: Bíceps/Tríceps
  - Rosca direta (4x10)
  - Tríceps testa (4x12)

### Interações Principais

- **Alternar Visualizações**: Use os botões "📅 Semanal" e "📊 Mensal" para trocar entre as visões
- **Marcar Concluído**: Clique no exercício para marcar como feito/não feito
- **Adicionar Exercício**: Clique em "✨ Adicionar Exercício" para criar novos exercícios
- **Editar**: Modifique os detalhes de qualquer exercício
- **Excluir**: Remova exercícios que não deseja mais
- **Ver Vídeos**: Acesse tutoriais em vídeo para cada exercício (quando disponível)

## 📁 Estrutura do Projeto

```
├── index.html      # Estrutura HTML principal
├── script.js       # Lógica e funcionalidade da aplicação
├── style.css       # Estilos personalizados (CSS puro)
└── README.md       # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Tailwind CSS
- **JavaScript (Vanilla)**: Lógica da aplicação sem dependências externas
- **localStorage**: Persistência de dados local
- **YouTube API**: Links para vídeos de referência

## 🚀 Como Usar

### Abrir o Aplicativo
1. Clone ou faça download do projeto
2. Abra o arquivo `index.html` em um navegador moderno
3. Comece a adicionar e gerenciar seus treinos!

### Dados Persistentes
Todos os treinos e o histórico são armazenados automaticamente no navegador. Seus dados permanecem mesmo após fechar a aba.

### Adicionar um Exercício Personalizado
1. Clique no botão "✨ Adicionar Exercício"
2. Preencha as informações:
   - **Nome**: Nome do exercício
   - **Grupo Muscular**: Qual grupo trabalha
   - **Link de Vídeo**: URL do YouTube (opcional)
   - **Observações**: Séries, repetições, etc.
3. Clique em salvar

## 📊 Visualização Mensal

A visualização mensal mostra um gráfico de calor com:
- Dias que você treinou
- Quantidade de exercícios realizados por dia
- Histórico completo do mês

## 🎨 Design

- **Tema Escuro**: Fácil para os olhos
- **Gradientes**: Cores vibrantes (rosa, roxo, azul)
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações Suaves**: Transições e efeitos visuais

## 💾 Armazenamento de Dados

- Chave `treinosSemana`: Armazena os treinos semanais
- Chave `treinosHistorico`: Armazena o histórico mensal de check-ins

## 🔄 Sincronização

Os dados são sincronizados automaticamente entre abas do mesmo navegador quando você realiza qualquer alteração.

## 📱 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móveis

## 🐛 Problemas Comuns

**Dados desaparecendo?**
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache do navegador e recarregue

**Vídeos não carregam?**
- Certifique-se de que os URLs dos vídeos são válidos
- Verifique sua conexão com a internet

## 📝 Licença

Este projeto é de uso livre para fins pessoais.

---

**Desenvolvido com 💜 para melhorar seus treinos!**
