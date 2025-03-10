'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, BarChart3, FileText, ArrowRight, MapPin, CheckCircle } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 font-sans">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-800">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">ReadTogether</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors">Início</a>
            <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors">Funcionalidades</a>
            <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors">Como Usar</a>
            <a href="#" className="text-blue-700 hover:text-blue-500 transition-colors">Contato</a>
          </nav>
          
          <div className="hidden md:flex gap-3">
            <a href="/login" className="text-blue-700 hover:text-blue-500 px-4 py-2 transition-colors">
              Entrar
            </a>
            <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Cadastrar
            </a>
          </div>
          
          <button className="md:hidden text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Leia e aprenda em grupo
            </h1>
            <p className="text-xl text-blue-800 mb-8">
              A plataforma ideal para estudantes e amantes da leitura formarem grupos, 
              lerem documentos simultaneamente e acompanharem o progresso uns dos outros.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                Comece a ler em grupo
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="#features" 
                className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 px-6 py-3 rounded-lg transition-colors"
              >
                Conhecer recursos
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <img 
                src="https://placehold.co/1200x600/e6f2ff/0066cc?text=Dashboard+de+Grupo+de+Leitura" 
                alt="Dashboard da plataforma" 
                className="rounded-lg w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Benefícios */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-12">
            Por que usar ReadTogether
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Grupos de Leitura</h3>
              <p className="text-blue-700">
                Crie e participe de grupos de leitura com colegas de classe ou amigos com interesses similares.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Leitura Sincronizada</h3>
              <p className="text-blue-700">
                Leia PDFs e EPUBs simultaneamente com seus colegas, com destaque em tempo real das páginas.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Acompanhe Progresso</h3>
              <p className="text-blue-700">
                Visualize o progresso de leitura de todos os membros do grupo através de gráficos intuitivos.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Biblioteca Compartilhada</h3>
              <p className="text-blue-700">
                Compartilhe documentos e materiais de estudo com seu grupo de forma simples e organizada.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Como funciona */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-10">
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                Crie ou entre em um grupo
              </h3>
              <p className="text-blue-700 mb-4">
                Inicie seu próprio grupo de leitura ou participe de grupos existentes criados por colegas.
              </p>
              <img 
                src="https://placehold.co/600x340/e6f2ff/0066cc?text=Criação+de+Grupos" 
                alt="Criação de grupos" 
                className="rounded-lg w-full"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                Adicione materiais de leitura
              </h3>
              <p className="text-blue-700 mb-4">
                Faça upload de PDFs, EPUBs ou outros formatos para a biblioteca do grupo.
              </p>
              <img 
                src="https://placehold.co/600x340/e6f2ff/0066cc?text=Upload+de+Documentos" 
                alt="Upload de documentos" 
                className="rounded-lg w-full"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                Leia em conjunto
              </h3>
              <p className="text-blue-700 mb-4">
                Utilize nosso leitor integrado para acompanhar o documento simultaneamente com todos os membros.
              </p>
              <img 
                src="https://placehold.co/600x340/e6f2ff/0066cc?text=Leitura+Sincronizada" 
                alt="Leitura sincronizada" 
                className="rounded-lg w-full"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                Monitore o progresso
              </h3>
              <p className="text-blue-700 mb-4">
                Visualize gráficos detalhados do progresso de leitura de cada membro do grupo.
              </p>
              <img 
                src="https://placehold.co/600x340/e6f2ff/0066cc?text=Gráficos+de+Progresso" 
                alt="Gráficos de progresso" 
                className="rounded-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Destaques do produto */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-10">
            Recursos Exclusivos
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6">
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg"
              >
                <div className="flex-shrink-0 text-blue-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg mb-1">Leitor Sincronizado</h3>
                  <p className="text-blue-700">
                    Nosso leitor permite que todos os membros vejam em tempo real quem está online e em qual página 
                    cada colega está. Perfeito para estudos em grupo ou clubes do livro acadêmicos.
                  </p>
                </div>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg"
              >
                <div className="flex-shrink-0 text-blue-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg mb-1">Anotações Compartilhadas</h3>
                  <p className="text-blue-700">
                    Faça anotações e destaques no texto que podem ser compartilhados com o grupo, 
                    perfeito para estudo colaborativo e revisão de conteúdo.
                  </p>
                </div>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg"
              >
                <div className="flex-shrink-0 text-blue-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg mb-1">Metas de Leitura em Grupo</h3>
                  <p className="text-blue-700">
                    Estabeleça metas de leitura com prazos e acompanhe o progresso coletivo do grupo,
                    aumentando a motivação e a conclusão de materiais de estudo.
                  </p>
                </div>
              </motion.li>
              
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg"
              >
                <div className="flex-shrink-0 text-blue-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg mb-1">Discussões por Capítulo</h3>
                  <p className="text-blue-700">
                    Cada capítulo ou seção tem um espaço dedicado para discussões, perguntas e esclarecimentos,
                    facilitando o debate sobre trechos específicos dos materiais.
                  </p>
                </div>
              </motion.li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar a ler em grupo?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que melhoraram seus hábitos de leitura e aprendizado com ReadTogether.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/signup" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Criar uma conta grátis
            </a>
            <a 
              href="/demo" 
              className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-400 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Ver demonstração
            </a>
          </div>
        </div>
      </section>
      
      {/* Testemunhos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-12">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MS
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Mariana Silva</h3>
                  <p className="text-sm text-blue-600">Estudante de Engenharia</p>
                </div>
              </div>
              <p className="text-blue-700">
                "Com o ReadTogether, nosso grupo de estudo consegue acompanhar artigos científicos juntos. 
                O recurso de ver onde cada pessoa está lendo é incrível para discussões em tempo real."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  RC
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Rafael Costa</h3>
                  <p className="text-sm text-blue-600">Professor de Literatura</p>
                </div>
              </div>
              <p className="text-blue-700">
                "Revolucionou a forma como conduzo meus círculos de leitura. Consigo ver o progresso de cada aluno 
                e identificar quem precisa de ajuda extra com determinadas passagens."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  JA
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Juliana Alves</h3>
                  <p className="text-sm text-blue-600">Clube do Livro Universitário</p>
                </div>
              </div>
              <p className="text-blue-700">
                "Nosso clube do livro universitário cresceu muito após começarmos a usar o ReadTogether. 
                As discussões por capítulo e o acompanhamento de progresso mantêm todos engajados."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold text-xl">ReadTogether</span>
              </div>
              <p className="text-blue-200">
                A plataforma de leitura colaborativa para estudantes e grupos de estudo.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Grupos de Leitura</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Leitor de PDF/EPUB</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Estatísticas de Leitura</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Anotações Compartilhadas</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 ReadTogether. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}