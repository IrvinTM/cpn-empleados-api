import { Request, Response } from "express";
import { ExportService } from "../services/export.service";

export class ExportController {
  private exportService: ExportService;

  constructor() {
    this.exportService = new ExportService();
  }

  public async exportEmpleados(req: Request, res: Response): Promise<void> {
    try {
      console.log('Iniciando exportación de empleados...');
      
      // Exportar a CSV
      const csvData = await this.exportService.exportEmpleadosToCSV();
      
      // Crear Nombre de archivo con Timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `empleados-${timestamp}.csv`;
      
      // Subir a Cloud Storage
      const fileUrl = await this.exportService.uploadToCloudStorage(csvData, filename);

      res.status(200).json({
        success: true,
        message: 'Empleados exportados exitosamente a Cloud Storage',
        filename: filename,
        fileUrl: fileUrl,
        recordCount: csvData.split('\n').length - 1, 
      });
      
    } catch (error) {
      console.error('Error en exportación:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar empleados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}