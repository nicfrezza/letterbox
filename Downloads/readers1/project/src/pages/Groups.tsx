import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ArrowRight } from 'lucide-react';

const Groups = () => {
  const groups = [
    {
      id: 1,
      name: 'Clube do Livro Tech',
      members: 12,
      currentBook: 'Clean Code',
      progress: 65,
    },
    {
      id: 2,
      name: 'Leitores de Ficção',
      members: 8,
      currentBook: 'Duna',
      progress: 42,
    },
    {
      id: 3,
      name: 'Grupo de Estudos',
      members: 15,
      currentBook: 'Design Patterns',
      progress: 28,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Grupos de Leitura</h1>
        <Link
          to="/create-group"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Criar Novo Grupo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{group.members}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-gray-600 mb-2">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Leitura Atual:</span>
              </div>
              <p className="text-gray-800 font-medium">{group.currentBook}</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{group.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 rounded-full h-2"
                  style={{ width: `${group.progress}%` }}
                />
              </div>
            </div>

            <Link
              to={`/reader/${group.id}/1`}
              className="flex items-center justify-center w-full bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
            >
              Continuar Leitura
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;