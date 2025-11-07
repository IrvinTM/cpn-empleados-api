import { PrismaClient } from "../generated/prisma/client";
import { IUser } from "../models/user.interface";

const prisma = new PrismaClient();

export class ExportService {
  
  public async exportEmpleadosToCSV(): Promise<string> {
    try {
      const empleados = await prisma.empleado.findMany();
      
      // Encabezado CSV
      let csv = 'id,nombre,email,departamento,fecha_contratacion\n';
      
      empleados.forEach(empleado => {
        const fecha = empleado.fecha_contratacion ? 
          new Date(empleado.fecha_contratacion).toISOString().split('T')[0] : 
          'N/A';
        
        const nombre = this.escapeCsv(empleado.nombre);
        const email = this.escapeCsv(empleado.email);
        const departamento = this.escapeCsv(empleado.departamento);
        
        csv += `${empleado.id},${nombre},${email},${departamento},${fecha}\n`;
      });
      
      return csv;
    } catch (error) {
      console.error('Error exportando empleados a CSV:', error);
      throw new Error('Error al exportar empleados');
    }
  }

  public async uploadToCloudStorage(csvData: string, filename: string): Promise<string> {
    try {
      // Aqui es donde se configura par ala subida del JSON
      // console.log(`Iniciando subida a Cloud Storage: ${filename}`);
      //console.log(`Registros a exportar: ${csvData.split('\n').length - 1}`);
      //console.log(`Tamaño del archivo: ${Buffer.from(csvData).length} bytes`);
      
      // URL simulada del archivo en Cloud Storage
      //const fileUrl = `https://storage.googleapis.com/hr-system-bucket/${filename}`;
      
      return fileUrl;
    } catch (error) {
      console.error('Error subiendo a Cloud Storage:', error);
      throw new Error('Error al subir archivo a Cloud Storage');
    }
  }

  private escapeCsv(value: string | null): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}