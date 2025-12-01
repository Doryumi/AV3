export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: string;
  capacidade: number;
  alcance: number;
}

export interface Peca {
  nome: string;
  tipo: string;
  fornecedor: string;
  status: string;
  codigoAeronave: string;
}

export interface Etapa {
  nome: string;
  prazo: string;
  status: string;
  codigoAeronave: string;
  funcionarios: string[]; 
}

export interface Funcionario {
  cpf: string;
  nome: string;
  usuario: string;
  senha: string;
  nivelPermissao: number;
}

export interface Teste {
  tipo: string;
  descricao: string;
  resultado: string;
  codigoAeronave: string;
  data: string;
  funcionarioCpf: string;
}

export interface Relatorio {
  aeronave: Aeronave;
  cliente: string;
  dataEntrega: string;
  etapas: Etapa[];
  pecas: Peca[];
  testes: Teste[];
  dataGeracao: string;
}

export interface Usuario {
  usuario: string;
  senha: string;
  nivel: number;
}
