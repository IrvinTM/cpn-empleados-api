import { PrismaClient } from "../generated/prisma/client";
import { IUser } from "../models/user.interface";
import { Storage } from '@google-cloud/storage';

const prisma = new PrismaClient();

export class ExportService {
  private storage: Storage;
  private bucketName: string = 'cpn135bucket'; // 

  constructor() {
  try {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }
    });
    this.bucketName = process.env.GCP_BUCKET_NAME || 'cpn135bucket';
    console.log('Cloud Storage configurado con variables de entorno');
  } catch (error) {
    console.error('Error configurando Cloud Storage:', error);
    throw error;
  }
}
  
  public async exportEmpleadosToCSV(): Promise<string> {
    try {
      console.log('Obteniendo empleados de la base de datos...');
      const empleados = await prisma.empleado.findMany();
      console.log(`Encontrados ${empleados.length} empleados`);
      
      // Encabezado CSV
      let csv = 'id,nombre,email,departamento,fecha_contratacion\n';
      
      // Datos CSV
      empleados.forEach(empleado => {
        const fecha = empleado.fecha_contratacion ? 
          new Date(empleado.fecha_contratacion).toISOString().split('T')[0] : 
          'N/A';
        
        const nombre = this.escapeCsv(empleado.nombre);
        const email = this.escapeCsv(empleado.email);
        const departamento = this.escapeCsv(empleado.departamento);
        
        csv += `${empleado.id},${nombre},${email},${departamento},${fecha}\n`;
      });
      
      console.log('CSV generado exitosamente');
      return csv;
    } catch (error) {
      console.error('Error exportando empleados a CSV:', error);
      throw new Error('Error al exportar empleados de la base de datos');
    }
  }

  public async uploadToCloudStorage(csvData: string, filename: string): Promise<string> {
    try {
      console.log(`Iniciando subida a Cloud Storage...`);
      console.log(`Archivo: ${filename}`);
      console.log(`Registros: ${csvData.split('\n').length - 1}`);
      console.log(`Tamaño: ${Buffer.from(csvData).length} bytes`);
      console.log(`Bucket: ${this.bucketName}`);
      
      // Verificar que hay datos para subir
      if (!csvData || csvData.trim().length === 0) {
        throw new Error('No hay datos CSV para subir');
      }

      // Conexión a Google Cloud Storage
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);
      
      console.log('⬆Subiendo archivo...');
      
      // Subir archivo
      await file.save(csvData, {
        metadata: {
          contentType: 'text/csv',
          cacheControl: 'no-cache'
        }
      });
      
      console.log('Haciendo archivo público...');
      
      // NO HACER el archivo publico
      //await file.makePublic();
      
      // URL real del archivo
      const fileUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
      
      console.log(`Archivo subido exitosamente: ${fileUrl}`);
      return fileUrl;

    } catch (error: any) {
      console.error('Error detallado en Cloud Storage:');
      
      // Errores específicos de Google Cloud
      if (error.code === 404) {
        console.error(`El bucket '${this.bucketName}' no existe`);
        throw new Error(`Bucket '${this.bucketName}' no encontrado. Verificar en Google Cloud Console`);
      } else if (error.code === 403) {
        console.error('Sin permisos para acceder al bucket');
        throw new Error('Permisos insuficientes. Verificar credenciales del Service Account');
      } else if (error.code === 401) {
        console.error('Credenciales inválidas');
        throw new Error('Credenciales de Cloud Storage inválidas');
      } else {
        console.error(`Código: ${error.code}`);
        console.error(`Mensaje: ${error.message}`);
        throw new Error(`Error de Cloud Storage: ${error.message}`);
      }
    }
  }

  private escapeCsv(value: string | null): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // Metodo para verificar conexión
  public async testConnection(): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [exists] = await bucket.exists();
      return exists;
    } catch (error) {
      console.error('Error probando conexión:', error);
      return false;
    }
  }
}