export interface ITipoDocumento {
  id: number;
  codigo: string;
  nombreCorto: string;
  nombreLargo: string;
  descripcion: string | null;
  activo: boolean;
}

