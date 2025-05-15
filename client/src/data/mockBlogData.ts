import { BlogPost, BlogPostSummary, Author, Category } from '@shared/types/blog';

// Autores simulados
export const authors: Author[] = [
  {
    id: '1',
    name: 'Carolina Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Ciclista urbana e especialista em mobilidade sustentável'
  },
  {
    id: '2',
    name: 'Rafael Mendes',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Educador físico e consultor de saúde'
  },
  {
    id: '3',
    name: 'Juliana Costa',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Urbanista e defensora da mobilidade ativa'
  }
];

// Categorias simuladas
export const categories: Category[] = [
  {
    id: '1',
    name: 'Ciclovias',
    slug: 'ciclovias',
    description: 'Tudo sobre ciclovias e infraestrutura para ciclistas'
  },
  {
    id: '2',
    name: 'Saúde',
    slug: 'saude',
    description: 'Dicas e informações sobre saúde e bem-estar no ciclismo'
  },
  {
    id: '3',
    name: 'Mobilidade',
    slug: 'mobilidade',
    description: 'Mobilidade urbana e soluções para cidades'
  },
  {
    id: '4',
    name: 'Dicas',
    slug: 'dicas',
    description: 'Dicas práticas para ciclistas urbanos'
  }
];

// Array com todas as tags usadas nos posts
export const allTags: string[] = [
  'ciclovia',
  'saúde',
  'mobilidade',
  'ciclismo',
  'exercício',
  'bicicleta',
  'urbano',
  'sustentabilidade',
  'segurança',
  'lazer',
  'trânsito',
  'meio ambiente',
  'rota',
  'parque',
  'iniciante',
  'equipamento',
  'dicas',
  'bike share',
  'avenida paulista'
];

// Posts do blog
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'melhores-ciclovias-sp',
    title: 'As 5 melhores ciclovias de São Paulo para pedalar com segurança',
    description: 'Conheça as ciclovias mais seguras e agradáveis para pedalar na cidade de São Paulo, perfeitas tanto para iniciantes quanto para ciclistas experientes.',
    content: `
# As 5 melhores ciclovias de São Paulo para pedalar com segurança

São Paulo possui mais de 600 km de ciclovias, ciclofaixas e ciclorrotas espalhadas pela cidade. Mas nem todas oferecem a mesma experiência em termos de segurança, conservação e paisagem. Separamos as 5 melhores ciclovias para você aproveitar a cidade sobre duas rodas com segurança e conforto.

## 1. Ciclovia da Faria Lima

Com 12,5 km de extensão, a ciclovia da Faria Lima é uma das mais utilizadas da cidade, conectando a zona oeste à zona sul. Totalmente segregada do tráfego de veículos e com boa sinalização, é uma opção segura tanto para deslocamentos diários quanto para passeios de lazer.

**Por que pedalar lá**: Infraestrutura de qualidade, bem conectada com outras ciclovias e fácil acesso a estações de metrô e pontos de interesse da cidade.

## 2. Ciclovia da Paulista

Aberta todos os domingos para lazer, a ciclovia da Avenida Paulista é um dos símbolos da cultura ciclística paulistana. Com 2,7 km de extensão, percorre um dos cartões-postais da cidade e oferece acesso a museus, parques e diversas opções gastronômicas.

**Por que pedalar lá**: Experiência cultural única, via totalmente plana e excelente infraestrutura.

## 3. Ciclovia do Rio Pinheiros

Com 21,5 km ao longo do Rio Pinheiros, esta ciclovia é ideal para quem busca trajetos mais longos sem interrupções. Recentemente revitalizada, oferece bela vista do rio e da paisagem urbana.

**Por que pedalar lá**: Trajeto longo sem cruzamentos, ótima opção para treinos e excelente conexão norte-sul.

## 4. Ciclovia do Parque Ibirapuera

Com aproximadamente 5 km dentro do parque mais famoso da cidade, esta ciclovia é perfeita para iniciantes e famílias. O ambiente arborizado e seguro torna o passeio ainda mais agradável.

**Por que pedalar lá**: Ambiente tranquilo, rodeado por natureza e excelente para iniciantes.

## 5. Ciclovia da Radial Leste

Conectando o centro ao extremo leste, esta ciclovia de 12 km é fundamental para quem usa a bicicleta como meio de transporte. Passa por importantes pontos como a estação Tatuapé e o Parque do Povo.

**Por que pedalar lá**: Boa conexão leste-centro e infraestrutura adequada para deslocamentos diários.

## Dicas de segurança

Independentemente da ciclovia escolhida, sempre pedale com equipamentos de segurança, respeite as sinalizações e fique atento aos outros usuários da via. Lembre-se também de carregar água, protetor solar e, se possível, um kit básico para reparos na bicicleta.

O BikeShare SP está presente próximo a todas essas ciclovias, facilitando seu acesso às melhores rotas ciclísticas da cidade. Baixe nosso aplicativo e desfrute dessas opções com nossas bicicletas compartilhadas!
    `,
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[0],
    category: categories[0],
    publishedAt: '2023-08-15T10:00:00Z',
    readingTime: 8,
    tags: ['ciclovia', 'ciclismo', 'segurança', 'São Paulo', 'mobilidade', 'lazer'],
    featured: true
  },
  {
    id: '2',
    slug: 'beneficios-saude-ciclismo',
    title: '7 benefícios do ciclismo para sua saúde física e mental',
    description: 'Descubra como pedalar regularmente pode melhorar sua saúde física, reduzir o estresse e aumentar sua qualidade de vida.',
    content: `
# 7 benefícios do ciclismo para sua saúde física e mental

O ciclismo é muito mais que um meio de transporte ou uma atividade de lazer. É uma poderosa ferramenta para melhorar sua saúde de forma integrada. Neste artigo, compartilhamos 7 benefícios cientificamente comprovados do ciclismo para seu corpo e mente.

## 1. Fortalecimento cardiovascular

Pedalar regularmente fortalece seu coração, melhora a circulação sanguínea e reduz o risco de doenças cardiovasculares. Estudos mostram que ciclistas regulares têm, em média, 15% menos chances de sofrer infarto comparados a pessoas sedentárias.

## 2. Fortalecimento muscular

O ciclismo trabalha diversos grupos musculares simultaneamente, com ênfase nas pernas e glúteos. Diferente da corrida, causa menos impacto nas articulações, sendo ideal para fortalecimento muscular sem sobrecarga.

## 3. Controle de peso

Uma hora de pedalada em ritmo moderado pode queimar entre 400 e 600 calorias, dependendo de sua condição física e intensidade do exercício. O ciclismo regular é um excelente aliado para manutenção do peso ideal.

## 4. Melhora da saúde mental

Ao pedalar, seu corpo libera endorfinas, serotonina e dopamina - os chamados "hormônios da felicidade". Pesquisas indicam que ciclistas regulares têm 30% menos chances de desenvolver quadros de depressão e ansiedade.

## 5. Redução do estresse

O contato com a natureza, a sensação de liberdade e o foco necessário para pedalar contribuem significativamente para redução dos níveis de cortisol (hormônio do estresse) no organismo.

## 6. Melhora do sono

O exercício físico regular, como o ciclismo, contribui para um sono mais profundo e reparador. Pessoas que pedalam ao menos três vezes por semana relatam melhora de 70% na qualidade do sono.

## 7. Aumento da longevidade

Estudos de longo prazo demonstram que pessoas que se deslocam de bicicleta regularmente vivem, em média, dois anos a mais que indivíduos sedentários, além de apresentarem melhor qualidade de vida na terceira idade.

## Como começar a pedalar

Você não precisa ser um atleta para aproveitar esses benefícios. Comece aos poucos, escolhendo rotas mais planas e curtas, e aumente gradualmente a intensidade e duração dos percursos.

Com o BikeShare SP, você pode começar a pedalar hoje mesmo, sem a necessidade de investir em uma bicicleta própria. Nosso sistema de compartilhamento permite que você desfrute de todos esses benefícios de forma prática e acessível.

Lembre-se: sempre pedale com equipamentos de segurança e respeite as leis de trânsito. Sua saúde agradece, e o planeta também!
    `,
    coverImage: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[1],
    category: categories[1],
    publishedAt: '2023-09-02T14:30:00Z',
    readingTime: 10,
    tags: ['saúde', 'ciclismo', 'exercício', 'bem-estar', 'estresse'],
    featured: true
  },
  {
    id: '3',
    slug: 'mobilidade-urbana-bicicletas',
    title: 'Mobilidade urbana sustentável: como as bicicletas estão transformando São Paulo',
    description: 'Uma análise sobre o impacto positivo das bicicletas na mobilidade urbana de São Paulo e os desafios ainda existentes.',
    content: `
# Mobilidade urbana sustentável: como as bicicletas estão transformando São Paulo

A maior metrópole da América Latina enfrenta desafios enormes em termos de mobilidade urbana. Com mais de 12 milhões de habitantes e uma frota de aproximadamente 8 milhões de veículos, São Paulo busca alternativas para reduzir congestionamentos, poluição e melhorar a qualidade de vida de seus cidadãos. Neste cenário, a bicicleta surge como protagonista de uma importante transformação.

## A evolução da infraestrutura ciclística

Em 2014, São Paulo contava com apenas 120 km de vias cicláveis. Hoje, este número ultrapassa 600 km, graças a políticas públicas e à pressão da sociedade civil organizada. Essa expansão não apenas aumentou o número de ciclistas, mas também promoveu uma mudança cultural significativa na cidade.

## Impactos positivos mensuráveis

### Redução de congestionamentos

Estudos da CET (Companhia de Engenharia de Tráfego) mostram que vias com ciclofaixas bem implementadas tiveram redução de até 25% no tempo de deslocamento geral, beneficiando inclusive motoristas.

### Melhoria da qualidade do ar

A substituição de viagens motorizadas por bicicletas reduziu a emissão de aproximadamente 1.500 toneladas de CO₂ anualmente em São Paulo.

### Economia para os usuários

Quem substitui o transporte público pela bicicleta economiza, em média, R$ 2.400 por ano. Para quem deixa o carro em casa, a economia pode chegar a R$ 10.000 anuais.

### Impacto no comércio local

Estabelecimentos próximos a ciclofaixas reportam aumento médio de 15% no faturamento após a implementação da infraestrutura cicloviária.

## Desafios persistentes

Apesar dos avanços, ainda enfrentamos obstáculos significativos:

1. **Conectividade entre ciclovias**: Muitas ciclovias ainda são "ilhas" desconectadas, dificultando trajetos contínuos.

2. **Segurança**: Os índices de acidentes envolvendo ciclistas, embora em queda, ainda são preocupantes.

3. **Cultura de respeito**: A convivência entre diferentes modais ainda precisa evoluir para um ambiente de maior respeito mútuo.

4. **Integração com transporte público**: Apesar de melhorias, a integração entre bicicletas e outros meios de transporte ainda é limitada.

## O papel do bike sharing

Sistemas de compartilhamento de bicicletas, como o BikeShare SP, têm sido fundamentais para democratizar o acesso à bicicleta e introduzir mais pessoas ao ciclismo urbano. A flexibilidade de pegar e devolver a bicicleta em diferentes pontos da cidade facilita a integração com outros modais e resolve a "primeira/última milha" do trajeto.

## O futuro da mobilidade em São Paulo

A tendência é que a bicicleta ocupe um papel cada vez mais relevante no ecossistema de mobilidade paulistano. Projetos em andamento incluem:

- Expansão das ciclovias para mais 200 km nos próximos 3 anos
- Implementação de "superhighways" para bicicletas em corredores estratégicos
- Maior integração com o transporte público, com bicicletários seguros nas estações
- Incentivos fiscais para empresas que promovam o uso da bicicleta entre funcionários

A transformação de São Paulo em uma cidade mais amigável às bicicletas é um processo em andamento, com resultados promissores e desafios a superar. O engajamento da população, empresas e poder público será determinante para consolidar essa mudança.

Faça parte desta transformação você também. O BikeShare SP está à sua disposição para que você experimente uma forma mais sustentável, saudável e eficiente de se deslocar pela cidade.
    `,
    coverImage: 'https://images.unsplash.com/photo-1528837516156-0a8469bbcec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[2],
    category: categories[2],
    publishedAt: '2023-09-20T09:15:00Z',
    readingTime: 12,
    tags: ['mobilidade', 'sustentabilidade', 'urbanismo', 'ciclismo', 'São Paulo'],
    featured: false
  },
  {
    id: '4',
    slug: 'guia-iniciantes-ciclismo-urbano',
    title: 'Guia completo para iniciantes no ciclismo urbano',
    description: 'Tudo o que você precisa saber para começar a usar a bicicleta como meio de transporte na cidade com segurança e conforto.',
    content: `
# Guia completo para iniciantes no ciclismo urbano

Está pensando em adotar a bicicleta como meio de transporte, mas não sabe por onde começar? Este guia foi feito especialmente para você! Aqui você encontrará todas as informações necessárias para iniciar sua jornada como ciclista urbano com segurança e confiança.

## Equipamentos essenciais

### A bicicleta certa

Para deslocamentos urbanos, recomendamos:
- **Bicicleta urbana ou híbrida**: Combina conforto e eficiência
- **Bicicleta dobrável**: Ideal para integração com transporte público
- **Bicicleta compartilhada**: Opção prática e econômica para começar

Com o BikeShare SP, você não precisa investir em uma bicicleta própria inicialmente. Experimente nosso serviço para entender qual tipo de bicicleta melhor atende suas necessidades.

### Equipamentos de segurança

Itens indispensáveis:
- **Capacete**: Protege em caso de quedas e colisões
- **Luzes dianteira (branca) e traseira (vermelha)**: Fundamentais para visibilidade noturna
- **Campainha ou buzina**: Para sinalização sonora
- **Espelho retrovisor**: Amplia sua visão do trânsito
- **Roupas claras ou com elementos refletivos**: Aumentam sua visibilidade

### Acessórios úteis

Facilitam sua experiência:
- **Cadeado de qualidade**: Para estacionar com segurança
- **Alforjes ou mochila apropriada**: Para transportar seus pertences
- **Paralamas**: Proteção contra água e sujeira
- **Kit de reparos básico**: Para emergências mecânicas

## Planejando suas rotas

### Por onde começar

1. **Inicie com trajetos curtos**: 2-5 km é uma distância ideal para adaptação
2. **Priorize ciclovias e ciclofaixas**: Consulte o mapa cicloviário da cidade
3. **Evite vias de alto tráfego**: Mesmo que isso signifique um caminho um pouco mais longo
4. **Identifique rotas alternativas**: Tenha sempre um "plano B" caso encontre bloqueios

### Aplicativos úteis

- **Google Maps**: Permite visualizar ciclovias e calcular rotas
- **Strava**: Além de registrar seus percursos, permite descobrir rotas populares
- **BikeShare SP**: Para localizar nossas estações de bicicletas compartilhadas

## Legislação e comportamento no trânsito

### Seus direitos e deveres

- Bicicletas são veículos: têm direito de circular na via e devem respeitar o Código de Trânsito
- Ciclistas devem sinalizar suas manobras
- É proibido pedalar em calçadas (exceto em situações específicas)
- Respeite semáforos e sinalizações

### Dicas de comportamento seguro

- Mantenha distância de veículos estacionados (cuidado com abertura de portas)
- Evite pontos cegos de ônibus e caminhões
- Pedale em linha reta e de forma previsível
- Fique atento a buracos, grades e tampas de bueiro
- Estabeleça contato visual com motoristas em cruzamentos

## Integração com transporte público

Em São Paulo, as bicicletas podem ser transportadas em:
- Metrô e CPTM: fora dos horários de pico
- Terminais de ônibus: Muitos contam com bicicletários
- Estações com bicicletários seguros: Consulte os locais no site da SPTrans

## Condicionamento físico

Não se preocupe em estar "em forma" para começar a pedalar. O importante é:
- Comece devagar e aumente gradualmente distância e intensidade
- Lembre-se de se hidratar antes, durante e após o percurso
- Use roupas confortáveis e adequadas ao clima
- Respeite seus limites: é melhor chegar um pouco atrasado do que exausto

## Comunidade ciclística

Conecte-se com outros ciclistas:
- Grupos de pedal para iniciantes
- Fóruns e comunidades online
- Eventos ciclísticos da cidade
- Oficinas comunitárias de mecânica

## Conclusão

Começar a pedalar na cidade pode parecer intimidador, mas com preparação adequada, torna-se uma atividade segura e extremamente gratificante. Além dos benefícios à saúde e ao meio ambiente, você descobrirá uma nova forma de se relacionar com o espaço urbano.

O BikeShare SP está à sua disposição para os primeiros pedaladas. Baixe nosso aplicativo e comece sua jornada como ciclista urbano hoje mesmo!
    `,
    coverImage: 'https://images.unsplash.com/photo-1577990905584-4342667b4ce5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[0],
    category: categories[3],
    publishedAt: '2023-10-05T13:45:00Z',
    readingTime: 15,
    tags: ['iniciante', 'ciclismo', 'dicas', 'segurança', 'urbano', 'equipamento'],
    featured: false
  },
  {
    id: '5',
    slug: 'pedalando-na-avenida-paulista',
    title: 'Um domingo na ciclofaixa de lazer da Avenida Paulista',
    description: 'Guia completo para aproveitar ao máximo a ciclofaixa de lazer da Avenida Paulista aos domingos, incluindo atrações, paradas recomendadas e dicas práticas.',
    content: `
# Um domingo na ciclofaixa de lazer da Avenida Paulista

Existe programa mais gostoso que pedalar pela Avenida Paulista num domingo ensolarado? A icônica avenida de São Paulo se transforma completamente aos domingos, quando o trânsito dá lugar aos pedestres e ciclistas, criando um dos espaços de lazer mais democráticos e vibrantes da cidade.

## História da ciclofaixa de lazer

Iniciada em 2009, a ciclofaixa de lazer dominical foi um projeto pioneiro que rapidamente conquistou os paulistanos. O que começou como uma experiência em algumas vias se expandiu para conectar parques e pontos de interesse da cidade. A Avenida Paulista, adicionada ao circuito posteriormente, tornou-se o trecho mais popular e emblemático.

Em 2015, a avenida passou a ser totalmente fechada para carros aos domingos, consolidando um movimento de reapropriação do espaço público pelos cidadãos.

## Horário e estrutura

- **Horário oficial**: das 8h às 16h, todos os domingos e feriados nacionais
- **Extensão**: 2,7 km ao longo de toda a Avenida Paulista
- **Serviços disponíveis**: pontos de apoio com bombas de ar, água e banheiros químicos

## Atrações imperdíveis ao longo do percurso

A beleza de pedalar na Paulista está também nas paradas que você pode fazer. Aqui estão algumas atrações que valem uma visita:

### Museus e Centros Culturais

- **MASP (Museu de Arte de São Paulo)**: Com sua arquitetura icônica e acervo de classe mundial
- **Japan House**: Centro cultural que celebra a cultura japonesa
- **Instituto Moreira Salles**: Fotografia, literatura e exposições temporárias
- **Centro Cultural Fiesp**: Arte contemporânea com entrada gratuita
- **Sesc Paulista**: Exposições, atividades e uma vista incrível da cidade no terraço

### Gastronomia e Cafés

- **Mirante Nove de Julho**: Café charmoso com vista para o túnel da Avenida 9 de Julho
- **Café do MASP**: Pausa para um café com vista para a avenida
- **Coffee Lab**: Para os amantes de café especial
- **Praça de Alimentação do Shopping Cidade São Paulo**: Diversas opções gastronômicas

### Espaços Verdes

- **Parque Trianon**: Pequena ilha de mata atlântica no coração da avenida
- **Praça do Ciclista**: Ponto de encontro dos ciclistas na avenida

## Dicas práticas para aproveitar ao máximo

### O que levar

- Protetor solar (mesmo em dias nublados)
- Água
- Snacks leves
- Cadeado (para paradas nos museus e atrações)
- Dinheiro/cartão para as atrações e alimentação
- Cartão de crédito para desbloquear bicicletas do BikeShare SP

### Melhores horários

- **8h às 10h**: Ideal para quem busca tranquilidade e menos movimento
- **10h às 14h**: Período de maior movimento e programação cultural de rua
- **14h às 16h**: O movimento começa a diminuir, mas ainda com todas as atrações funcionando

### Integrando com outras ciclofaixas

A ciclofaixa da Paulista conecta-se com outros circuitos, permitindo roteiros mais longos:

- **Rota para o Ibirapuera**: Seguindo pela Rua Pamplona
- **Rota para o Centro**: Via Rua da Consolação
- **Rota para Pinheiros**: Seguindo pela Rua Augusta

## BikeShare SP na Paulista

Não tem bicicleta própria? Sem problemas! O BikeShare SP conta com várias estações ao longo da Avenida Paulista:

- Estação MASP
- Estação Trianon-MASP
- Estação Paulista/Consolação
- Estação Paulista/Augusta

Nosso aplicativo mostra em tempo real a disponibilidade de bicicletas em cada estação. Aos domingos, oferecemos promoções especiais para uso nas ciclofaixas de lazer.

## Programação cultural

Um dos grandes atrativos da Paulista aos domingos é a rica programação cultural gratuita:

- Artistas de rua
- Performances musicais
- Feiras de artesanato
- Manifestações artísticas diversas

A programação varia a cada semana, mas a energia vibrante é constante.

## Conclusão

Um domingo na ciclofaixa da Avenida Paulista é mais que um simples passeio de bicicleta: é uma experiência completa que une exercício, cultura, gastronomia e a verdadeira essência urbana de São Paulo. É a cidade se mostrando em sua melhor versão, mais humana e acolhedora.

Que tal experimentar neste fim de semana? O BikeShare SP estará lá, pronto para fazer parte dessa experiência inesquecível.
    `,
    coverImage: 'https://images.unsplash.com/photo-1583589259561-0402377f1d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[2],
    category: categories[0],
    publishedAt: '2023-10-15T16:20:00Z',
    readingTime: 10,
    tags: ['ciclovia', 'lazer', 'avenida paulista', 'São Paulo', 'fim de semana', 'cultura'],
    featured: false
  },
  {
    id: '6',
    slug: 'dicas-pedalar-chuva',
    title: 'Como pedalar com segurança em dias de chuva',
    description: 'Dicas práticas para ciclistas que não querem deixar a bicicleta de lado nem mesmo nos dias chuvosos, garantindo segurança e conforto.',
    content: `
# Como pedalar com segurança em dias de chuva

Em São Paulo, cidade conhecida por suas chuvas repentinas e intensas, muitos ciclistas são pegos de surpresa pelo mau tempo. Outros simplesmente evitam pedalar em dias chuvosos. Mas com as dicas e equipamentos corretos, é possível pedalar com segurança mesmo debaixo d'água.

## Equipamentos essenciais para pedalar na chuva

### Vestuário à prova d'água

- **Capa de chuva específica para ciclismo**: Diferente das capas comuns, possui corte adequado para a posição de pedalada e não atrapalha os movimentos
- **Calça impermeável**: Protege suas pernas e evita aquela sensação desagradável de roupa molhada
- **Galochas ou cobre-sapatos impermeáveis**: Mantêm seus pés secos
- **Luvas impermeáveis**: Além de proteger da água, melhoram a aderência no guidão molhado

### Acessórios para a bicicleta

- **Paralamas dianteiro e traseiro**: Essenciais para evitar que a água e lama sejam arremessadas em você
- **Luzes mais potentes**: A visibilidade é reduzida na chuva, então use luzes mais brilhantes que o normal
- **Proteção para equipamentos eletrônicos**: Capas impermeáveis para celular, GPS ou outros dispositivos
- **Óculos transparentes ou com lentes amarelas**: Protegem seus olhos da água e melhoram a visibilidade

## Ajustes na bicicleta

Algumas modificações podem tornar sua bicicleta mais segura em condições chuvosas:

- **Pneus com bom desenho**: Para melhor tração em piso molhado
- **Pressão dos pneus levemente reduzida**: Aumenta a área de contato com o solo
- **Freios bem regulados**: Os freios perdem eficiência na chuva, portanto devem estar em perfeitas condições
- **Corrente bem lubrificada**: Use lubrificantes específicos para condições úmidas

## Técnicas de pilotagem para dias chuvosos

### Frenagem

- Comece a frear com antecedência muito maior que o normal
- Use os dois freios de forma gradual e progressiva
- Evite frenagens bruscas que podem causar derrapagens

### Curvas

- Reduza a velocidade antes de entrar nas curvas
- Mantenha a bicicleta mais "em pé" nas curvas, inclinando menos
- Evite pinturas de solo e tampas metálicas, extremamente escorregadias quando molhadas

### Obstáculos a evitar

- **Poças d'água**: Podem esconder buracos e objetos perigosos
- **Folhas molhadas**: São tão escorregadias quanto gelo
- **Faixas de pedestres e pinturas no asfalto**: Perdem muito atrito quando molhadas
- **Trilhos de bonde e grades metálicas**: Cruzar sempre em ângulo reto

## Cuidados pós-pedalada

O cuidado com sua bicicleta depois de pedalar na chuva é essencial para evitar danos e corrosão:

1. **Seque a bicicleta**: Use um pano macio para secar toda a estrutura
2. **Limpe a corrente e as engrenagens**: Remova o excesso de água e sujeira
3. **Aplique lubrificante na transmissão**: Após secá-la completamente
4. **Verifique os freios**: Remova água e sujeira das pastilhas e superfícies de frenagem

## Plano B: BikeShare SP

Se a chuva te pegou de surpresa ou se as condições climáticas piorarem durante seu trajeto, lembre-se que o BikeShare SP pode ser seu plano B. Você pode:

- Devolver a bicicleta na estação mais próxima e continuar seu trajeto com transporte público
- Aguardar a chuva passar em local coberto e depois pegar outra bicicleta
- Usar nosso serviço apenas em trechos onde não há transporte público disponível

## Considerações finais

Pedalar na chuva pode ser um desafio, mas com o equipamento adequado e as técnicas corretas, torna-se uma experiência segura e até mesmo agradável. Além disso, ciclistas que enfrentam diferentes condições climáticas desenvolvem maior habilidade e confiança.

Lembre-se sempre: sua segurança vem em primeiro lugar. Se as condições estiverem muito adversas, como tempestades com raios ou alagamentos, considere outras alternativas de transporte.

Com o BikeShare SP, você tem a flexibilidade de adaptar seus planos conforme as condições climáticas, sempre contando com bicicletas bem mantidas e em perfeito funcionamento para enfrentar as ruas molhadas com segurança.
    `,
    coverImage: 'https://images.unsplash.com/photo-1558012597-9e5601b5f16e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    author: authors[0],
    category: categories[3],
    publishedAt: '2023-11-01T11:00:00Z',
    readingTime: 9,
    tags: ['ciclismo', 'segurança', 'chuva', 'equipamento', 'dicas'],
    featured: false
  }
];

// Posts em formato resumido (para listagens)
export const blogPostSummaries: BlogPostSummary[] = blogPosts.map(post => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  description: post.description,
  coverImage: post.coverImage,
  author: post.author,
  category: post.category,
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
  tags: post.tags,
  featured: post.featured
}));