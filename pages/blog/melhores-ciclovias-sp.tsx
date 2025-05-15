import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MelhoresCicloviasSP: React.FC = () => {
  const publicationDate = new Date('2023-08-15');
  const formattedDate = format(publicationDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <>
      <Head>
        <title>As Melhores Ciclovias de São Paulo para Pedalar | BikeShare SP</title>
        <meta 
          name="description" 
          content="Descubra as melhores ciclovias de São Paulo para pedalar em segurança e com conforto. Guia completo com rotas, dicas e pontos de interesse para ciclistas em SP."
        />
        <meta name="keywords" content="ciclovias São Paulo, bike SP, ciclovia SP, ciclovias SP, pedalar em São Paulo, rota ciclismo SP" />
        <meta property="og:title" content="As Melhores Ciclovias de São Paulo para Pedalar" />
        <meta property="og:description" content="Descubra as melhores ciclovias de São Paulo para pedalar em segurança e com conforto. Guia completo com rotas, dicas e pontos de interesse para ciclistas em SP." />
        <meta property="og:image" content="/images/blog/ciclovias-sp.jpg" />
        <meta property="og:url" content="https://bikeshare-sp.com.br/blog/melhores-ciclovias-sp" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://bikeshare-sp.com.br/blog/melhores-ciclovias-sp" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-secondary hover:underline mb-6 inline-block">
            ← Voltar para a página inicial
          </Link>
          
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-zinc-800 dark:text-white mb-4">
              As Melhores Ciclovias de São Paulo para Pedalar
            </h1>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <span className="material-icons text-sm mr-1">calendar_today</span>
              <time dateTime={publicationDate.toISOString()}>{formattedDate}</time>
              <span className="mx-2">|</span>
              <span className="material-icons text-sm mr-1">person</span>
              <span>Equipe BikeShare SP</span>
            </div>
            
            <div className="relative w-full h-80 mb-8 rounded-xl overflow-hidden">
              <Image 
                src="/images/blog/ciclovias-sp.jpg"
                alt="Ciclovia na Avenida Paulista em São Paulo"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            <p className="lead text-xl mb-6">
              São Paulo, a maior metrópole do Brasil, tem investido significativamente na expansão de sua infraestrutura para ciclistas nos últimos anos. Com mais de 600 km de ciclovias, ciclofaixas e ciclorrotas, a cidade oferece diversas opções para quem deseja explorar a capital paulista sobre duas rodas.
            </p>
            
            <h2>As 5 Melhores Ciclovias de São Paulo</h2>
            
            <h3>1. Ciclovia da Avenida Paulista</h3>
            <p>
              A Ciclovia da Avenida Paulista é uma das mais conhecidas e utilizadas da cidade. Com 2,7 km de extensão, ela corta um dos principais eixos econômicos e culturais de São Paulo. Aos domingos, com o programa Paulista Aberta, toda a avenida fica livre para pedestres e ciclistas, tornando-se um verdadeiro parque a céu aberto.
            </p>
            <p>
              <strong>Por que visitar:</strong> Além da infraestrutura de qualidade, pedalar na Paulista permite visitar museus como o MASP, a Casa das Rosas e o Instituto Moreira Salles.
            </p>
            
            <h3>2. Ciclovia da Marginal Pinheiros</h3>
            <p>
              Com aproximadamente 21 km de extensão, a ciclovia da Marginal Pinheiros é uma das mais longas da cidade. Ela acompanha o Rio Pinheiros e oferece uma rota relativamente plana e contínua, ideal para quem busca trajetos mais longos.
            </p>
            <p>
              <strong>Por que visitar:</strong> É uma excelente opção para quem deseja fazer exercícios sem interrupções por semáforos. A vista do rio e a proximidade com o Parque Villa-Lobos são atrativos adicionais.
            </p>
            
            <h3>3. Ciclovia do Parque Ibirapuera</h3>
            <p>
              O Parque Ibirapuera, o mais importante parque urbano de São Paulo, possui uma ciclovia interna com aproximadamente 5 km. O trajeto é ideal para famílias e ciclistas iniciantes devido ao terreno plano e à ausência de veículos motorizados.
            </p>
            <p>
              <strong>Por que visitar:</strong> Além de pedalar em um ambiente arborizado e seguro, você pode aproveitar para visitar os museus e pavilhões do parque, como o MAM (Museu de Arte Moderna) e o Pavilhão Japonês.
            </p>
            
            <h3>4. Ciclovia da Avenida Faria Lima</h3>
            <p>
              Com cerca de 7 km de extensão, a ciclovia da Faria Lima é uma das mais utilizadas pelos ciclistas urbanos que se deslocam para o trabalho. Ela conecta o Largo da Batata ao Parque do Povo, passando por importantes centros empresariais.
            </p>
            <p>
              <strong>Por que visitar:</strong> Ótima infraestrutura, com sinalização adequada e diversas paradas de bicicletas compartilhadas ao longo do trajeto.
            </p>
            
            <h3>5. Ciclovia do Centro Histórico</h3>
            <p>
              As ciclovias e ciclofaixas do centro histórico de São Paulo permitem conhecer monumentos históricos e arquitetônicos importantes da cidade. O circuito passa por locais como a Praça da Sé, o Pátio do Colégio e o Theatro Municipal.
            </p>
            <p>
              <strong>Por que visitar:</strong> Chance de conhecer a história de São Paulo sobre duas rodas, com fácil acesso a museus, restaurantes tradicionais e edifícios históricos.
            </p>
            
            <h2>Dicas para Pedalar com Segurança em São Paulo</h2>
            
            <ul>
              <li><strong>Use equipamentos de segurança:</strong> Capacete, luvas e roupas claras ou com elementos refletivos são essenciais.</li>
              <li><strong>Respeite a sinalização:</strong> Obedeça aos semáforos e sinalizações específicas para ciclistas.</li>
              <li><strong>Hidrate-se:</strong> Leve sempre uma garrafa d'água, especialmente nos dias quentes.</li>
              <li><strong>Planeje seu trajeto:</strong> Consulte mapas de ciclovias disponíveis em aplicativos como Google Maps ou Strava.</li>
              <li><strong>Evite horários de pico:</strong> Se possível, evite os horários de maior movimento, principalmente nas ciclovias mais movimentadas.</li>
            </ul>
            
            <h2>Alugue uma Bicicleta com o BikeShare SP</h2>
            
            <p>
              Não tem bicicleta própria? Sem problemas! O BikeShare SP oferece aluguel de bicicletas em diversas estações espalhadas pela cidade, com planos flexíveis que se adaptam às suas necessidades.
            </p>
            
            <p>
              Com o aplicativo BikeShare SP, você pode localizar a estação mais próxima, verificar a disponibilidade de bicicletas em tempo real e até mesmo traçar rotas para explorar as ciclovias mencionadas neste artigo.
            </p>
            
            <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-xl my-8">
              <h3 className="text-xl font-semibold mb-4">Plano Especial para Cicloturistas</h3>
              <p className="mb-4">
                Aproveite nosso plano especial de fim de semana para explorar as ciclovias de São Paulo com tranquilidade. Por apenas R$ 30,00/dia, você tem acesso ilimitado às nossas bicicletas.
              </p>
              <Link href="/" className="inline-block bg-secondary text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                Saiba mais sobre nossos planos
              </Link>
            </div>
            
            <h2>Conclusão</h2>
            
            <p>
              São Paulo tem se transformado em uma cidade cada vez mais amigável para ciclistas, com investimentos contínuos em infraestrutura dedicada. Explorar a cidade de bicicleta não só é uma forma sustentável de transporte, mas também uma maneira única de conhecer lugares incríveis que muitas vezes passam despercebidos quando utilizamos outros meios de locomoção.
            </p>
            
            <p>
              Escolha uma das ciclovias mencionadas, alugue uma bicicleta do BikeShare SP e descubra uma nova perspectiva desta metrópole vibrante!
            </p>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
              <h3 className="text-xl font-semibold mb-4">Compartilhe este artigo</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <span className="material-icons">facebook</span>
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">
                  <span className="material-icons">twitter</span>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                  <span className="material-icons">whatsapp</span>
                </a>
              </div>
            </div>
          </article>
          
          <div className="my-8">
            <h3 className="text-2xl font-semibold mb-6">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Equipamentos Essenciais para Ciclistas Urbanos</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Conheça os equipamentos que todo ciclista urbano deveria ter para pedalar com segurança em São Paulo.</p>
                  <Link href="#" className="text-secondary hover:underline">Leia mais →</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Como Se Preparar para Seu Primeiro Passeio Ciclístico</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Dicas valiosas para iniciantes que desejam começar a explorar São Paulo de bicicleta.</p>
                  <Link href="#" className="text-secondary hover:underline">Leia mais →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MelhoresCicloviasSP;