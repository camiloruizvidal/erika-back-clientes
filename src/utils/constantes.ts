export class Constantes {
  static readonly LOCAL = 'local';
  static readonly MENSAJE_TIEMPO_EXCEDIDO =
    'El tiempo de 60000ms ha sido excedido';
  static readonly CONEXION_ABORTADA = 'ECONNABORTED';
  static readonly MENSAJE_ERROR_INTERNO = 'Error interno en el servidor';
  static readonly PROPIEDAD_NO_PERMITIDA = (property: string) =>
    `${property} no es una propiedad permitida`;
  static readonly TENANT_YA_EXISTE =
    'Ya existe un tenant registrado con ese NIT';
  static readonly USUARIO_YA_EXISTE =
    'Ya existe un usuario registrado con ese correo';
  static readonly USUARIO_NO_EXISTE = 'El usuario no se encuentra registrado';
  static readonly CREDENCIALES_INVALIDAS = 'Credenciales inválidas';
  static readonly AUTH_HEADER_REQUERIDO =
    'El encabezado Authorization es obligatorio';
  static readonly TOKEN_INVALIDO = 'El token proporcionado no es válido';
  static readonly TOKEN_SIN_CLAIMS =
    'El token no contiene la información requerida';
  static readonly CLIENTE_YA_EXISTE =
    'Ya existe un cliente registrado con ese correo para este tenant';
  static readonly CLIENTE_DOCUMENTO_YA_EXISTE =
    'Ya existe un cliente registrado con ese documento para este tenant';
  static readonly TIPO_DOCUMENTO_NO_ENCONTRADO =
    'El tipo de documento indicado no existe';
  static readonly CLIENTE_NO_ENCONTRADO = 'El cliente indicado no existe';
  static readonly PAQUETE_NO_ENCONTRADO =
    'El paquete indicado no existe o no pertenece al tenant';
  static readonly FRECUENCIA_NO_VALIDA = 'La frecuencia indicada no es válida';
  static readonly DIA_COBRO_OBLIGATORIO =
    'Debe indicar el día de cobro para una suscripción mensual';
  static readonly FRECUENCIA_VALOR_OBLIGATORIA =
    'Debe indicar el valor de la frecuencia cuando la modalidad es por semanas o servicios';
  static readonly SERVICIOS_REQUERIDOS_PARA_PAQUETE =
    'No se encontraron servicios para copiar desde el paquete seleccionado';
  static readonly SERVICIO_NO_PERTENECE_PAQUETE =
    'El servicio indicado no hace parte del paquete original';
  static readonly ASIGNACION_YA_EXISTE =
    'El cliente ya tiene un paquete activo con el mismo paquete original';
  static readonly SERVICIO_DUPLICADO_EN_ASIGNACION =
    'No se permiten servicios duplicados dentro de la asignación';
  static readonly LONGITUD_MINIMA = (campo: string, minimo: number) =>
    `${campo} debe tener al menos ${minimo} caracteres`;
  static readonly VALOR_MINIMO = (campo: string, minimo: number) =>
    `${campo} debe ser mayor o igual a ${minimo}`;
}
